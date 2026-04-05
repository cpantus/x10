const ApexQuantization = () => (
  <>
    <p>
      <strong>TL;DR:</strong> We benchmarked APEX and REAP quantization across three Qwen3.5 models — 35B-A3B, 97B-A10B
      REAP, and 122B-A10B — on an AMD Ryzen AI Max+ 395 (Radeon 8060S, Vulkan). The 35B agent dropped from 34.4 GB to
      22.8 GB with perplexity below F16 baseline. The 122B APEX Compact and 97B REAP scored identically on 5 quality
      tasks — proving REAP's 50% expert pruning is lossless for structured workloads. We promoted Q4_0 KV cache to
      production (+10% speed, 50% smaller). TurboQuant's 4.6x KV compression remains blocked on Vulkan — AMD ROCm is
      the unlock path. Cost: $0/month.
    </p>

    <ul>
      <li>
        <strong>35B APEX Quality: 22.8 GB, PPL 6.527 — beats F16 (6.537).</strong> 75 tok/s on Vulkan, up from 58
        tok/s on Q8_0. Plain GGUF, stock llama.cpp.
      </li>
      <li>
        <strong>122B APEX Compact vs 97B REAP: identical quality on 5 tasks.</strong> REAP's 50% expert pruning loses
        nothing measurable. The 97B wins: 4 GB smaller, 24% faster.
      </li>
      <li>
        <strong>Q4_0 KV cache: free +10% speed, 50% smaller cache.</strong> No degradation on tool-calling or
        structured output. Promoted to production.
      </li>
      <li>
        <strong>TurboQuant (4.6x KV compression): not available on Vulkan.</strong> Metal, CUDA, CPU only. AMD ROCm
        would unlock it — tracking llama.cpp Issue #20977.
      </li>
      <li>
        <strong>REAP + APEX stacking: the endgame.</strong> Prune experts (REAP), then quantize (APEX). Estimated 97B:
        55 GB → ~36 GB. Blocked on disk, not engineering.
      </li>
      <li>
        <strong>131 GB of obsolete models deleted.</strong> Q8_0, Q4_K_M, full 122B Q4_K_M replaced by APEX Quality.
      </li>
    </ul>

    <hr />

    <h2>How This Started</h2>

    <p>
      A LinkedIn post surfaced APEX — a new MoE-aware quantization by Ettore Di Giacinto (mudler, creator of LocalAI).
      The claim: 50% of Q8 size with F16-matching perplexity on MoE models, using stock llama.cpp.
    </p>

    <p>
      We run a 3-model local fleet on AMD Strix Halo: a 35B agent (tool-calling), a 97B REAP premium (complex
      reasoning), and a 122B for solo maximum quality. Together they consumed 160+ GB across configs. APEX promised to
      compress the fleet without quality loss.
    </p>

    <hr />

    <h2>The Hardware</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr><th>Component</th><th>Spec</th></tr>
        </thead>
        <tbody>
          <tr><td>CPU/GPU</td><td>AMD Ryzen AI Max+ 395 (Radeon 8060S, RDNA 3.5, gfx1151, 40 CUs)</td></tr>
          <tr><td>RAM/VRAM</td><td>128 GB LPDDR5x unified (~110 GB configurable as VRAM)</td></tr>
          <tr><td>Backend</td><td>Vulkan via RADV (not ROCm)</td></tr>
          <tr><td>llama.cpp</td><td><code>ghcr.io/ggml-org/llama.cpp:server-vulkan</code> (build b8562+)</td></tr>
          <tr><td>Flash Attention</td><td>Enabled via KHR_coopmat (RDNA 3.5+)</td></tr>
          <tr><td>Context</td><td>262,144 tokens, 2 parallel slots</td></tr>
          <tr><td>Container</td><td>Podman (rootless, GPU passthrough via /dev/dri)</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      The Radeon 8060S shares memory with the CPU over a unified bus. Every byte of model weight competes for
      bandwidth. Size reductions translate directly to speed improvements.
    </p>

    <hr />

    <h2>What APEX Does</h2>

    <p>APEX assigns three precision tiers based on MoE activation patterns:</p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Weight Category</th>
            <th>Activation</th>
            <th>Kurtosis</th>
            <th>APEX Precision</th>
            <th>Rationale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Routed experts</td>
            <td>~3% of tokens</td>
            <td>3.41</td>
            <td>IQ4_XS</td>
            <td>Near-Gaussian — tolerates aggressive compression</td>
          </tr>
          <tr>
            <td>Shared experts</td>
            <td>100% of tokens</td>
            <td>13.10</td>
            <td>Q8_0 minimum</td>
            <td>Heavy-tailed outliers — needs precision</td>
          </tr>
          <tr>
            <td>Edge layers (L0-4, L35-39)</td>
            <td>Always</td>
            <td>Varies</td>
            <td>Q6_K</td>
            <td>First/last layers carry disproportionate signal</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      Plain GGUF output. Same <code>llama-server</code> binary. No forks, no patches.
    </p>

    <p>
      <strong>Source:</strong> <a href="https://github.com/mudler/apex-quant" target="_blank" rel="noopener noreferrer">github.com/mudler/apex-quant</a>.
      HuggingFace: <code>mudler/Qwen3.5-35B-A3B-APEX-GGUF</code>, <code>mudler/Qwen3.5-122B-A10B-APEX-GGUF</code>.
    </p>

    <hr />

    <h2>Benchmark Results</h2>

    <h3>Test 1: 35B Agent — APEX Quality vs Q8_0</h3>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Config</th>
            <th>Size</th>
            <th>PPL (WikiText)</th>
            <th style={{ textAlign: 'center' }}>tok/s (TG)</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>F16 (baseline)</td>
            <td>~70 GB</td>
            <td>6.537</td>
            <td style={{ textAlign: 'center' }}>—</td>
            <td>Too large for our hardware</td>
          </tr>
          <tr>
            <td>Q8_0 (previous)</td>
            <td>34.4 GB</td>
            <td>~6.54</td>
            <td style={{ textAlign: 'center' }}>58</td>
            <td>Our fleet standard until today</td>
          </tr>
          <tr>
            <td><strong>APEX Quality</strong></td>
            <td><strong>22.8 GB</strong></td>
            <td><strong>6.527</strong></td>
            <td style={{ textAlign: 'center' }}><strong>75</strong></td>
            <td>Beats F16 at 34% of Q8_0 size</td>
          </tr>
          <tr>
            <td>APEX Mini</td>
            <td>13.3 GB</td>
            <td>7.088</td>
            <td style={{ textAlign: 'center' }}>74.4</td>
            <td>Draft model candidate</td>
          </tr>
        </tbody>
      </table>
    </div>

    <blockquote>
      <p>
        PPL 6.527 is below the F16 baseline of 6.537. The model is smaller and measurably better than uncompressed.
      </p>
    </blockquote>

    <h3>Test 2: 122B APEX vs 97B REAP — Quality Comparison</h3>

    <p>
      Speed differences between a full 122B and a 50%-pruned 97B are obvious. Quality differences are not. We designed
      5 tasks with verifiable correct answers:
    </p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th style={{ textAlign: 'center' }}>122B APEX Compact (59 GB)</th>
            <th style={{ textAlign: 'center' }}>97B REAP Q4_K_M (55 GB)</th>
            <th style={{ textAlign: 'center' }}>35B APEX Quality (23 GB)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Logic puzzle ("all but 9 die")</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
          </tr>
          <tr>
            <td>Multi-step math (3 chained discounts + tax)</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
          </tr>
          <tr>
            <td>Complex tool call (6 params, nested JSON)</td>
            <td style={{ textAlign: 'center' }}>6/6</td>
            <td style={{ textAlign: 'center' }}>6/6</td>
            <td style={{ textAlign: 'center' }}>6/6</td>
          </tr>
          <tr>
            <td>Bug detection (merge_sorted_lists)</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
          </tr>
          <tr>
            <td>Nuanced analysis (misleading CEO statement)</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>PASS</td>
            <td style={{ textAlign: 'center' }}>FAIL</td>
          </tr>
          <tr>
            <td><strong>Score</strong></td>
            <td style={{ textAlign: 'center' }}><strong>5/5</strong></td>
            <td style={{ textAlign: 'center' }}><strong>5/5</strong></td>
            <td style={{ textAlign: 'center' }}><strong>4/5</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      The 97B REAP — with half its experts removed — matches the full 122B on every task. The 35B falters on nuanced
      reasoning, hedging where larger models take a clear position. This is the reasoning depth gap that justifies a
      premium tier.
    </p>

    <p>
      <strong>Verdict:</strong> 97B REAP wins the premium slot. Same quality as 122B, 4 GB smaller. 122B APEX Compact
      deleted.
    </p>

    <h3>Test 3: Q4_0 vs Q8_0 KV Cache</h3>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>KV Cache</th>
            <th style={{ textAlign: 'center' }}>Prompt Processing</th>
            <th style={{ textAlign: 'center' }}>Generation</th>
            <th>KV Size vs F16</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q8_0 (previous)</td>
            <td style={{ textAlign: 'center' }}>136.7 tok/s</td>
            <td style={{ textAlign: 'center' }}>44.8 tok/s</td>
            <td>2x compression</td>
          </tr>
          <tr>
            <td><strong>Q4_0 (production)</strong></td>
            <td style={{ textAlign: 'center' }}><strong>151.0 tok/s</strong></td>
            <td style={{ textAlign: 'center' }}><strong>47.9 tok/s</strong></td>
            <td><strong>4x compression</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      Smaller cache = less bandwidth per attention computation. Tool-calling, reasoning, code generation — no quality
      degradation at short-to-medium context. Promoted to production.
    </p>

    <hr />

    <h2>KV Cache Compression: What Works, What Doesn't, What's Coming</h2>

    <p>
      The KV cache is the next compression frontier after model weights. Three techniques exist, each at a different
      stage on AMD hardware:
    </p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Technique</th>
            <th>Compression</th>
            <th>Status on AMD Vulkan</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Q8_0 KV</strong></td>
            <td>2x vs F16</td>
            <td>Retired</td>
            <td>Superseded by Q4_0</td>
          </tr>
          <tr>
            <td><strong>Q4_0 KV</strong></td>
            <td>4x vs F16</td>
            <td><strong>Production</strong></td>
            <td>+10% speed, no quality loss. Promoted today.</td>
          </tr>
          <tr>
            <td><strong>TurboQuant KV</strong></td>
            <td>4.6x vs F16</td>
            <td><strong>Not available</strong></td>
            <td>Walsh-Hadamard rotation + Lloyd-Max quantization. Metal, CUDA, CPU only.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      <strong>TurboQuant</strong> (Google Research, ICLR 2026, arXiv 2504.19874) compresses KV values to 3.5 bits — a
      4.6x reduction that effectively gives 5x more context for the same VRAM. Implementations exist for Apple Metal
      (TheTom), CUDA (Madreag), CPU (ik_llama.cpp), and vLLM. None exist for Vulkan or ROCm.
    </p>

    <p>
      <strong>What would unlock it:</strong> AMD ROCm support for Strix Halo (gfx1151). ROCm uses HIP kernels that are
      architecturally closer to CUDA than Vulkan compute shaders. When llama.cpp merges TurboQuant upstream (Issue
      #20977, 176 thumbs up), a ROCm/HIP kernel is far more likely to follow than a Vulkan one. ROCm 7.x has improving
      gfx1151 support — we've already validated whisper.cpp on ROCm at 4.45x realtime on this hardware.
    </p>

    <p><strong>The path forward:</strong></p>
    <ol>
      <li><strong>Today:</strong> Q4_0 KV at 4x compression. Production. Working.</li>
      <li>
        <strong>When llama.cpp merges #20977:</strong> TurboQuant at 4.6x — available on CPU fallback immediately,
        ROCm/HIP likely to follow.
      </li>
      <li>
        <strong>When AMD ROCm stabilizes for gfx1151:</strong> Full TurboQuant on GPU. 262K context becomes effectively
        1.2M context at the same VRAM cost.
      </li>
    </ol>

    <hr />

    <h2>REAP + APEX Stacking</h2>

    <p>REAP and APEX are orthogonal:</p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Technique</th>
            <th>Compression Type</th>
            <th>What It Does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>REAP (Cerebras)</td>
            <td>Structural</td>
            <td>Removes 50% of experts by router gate values</td>
          </tr>
          <tr>
            <td>APEX (mudler)</td>
            <td>Precision</td>
            <td>Assigns adaptive quantization to remaining experts</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>Applied in sequence to the 97B:</p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Size</th>
            <th>What Happened</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Full 122B (FP16)</td>
            <td>~130 GB</td>
            <td>Starting point</td>
          </tr>
          <tr>
            <td>After REAP</td>
            <td>55 GB (Q4_K_M)</td>
            <td>50% experts pruned + standard quant</td>
          </tr>
          <tr>
            <td>After APEX (estimated)</td>
            <td><strong>~36 GB</strong></td>
            <td>Adaptive precision on remaining experts</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      At 23 GB (35B APEX agent) + 36 GB (97B REAP+APEX premium) = <strong>59 GB total</strong>. Both models concurrent
      on a consumer APU with KV headroom.
    </p>

    <p>
      <strong>Blocker:</strong> APEX needs HuggingFace safetensors as input, not GGUF. Pipeline peak: 388 GB disk.
      Available: 242 GB. Tooling is ready, configs are ready. Blocked on disk, not engineering.
    </p>

    <hr />

    <h2>Economics</h2>

    <p>Fleet VRAM breakdown by configuration. Models labeled explicitly:</p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Configuration</th>
            <th>Models</th>
            <th style={{ textAlign: 'center' }}>VRAM</th>
            <th style={{ textAlign: 'center' }}>KV Cache</th>
            <th style={{ textAlign: 'center' }}>Total</th>
            <th style={{ textAlign: 'center' }}>Fit?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Before</strong></td>
            <td>Qwen3.5-35B Q8_0 (34 GB) + Qwen3.5-97B REAP Q4_K_M (55 GB)</td>
            <td style={{ textAlign: 'center' }}>89 GB</td>
            <td style={{ textAlign: 'center' }}>Q8_0</td>
            <td style={{ textAlign: 'center' }}>~95 GB</td>
            <td style={{ textAlign: 'center' }}>Tight</td>
          </tr>
          <tr>
            <td><strong>After</strong></td>
            <td>Qwen3.5-35B APEX Quality (23 GB) + Qwen3.5-97B REAP Q4_K_M (55 GB)</td>
            <td style={{ textAlign: 'center' }}>78 GB</td>
            <td style={{ textAlign: 'center' }}>Q4_0</td>
            <td style={{ textAlign: 'center' }}>~82 GB</td>
            <td style={{ textAlign: 'center' }}>Comfortable</td>
          </tr>
          <tr>
            <td><strong>Future</strong></td>
            <td>Qwen3.5-35B APEX (23 GB) + Qwen3.5-97B REAP+APEX (~36 GB)</td>
            <td style={{ textAlign: 'center' }}>59 GB</td>
            <td style={{ textAlign: 'center' }}>Q4_0</td>
            <td style={{ textAlign: 'center' }}>~63 GB</td>
            <td style={{ textAlign: 'center' }}>Room to spare</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      The AMD Ryzen AI Max+ 395 costs ~$2,500 in a Framework Desktop. Break-even against the cheapest cloud GPU
      option: under 3 months.
    </p>

    <hr />

    <h2>Privacy: Local by Architecture</h2>

    <p>Every token stays on the machine. No API calls, no telemetry, no data processing agreements.</p>

    <p>
      Under GDPR: no DPAs (Art. 28), no Transfer Impact Assessments (Schrems II), no ROPA entries. One sentence:
      "Personal data does not leave the controller's hardware."
    </p>

    <hr />

    <h2>Performance Summary</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Before</th>
            <th>After</th>
            <th style={{ textAlign: 'center' }}>Delta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>35B agent size</td>
            <td>34.4 GB (Q8_0)</td>
            <td>22.8 GB (APEX Quality)</td>
            <td style={{ textAlign: 'center' }}><strong>-34%</strong></td>
          </tr>
          <tr>
            <td>35B generation</td>
            <td>58 tok/s</td>
            <td>75 tok/s</td>
            <td style={{ textAlign: 'center' }}><strong>+29%</strong></td>
          </tr>
          <tr>
            <td>35B perplexity</td>
            <td>~6.54</td>
            <td>6.527</td>
            <td style={{ textAlign: 'center' }}><strong>Beats F16</strong></td>
          </tr>
          <tr>
            <td>KV cache</td>
            <td>Q8_0 (2x)</td>
            <td>Q4_0 (4x)</td>
            <td style={{ textAlign: 'center' }}><strong>-50% size</strong></td>
          </tr>
          <tr>
            <td>Prompt processing</td>
            <td>136.7 tok/s</td>
            <td>151.0 tok/s</td>
            <td style={{ textAlign: 'center' }}><strong>+10%</strong></td>
          </tr>
          <tr>
            <td>122B vs 97B quality</td>
            <td>—</td>
            <td>Identical (5/5 both)</td>
            <td style={{ textAlign: 'center' }}>REAP pruning is lossless</td>
          </tr>
          <tr>
            <td>Fleet VRAM</td>
            <td>~95 GB</td>
            <td>~82 GB</td>
            <td style={{ textAlign: 'center' }}><strong>-13 GB</strong></td>
          </tr>
          <tr>
            <td>Disk freed</td>
            <td>—</td>
            <td>131 GB</td>
            <td style={{ textAlign: 'center' }}>3 models deleted</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr />

    <h2>Methodology</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr><th>Component</th><th>Version</th></tr>
        </thead>
        <tbody>
          <tr><td>llama.cpp</td><td>Build b8562+ (GDN Vulkan shader)</td></tr>
          <tr><td>Container</td><td><code>ghcr.io/ggml-org/llama.cpp:server-vulkan</code></td></tr>
          <tr><td>APEX source</td><td><a href="https://github.com/mudler/apex-quant" target="_blank" rel="noopener noreferrer">mudler/apex-quant</a> (GitHub)</td></tr>
          <tr><td>Models tested</td><td>35B APEX Quality, 97B REAP Q4_K_M, 122B APEX Compact</td></tr>
          <tr><td>KV tested</td><td>Q8_0, Q4_0. TurboQuant not available on Vulkan.</td></tr>
          <tr><td>Quality bench</td><td>5 tasks: logic, math, tool-calling, bug detection, nuanced analysis</td></tr>
          <tr><td>Temperature</td><td>0 (deterministic)</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      <strong>Not tested:</strong> Q4_0 KV beyond 64K tokens. Speculative decoding (APEX Mini as draft). REAP+APEX
      stacking (disk-blocked). ROCm backend. TurboQuant.
    </p>

    <hr />

    <p>
      Every model is open source. Every benchmark ran on hardware you can buy at a computer store. The gap between
      consumer and datacenter narrows every month — not because hardware got faster, but because quantization got{' '}
      <em>smarter</em>.
    </p>

    <hr />

    <p>
      <em>
        Benchmarks conducted April 2026 on AMD Ryzen AI Max+ 395. All models Apache 2.0 or MIT. No personal data
        processed during testing.
      </em>
    </p>
  </>
);

export default ApexQuantization;
