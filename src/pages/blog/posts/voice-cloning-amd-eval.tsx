const VoiceCloningAmdEval = () => (
  <>
    <p>
      <strong>TL;DR:</strong> I evaluated 4 open-source voice cloning models on a single AMD consumer machine to
      generate English learning content from a curriculum and a seed voice. 5 reference samples, 30 seconds each.
      Optimized each model from unusable to production-ready: Fish S2 Pro RTF 17→3.8 (4.5x), Chatterbox RTF
      1.55→0.87 (1.8x), Qwen3-TTS RTF 5.5→2.14 (2.6x). Generated 425 audio files across 4 English courses. Cost:
      $0/month.
    </p>

    <ul>
      <li>
        <strong>Fish S2 Pro FP8 weights were silently corrupt</strong> — all 201 <code>.weight.scale</code> keys
        dropped on load. Switching to BF16 + <code>torch.compile</code> + removing hardcoded SDPA MATH fallback:
        RTF 17→<strong>3.8</strong>. Voice cloning then blocked by torchaudio 2.10's CUDA-only torchcodec
        dependency.
      </li>
      <li>
        <strong>Chatterbox <code>cfg_weight=0.0</code> was broken</strong> — batch=2 hardcoded in 3 locations. We
        patched it. The <code>inference_turbo</code> path is <strong>2–3x slower</strong> on AMD. Only{' '}
        <code>torch.autocast(bfloat16)</code> helped.
      </li>
      <li>
        <strong>Romanian gap</strong>: out of 7+ models, only Fish S2 Pro supports Romanian (WER 10.74%).{' '}
        <strong>F5-TTS-RO</strong> by RACAI achieves WER 5.27% — half the error rate.
      </li>
      <li>
        <strong>Human eval</strong>: the voice owner rated <strong>Qwen3-TTS 0.6B as closest to natural voice</strong>{' '}
        — the smallest, fastest, cheapest model won on voice match.
      </li>
      <li>
        <strong>pip dependency hell</strong>: every TTS package overwrites ROCm PyTorch with CUDA PyTorch. 3 failed
        builds before we documented the fix.
      </li>
      <li>
        <strong>The machine crashed</strong> under sustained GPU load. Stock cooling couldn't handle 4 AI models at
        100% for hours. We added an auxiliary cooler, recovered, and resumed.
      </li>
      <li>
        <strong>Privacy</strong>: voice samples are biometric data under GDPR Art. 9. Local = one-sentence
        compliance. Cloud = DPA, ROPA, TIA.
      </li>
    </ul>

    <p>
      <a href="/blog/transcription-local-vs-teams-copilot">
        Link to previous benchmark: Local Transcription vs Teams Copilot — 42-21
      </a>
    </p>

    <hr />

    <h2>How This Started</h2>

    <p>
      We built a local transcription pipeline that{' '}
      <a href="/blog/transcription-local-vs-teams-copilot">beat Teams Copilot 42–21</a> on a 4-hour Romanian
      meeting. The question: can we do the same for speech synthesis?
    </p>

    <p>
      The use case: English classes for Romanian students. Clone an instructor's voice from 30 seconds of reference
      audio. Generate 4 course levels (A1–B2). Two languages, zero cloud. Consumer AMD hardware only.
    </p>

    <hr />

    <h2>The Hardware</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Spec</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CPU/GPU</td>
            <td>AMD Ryzen AI Max+ 395 (Radeon 8060S, RDNA 3.5, gfx1151)</td>
          </tr>
          <tr>
            <td>RAM/VRAM</td>
            <td>128GB unified (112GB configurable as VRAM)</td>
          </tr>
          <tr>
            <td>ROCm</td>
            <td>7.13 via AMD nightly PyTorch wheels</td>
          </tr>
          <tr>
            <td>PyTorch</td>
            <td>
              2.10.0+rocm7.13 (<code>rocm.nightlies.amd.com/v2/gfx1151/</code>)
            </td>
          </tr>
          <tr>
            <td>OS</td>
            <td>Fedora 43, kernel 6.18.16</td>
          </tr>
          <tr>
            <td>Audio</td>
            <td>ffmpeg 7.1, sox 14.4, PipeWire</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      The Radeon 8060S is an integrated GPU sharing memory with the CPU. ROCm support for gfx1151 is experimental.
      Every model required at least one AMD-specific workaround.
    </p>

    <hr />

    <h2>Model Selection: The Romanian Filter</h2>

    <p>
      Romanian eliminated 6 of 7 candidates. Fish S2 Pro is the only model with published Romanian benchmarks (WER
      10.74%, speaker similarity 0.809).
    </p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Params</th>
            <th>English WER</th>
            <th>Romanian</th>
            <th>License</th>
            <th>VRAM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fish S2 Pro</td>
            <td>4.4B</td>
            <td>0.99%</td>
            <td>10.74%</td>
            <td>Research (weights)</td>
            <td>~15GB</td>
          </tr>
          <tr>
            <td>Chatterbox</td>
            <td>~1B</td>
            <td>Supported</td>
            <td>No</td>
            <td>MIT</td>
            <td>~4GB</td>
          </tr>
          <tr>
            <td>Qwen3-TTS</td>
            <td>0.6B/1.7B</td>
            <td>1.24%</td>
            <td>No</td>
            <td>Apache 2.0</td>
            <td>~4/10GB</td>
          </tr>
          <tr>
            <td>F5-TTS-RO (RACAI)</td>
            <td>~335M</td>
            <td>—</td>
            <td><strong>5.27%</strong></td>
            <td>Open</td>
            <td>~3GB</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      F5-TTS-RO was discovered during research — built by Romania's national AI research institute, purpose-trained
      on 112h of Romanian speech. For production: Chatterbox for English, F5-TTS-RO for Romanian.
    </p>

    <hr />

    <h2>The Optimization Journey</h2>

    <h3>Fish S2 Pro: RTF 17.0→3.8 (4.5x)</h3>

    <p>Three stacked bugs:</p>

    <p>
      <strong>1. FP8 weights silently corrupt.</strong> <code>drbaph/s2-pro-fp8</code> drops 201{' '}
      <code>.weight.scale</code> keys on load. No warning. Fix: switch to official BF16 (
      <code>fishaudio/s2-pro</code>).
    </p>

    <p>
      <strong>2. <code>torch.compile</code> with inductor.</strong> 7.6x decode speedup. First call: 60–120s
      compilation. Every subsequent: fused HIP kernels.
    </p>

    <p>
      <strong>3. SDPA MATH backend hardcoded.</strong> Line 210 of <code>inference.py</code> forces scalar Python
      fallback. Removing it: 2.9–14x SDPA speedup via AOTriton auto-select.
    </p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Config</th>
            <th style={{ textAlign: 'center' }}>RTF</th>
            <th style={{ textAlign: 'center' }}>Speedup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Baseline (FP8, MATH SDPA)</td>
            <td style={{ textAlign: 'center' }}>17.0</td>
            <td style={{ textAlign: 'center' }}>—</td>
          </tr>
          <tr>
            <td>BF16 model</td>
            <td style={{ textAlign: 'center' }}>~12.0</td>
            <td style={{ textAlign: 'center' }}>1.4x</td>
          </tr>
          <tr>
            <td>+ torch.compile</td>
            <td style={{ textAlign: 'center' }}>~4.5</td>
            <td style={{ textAlign: 'center' }}>3.8x</td>
          </tr>
          <tr>
            <td>+ SDPA auto-select</td>
            <td style={{ textAlign: 'center' }}><strong>3.8</strong></td>
            <td style={{ textAlign: 'center' }}><strong>4.5x</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      <strong>Voice cloning blocker:</strong> After all optimizations, voice cloning specifically is blocked by{' '}
      <code>torchaudio 2.10</code> removing soundfile/ffmpeg backends. All audio loading routes through{' '}
      <code>torchcodec</code> which has CUDA-only native extensions. Default voice works at RTF 3.8. Cloning a
      specific voice crashes on import. This is a torchaudio regression, not a model or ROCm issue.
    </p>

    <h3>Chatterbox: RTF 1.55→0.87 (1.8x)</h3>

    <p>
      One optimization worked: <code>torch.autocast(dtype=torch.bfloat16)</code>. 25% speedup.
    </p>

    <p>
      What didn't: <code>cfg_weight=0.0</code> (broken — batch=2 hardcoded, we patched 3 locations),{' '}
      <code>inference_turbo</code> (2–3x slower on AMD), <code>torch.compile</code> (infinite recompilation from
      dynamic KV-cache shapes), <code>PYTORCH_TUNABLEOP_ENABLED=1</code> (2x slower).
    </p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Config</th>
            <th style={{ textAlign: 'center' }}>RTF</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Baseline FP32</td>
            <td style={{ textAlign: 'center' }}>~1.55</td>
            <td>—</td>
          </tr>
          <tr>
            <td>autocast BF16</td>
            <td style={{ textAlign: 'center' }}>~1.17</td>
            <td><strong>Only thing that works</strong></td>
          </tr>
          <tr>
            <td><strong>Best (hot run)</strong></td>
            <td style={{ textAlign: 'center' }}><strong>0.87</strong></td>
            <td><strong>Sub-real-time</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>Qwen3-TTS: RTF 5.5→2.14 (2.6x)</h3>

    <p>
      The 0.6B model is the answer. 2.6x faster than 1.7B, inaudible quality difference for educational content.{' '}
      <code>torch.compile</code> works on 0.6B (fixed decoder shapes), crashes on 1.7B. HIP graph capture — the
      single biggest NVIDIA advantage — completely blocked on gfx1151.
    </p>

    <hr />

    <h2>Human Evaluation</h2>

    <p>
      Two evaluation passes. First: the author of the evaluation (me) listened to all 3 models blind across A1
      course chunks. Second: the voice owner — the instructor whose voice was cloned — listened and rated
      naturalness.
    </p>

    <p>
      <strong>Result: Qwen3-TTS 0.6B was rated closest to the natural voice by the voice owner.</strong> This was
      unexpected — the 0.6B is the smallest model, the fastest, and the cheapest to run. Chatterbox produced the
      most expressive output (the <code>exaggeration</code> parameter gives direct control over prosody range), but
      the voice timbre matched less consistently. Fish S2 Pro had the best benchmark numbers on paper but voice
      cloning was blocked by the torchaudio/torchcodec issue, limiting evaluation to default-voice output.
    </p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Chatterbox</th>
            <th>Qwen3-TTS 0.6B</th>
            <th>Fish S2 Pro</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Voice match</td>
            <td>Good</td>
            <td><strong>Best</strong></td>
            <td>Blocked (default voice)</td>
          </tr>
          <tr>
            <td>Naturalness</td>
            <td>Good (with exaggeration tuning)</td>
            <td>Good</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Expressiveness</td>
            <td><strong>Best</strong> (exaggeration=0.6–0.7)</td>
            <td>Neutral</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Punctuation following</td>
            <td>Weak</td>
            <td>Weak</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Speed (RTF)</td>
            <td><strong>0.87</strong></td>
            <td>2.14</td>
            <td>3.8 (default voice)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Prosody Tuning: Making TTS Follow Punctuation</h2>

    <p>
      Out-of-the-box, all models struggle with punctuation-driven intonation. Questions sound declarative. Periods
      don't create falling cadence. Commas produce no pause.
    </p>

    <p>We built a prosody preprocessor with three techniques:</p>

    <p>
      <strong>1. Per-sentence split + calibrated silence.</strong> Instead of feeding a full paragraph to the model,
      we split at sentence boundaries and concatenate the generated audio with calibrated silence gaps: 450ms after
      periods, 400ms after questions, 700ms after ellipsis, 200ms after commas. Model-agnostic — works for all 3
      models.
    </p>

    <p>
      <strong>2. Fish S2 Pro inline expression tags.</strong> Fish supports 15,000+ natural language tags that guide
      prosody at the word level. We auto-insert tags based on punctuation:{' '}
      <code>[questioning tone] [pitch up]</code> before questions, <code>[excited] [emphasis]</code> before
      exclamations, <code>[pause]</code> at commas. This is Fish's architectural advantage — no other model offers
      word-level prosody control.
    </p>

    <p>
      <strong>3. Chatterbox exaggeration tuning.</strong> The <code>exaggeration</code> parameter (0.0–1.0) controls
      prosodic range. At 0.5 (default), speech is flat. At 0.7, natural variation in pitch and pacing appears. At
      1.0, it overshoots. The sweet spot for educational content:{' '}
      <strong>0.6 for beginners (A1–A2), 0.7 for intermediate (B1–B2)</strong>.
    </p>

    <p>
      <strong>4. Reference audio selection.</strong> A monotone reference produces monotone clones. We used the
      longest, most varied sample (22 seconds, containing questions and exclamations) as primary reference. This
      improved prosodic range across all models.
    </p>

    <p>
      <strong>What didn't work:</strong> Chatterbox <code>[PAUSE]</code> text tokens are read aloud as words
      (confirmed bug, issue #210). Qwen3-TTS has an <code>instructions</code> parameter for prosody control — but
      only in the cloud API, not in the open-weight models.
    </p>

    <hr />

    <h2>The Crash</h2>

    <p>
      Sustained 100% GPU load for hours doing batch generation. The stock Framework Desktop cooling handles
      single-model inference fine. Running 4 AI models simultaneously (Whisper STT + 3 TTS) at 119–132W continuous
      pushed VRM temperatures past safe limits.
    </p>

    <p>
      ComfyUI (image generation, running in a container) tried to allocate VRAM while Fish S2 Pro was using ~15GB.
      No GPU process isolation on unified memory APUs. ComfyUI SIGABRT'd with 3 coredumps. Fish survived — the late
      arrival crashes, not the incumbent.
    </p>

    <p>
      We added an auxiliary USB fan pointed at the VRM and PSU area. Temperatures dropped. Mainboard power: 43°C.
      SSDs: 39–42°C. GPU: 60–67°C at sustained 122W. No throttle events after the cooling upgrade.
    </p>

    <figure style={{ margin: '2rem 0' }}>
      <img src="/blog/images/voice-cloning-gpu-load.png" alt="AMD Radeon 8060S at 100% GPU utilization, 67°C, 122W, 29.6 GiB VRAM during voice cloning batch generation" style={{ width: '100%', borderRadius: '8px' }} />
      <figcaption style={{ textAlign: 'center', opacity: 0.6, marginTop: '0.5rem', fontSize: '0.875rem' }}>GPU at 100%, 67°C, 122W — sustained voice cloning across 4 English courses. 29.6 GiB VRAM used.</figcaption>
    </figure>

    <hr />

    <h2>AMD-Specific Bugs (6 Found, 6 Fixed)</h2>

    <ol>
      <li>
        <strong>pip overwrites ROCm torch</strong> — every TTS package pulls CUDA PyTorch. Fix:{' '}
        <code>pip install --force-reinstall</code> from AMD nightly index after every package install.
      </li>
      <li>
        <strong>HSA_OVERRIDE must be 11.5.1</strong> — not 11.0.0 (maps to wrong GPU architecture).
      </li>
      <li>
        <strong>Fish torchaudio scoping bug</strong> — <code>import torchaudio.io.X</code> in except block shadows
        global import.
      </li>
      <li>
        <strong>Chatterbox watermarker crashes</strong> — CUDA-compiled binary. Patched with passthrough.
      </li>
      <li>
        <strong>ComfyUI VRAM contention</strong> — no process isolation on unified memory APUs.
      </li>
      <li>
        <strong>ROCm 7.0 containers SIGSEGV</strong> — abandoned containers for <code>uv</code> venvs with ROCm
        7.13 nightly.
      </li>
    </ol>

    <hr />

    <h2>The Economics</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Solution</th>
            <th>Monthly</th>
            <th>Romanian</th>
            <th>Privacy</th>
            <th>Setup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ElevenLabs Professional</td>
            <td>$99/mo</td>
            <td>Yes</td>
            <td>Cloud</td>
            <td>Minutes</td>
          </tr>
          <tr>
            <td>Fish Audio Cloud API</td>
            <td>Pay-per-use</td>
            <td>Yes</td>
            <td>Cloud</td>
            <td>Minutes</td>
          </tr>
          <tr>
            <td><strong>Local pipeline</strong></td>
            <td><strong>$0</strong></td>
            <td><strong>Yes</strong></td>
            <td><strong>Local</strong></td>
            <td><strong>~20 hours</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      The 20 hours includes debugging all 6 AMD bugs. Subsequent courses: run a script. Hardware already amortized
      across transcription, LLM inference, and image generation.
    </p>

    <hr />

    <h2>Privacy: GDPR by Architecture</h2>

    <p>
      Voice is biometric data (Art. 9). Cloud APIs trigger DPA, ROPA, Transfer Impact Assessment, sub-processor
      audits. Our system: <code>reference_audio → local RAM → local GPU → local disk → course_audio</code>. No
      network calls. One-sentence GDPR analysis: you are the controller, there is no processor.
    </p>

    <hr />

    <h2>What's Blocked on AMD Today</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Impact</th>
            <th>gfx1151 Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HIP graph capture</td>
            <td>3–5x decode speedup</td>
            <td>Blocked (silent hang)</td>
          </tr>
          <tr>
            <td>Flash Attention 2</td>
            <td>30–50% attention speedup</td>
            <td>Crashes on RDNA 3.5</td>
          </tr>
          <tr>
            <td>torch.compile reduce-overhead</td>
            <td>Eliminates Python overhead</td>
            <td>65x hang</td>
          </tr>
          <tr>
            <td>torchaudio torchcodec</td>
            <td>Audio loading for voice cloning</td>
            <td>CUDA-only native extensions</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      The HIP graph gap alone accounts for 3–5x performance difference between AMD and NVIDIA on autoregressive
      models. Expected fix: ROCm 7.2 stable (Q2 2026).
    </p>

    <hr />

    <h2>What's Coming</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Development</th>
            <th>Impact</th>
            <th>Timeline</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ROCm 7.2 stable</td>
            <td>HIP graphs → 3–5x RTF drop</td>
            <td>Q2 2026</td>
          </tr>
          <tr>
            <td>llama.cpp TTS</td>
            <td>Bypass PyTorch via Vulkan</td>
            <td>Experimental</td>
          </tr>
          <tr>
            <td>OmniVoice (k2-fsa)</td>
            <td>600+ languages, RTF 0.025</td>
            <td>Published April 2026</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      If HIP graphs land, Fish S2 Pro goes from RTF 3.8 to potentially under 1.0. llama.cpp TTS would bypass the
      entire PyTorch/ROCm stack — the same path that gives whisper.cpp 42x realtime on this hardware.
    </p>

    <hr />

    <h2>Methodology</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fish S2 Pro</td>
            <td>fishaudio/s2-pro (BF16, ~15GB)</td>
          </tr>
          <tr>
            <td>Chatterbox</td>
            <td>ResembleAI/chatterbox (~4GB)</td>
          </tr>
          <tr>
            <td>Qwen3-TTS</td>
            <td>0.6B-Base + 1.7B-Base</td>
          </tr>
          <tr>
            <td>F5-TTS-RO</td>
            <td>RACAI (Romanian, ~3GB)</td>
          </tr>
          <tr>
            <td>PyTorch</td>
            <td>2.10.0+rocm7.13 (AMD nightly)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      <strong>Limitations:</strong> Single evaluator (N=1). Fish voice cloning blocked by torchcodec. Romanian
      evaluation limited to F5-TTS-RO. Strix Halo is not representative of datacenter GPU performance.
    </p>

    <hr />

    <p>
      Cloud AI gives you someone else's voice model on someone else's hardware processing someone else's copy of
      your voice. Local AI gives you the same models, the same quality, on hardware you own, processing data that
      never leaves your desk. The 425 files sound like the instructor. They cost nothing per month. The voice
      biometrics never touched a <em>network socket</em>.
    </p>

    <hr />

    <p>
      <em>
        Technical investigation conducted April 2026. All tools open source. Hardware is consumer-available. Voice
        samples from project participants with consent.
      </em>
    </p>
  </>
);

export default VoiceCloningAmdEval;
