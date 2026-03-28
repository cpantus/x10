const TranscriptionVsTeams = () => (
  <>
    <p>
      <strong>TL;DR:</strong> We benchmarked a fully local, open-source transcription pipeline against Microsoft Teams
      Copilot on the same 3-hour 58-minute business meeting. Manual accuracy grading by the meeting
      participant: <strong>42/45 (ours) vs 21/45 (Teams)</strong>. Cost: $0/month vs $30/user/month. Every tool in the
      stack is open source.
    </p>

    <ul>
      <li>Teams garbled Romanian business vocabulary: <strong>"franc si unu ct"</strong> for a CTO title, <strong>"Stai C DE C ori tre euro 80"</strong> for the formula 170 × 8 × 80, <strong>"Domnul ctp"</strong> for "cPanelul."</li>
      <li>Teams <strong>censored normal Romanian words</strong> with asterisks and fragmented sentences into stubs: "E.", "La oar.", "Am si incerc si eu sa."</li>
      <li>Our pipeline: <a href="https://github.com/ggml-org/whisper.cpp" target="_blank" rel="noopener noreferrer">whisper.cpp</a> v1.8.4, Vulkan GPU, Framework Desktop with AMD Radeon 395 (Strix Halo, 128GB RAM). 4 parallel workers, 42x realtime, 5 minutes 43 seconds for 4 hours of audio.</li>
      <li><strong>Client-aware vocabulary seeding</strong> turned "pretul finalului" (hallucination) into "pretul final, Vlad" (correct, with name recognition). Cloud services architecturally cannot do this — they don't have your domain knowledge.</li>
      <li>CPU-based speaker diarization via <a href="https://github.com/FoxNoseTech/diarize" target="_blank" rel="noopener noreferrer">FoxNoseTech/diarize</a> — 10 speakers detected, zero GPU resources consumed.</li>
      <li><strong>Privacy:</strong> Zero bytes leave the machine. GDPR compliance by architecture, not by policy.</li>
    </ul>

    <hr />

    <h2>How This Started</h2>

    <p>
      A friend, Vali, mentioned he uses ElevenLabs for transcription. ElevenLabs Scale runs $330/month.
    </p>

    <p>
      We already had a local whisper.cpp setup for short recordings. We had a 4-hour Teams meeting with the native
      Copilot transcript as baseline. We built a parallel processing pipeline and benchmarked it head-to-head.
    </p>

    <hr />

    <h2>The Setup</h2>

    <p>
      A 651-line bash orchestrator coordinates 4 GPU-accelerated whisper.cpp server instances, a silence-analysis
      pipeline, and a TypeScript reassembly engine. Single machine, no network dependencies.
    </p>

    <pre><code>{`Input (.mp4/.wav)
  → [0] Vocabulary seed from client knowledge base
  → [1] ffmpeg extract 16kHz mono WAV
  → [2] Language detection  |  [Background] CPU speaker diarization
  → [3] Silence boundary analysis
  → [4] Chunk at silence points (5-min targets, ±60s snap)
  → [5] Parallel transcription (4× whisper-server fleet)
  → [6] Reassemble (overlap dedup, sentence-snap)
  → Output: .txt, .srt, .vtt, .json, .md (speaker-labeled)`}</code></pre>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr><th>Component</th><th>Spec</th></tr>
        </thead>
        <tbody>
          <tr><td>Machine</td><td>Framework Desktop</td></tr>
          <tr><td>CPU/GPU</td><td>AMD Radeon 395 (Strix Halo, RDNA 3.5, 128GB RAM)</td></tr>
          <tr><td>STT Engine</td><td><a href="https://github.com/ggml-org/whisper.cpp/releases/tag/v1.8.4" target="_blank" rel="noopener noreferrer">whisper.cpp v1.8.4</a> + ggml-large-v3-turbo</td></tr>
          <tr><td>Containers</td><td>Podman (rootless, GPU passthrough, 4GB/instance)</td></tr>
          <tr><td>Diarization</td><td>FoxNoseTech/diarize (CPU, Silero VAD + WeSpeaker)</td></tr>
          <tr><td>Pipeline</td><td>ffmpeg, GNU parallel, Bun (TypeScript reassembly)</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      Flash attention runs natively on RDNA 3.5 via <code>KHR_cooperative_matrix</code>. On older AMD GPUs without
      coopmat, it causes a 50% regression — disable with <code>-nfa</code>.
    </p>

    <hr />

    <h2>The Benchmark</h2>

    <p>
      Source: 3h58m Teams meeting recording (.mp4, H.264 + AAC 16kHz mono). Scope negotiations, cost calculations with
      specific EUR amounts, technical architecture decisions, pricing negotiations — content where a garbled number
      changes the meaning of binding discussions.
    </p>

    <p>
      Ten passages graded on a 1–5 scale by the actual meeting participant. Automated WER would not catch these
      failures — Teams produced recognizable words assembled into sequences conveying the wrong meaning.
    </p>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Passage</th>
            <th>Topic</th>
            <th style={{ textAlign: 'center' }}>Teams</th>
            <th style={{ textAlign: 'center' }}>Ours</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>P2</td><td>Cost calculation (120–170 days)</td><td style={{ textAlign: 'center' }}>2</td><td style={{ textAlign: 'center' }}>5</td><td>Ours</td></tr>
          <tr><td>P3</td><td>Price formula (170 × 8 × 80)</td><td style={{ textAlign: 'center' }}>2</td><td style={{ textAlign: 'center' }}>5</td><td>Ours</td></tr>
          <tr><td>P4</td><td>Magento 2 clarification</td><td style={{ textAlign: 'center' }}>3</td><td style={{ textAlign: 'center' }}>5</td><td>Ours</td></tr>
          <tr><td>P5</td><td>cPanel / security</td><td style={{ textAlign: 'center' }}>1</td><td style={{ textAlign: 'center' }}>5</td><td>Ours</td></tr>
          <tr><td>P6</td><td>Transcription quality meta-comment</td><td style={{ textAlign: 'center' }}>3</td><td style={{ textAlign: 'center' }}>5</td><td>Ours</td></tr>
          <tr><td>P7</td><td>Final price (109,000 EUR)</td><td style={{ textAlign: 'center' }}>4</td><td style={{ textAlign: 'center' }}>3</td><td>Teams</td></tr>
          <tr><td>P8</td><td>Middleware integration</td><td style={{ textAlign: 'center' }}>2</td><td style={{ textAlign: 'center' }}>4</td><td>Ours</td></tr>
          <tr><td>P9</td><td>Risk discussion</td><td style={{ textAlign: 'center' }}>2</td><td style={{ textAlign: 'center' }}>5</td><td>Ours</td></tr>
          <tr><td>P10</td><td>Discovery process</td><td style={{ textAlign: 'center' }}>2</td><td style={{ textAlign: 'center' }}>5</td><td>Ours</td></tr>
          <tr><td><strong>Total</strong></td><td></td><td style={{ textAlign: 'center' }}><strong>21/45</strong></td><td style={{ textAlign: 'center' }}><strong>42/45</strong></td><td><strong>Ours</strong></td></tr>
        </tbody>
      </table>
    </div>

    <h3>What Teams Actually Produced</h3>

    <p><strong>P3 — Price Formula (Teams: 2, Ours: 5):</strong> Speaker said 170 days × 8 hours × 80 EUR/hour.</p>
    <blockquote><p>Teams: "Stai C DE C ori tre euro 80"</p></blockquote>
    <blockquote><p>Ours: "170 ori 80, corect?"</p></blockquote>

    <p><strong>P5 — cPanel (Teams: 1, Ours: 5):</strong> Speaker said "cPanelul" — the Romanian form of cPanel.</p>
    <blockquote><p>Teams: "Domnul ctp"</p></blockquote>
    <blockquote><p>Ours: "cPanelul" — correct technical term, correct grammar.</p></blockquote>

    <p><strong>The censorship problem:</strong> Teams asterisked normal Romanian words — "*** adica?" ("meaning?"), "Nu stiu *** ati calculat" ("I don't know how you calculated"). These are business phrases, not profanity.</p>

    <p><strong>P7 — Where Teams won (Teams: 4, Ours: 3):</strong> For the final price of 109,000 EUR, Teams' real-time context correctly resolved the number. Our chunked approach captured it with minor context loss. Honest reporting: they won this one.</p>

    <hr />

    <h2>Why Local Wins on Accuracy</h2>

    <h3>1. Language Pinning</h3>

    <p>
      Teams auto-detects language, wasting capacity on identification rather than transcription. One flag
      (<code>-l ro</code>) eliminates this entire error class. For monolingual meetings, this is a free accuracy gain.
    </p>

    <h3>2. Vocabulary Seeding</h3>

    <p>
      Before transcription, our pipeline reads the client's knowledge base — participant names, technical terms,
      product names — and injects them into Whisper's prompt field:
    </p>

    <pre><code>{`curl "http://localhost:8090/inference" \\
  -F "file=@chunk.wav" -F "language=ro" \\
  -F "prompt=Vlad, Marius, PetMart, Magento, cPanel, middleware..."`}</code></pre>

    <p>Without seeding: "pretul finalului" (hallucination). With seeding: "pretul final, Vlad" (correct name recognition).</p>

    <p>
      <strong>Cloud cannot do this.</strong> Teams is a multi-tenant service processing millions of meetings. It cannot
      inject per-meeting vocabulary at inference time. Your domain knowledge is invisible to it.
    </p>

    <h3>3. Silence-Aware Chunking</h3>

    <p>
      The pipeline maps all silence regions via ffmpeg, snaps chunk boundaries to natural pauses (never mid-word), and
      overlaps by 10 seconds at each boundary. The reassembly engine deduplicates overlaps at sentence boundaries. This
      is invisible inside a cloud API — if their chunking introduces artifacts, you have no recourse.
    </p>

    <hr />

    <h2>Speaker Diarization</h2>

    <p>
      Teams had speaker ID from day one (Microsoft account authentication). We closed this gap in 4.5 hours using
      CPU-based diarization that runs <em>in parallel</em> with GPU transcription — zero added time:
    </p>

    <pre><code>{`# CPU diarization in background
transcribe-meeting-diarize full.wav --output speakers.json &
# GPU transcription in foreground
parallel --jobs 4 "$DISPATCH" {} {%} < chunks.txt
# Merge
wait $DIARIZE_PID && bun run merge --diarize-segments speakers.json`}</code></pre>

    <p>
      10 speakers detected. Labels are numeric (Speaker 1, 2...) — after one manual name-mapping pass, subsequent
      meetings with the same participants benefit automatically.
    </p>

    <hr />

    <h2>The Economics</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr><th>Solution</th><th>Monthly</th><th>Annual</th><th>Romanian</th><th>Privacy</th></tr>
        </thead>
        <tbody>
          <tr><td>ElevenLabs Scale</td><td>$330/mo</td><td>~$3,300/yr</td><td>Claimed ≤5% WER</td><td>Cloud API</td></tr>
          <tr><td>Turboscribe</td><td>$20/mo</td><td>$120/yr</td><td>Whisper-based</td><td>Cloud</td></tr>
          <tr><td>Teams Copilot</td><td>$30/user/mo</td><td>$360/user/yr</td><td>Poor quality</td><td>Microsoft Cloud</td></tr>
          <tr><td><strong>Local pipeline</strong></td><td><strong>$0</strong></td><td><strong>$0</strong></td><td><strong>Best (benchmarked)</strong></td><td><strong>Fully local</strong></td></tr>
        </tbody>
      </table>
    </div>

    <p>
      Hardware (Framework Desktop, AMD Strix Halo): ~$2,000 one-time, amortized across all workloads. If you already
      have GPU hardware, the marginal cost is electricity — ~$0.02 per 4-hour meeting. Break-even for a 10-person team
      replacing Teams Copilot: 5.6 months. After that, every transcription is free.
    </p>

    <hr />

    <h2>Privacy: GDPR by Architecture</h2>

    <p>
      Teams: audio transmitted to Azure, processed by Azure Speech Services, stored per Microsoft retention policies,
      subject to DPA and sub-processor agreements, potentially routed through non-EU regions. Triggers: DPA, Transfer
      Impact Assessment, ROPA entries, Art. 9 safeguards for special category data.
    </p>

    <p>Our system: <code>audio → local RAM → local GPU → local disk → transcript</code>. No network calls, no APIs,
      no sub-processors. The GDPR analysis is one sentence: you are the controller, there is no processor. For
      regulated industries — legal, healthcare, finance — this is the difference between a simple register entry and
      a multi-page DPIA.
    </p>

    <hr />

    <h2>Performance</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr><th>Config</th><th>Realtime Factor</th><th>4h Meeting</th></tr>
        </thead>
        <tbody>
          <tr><td>1 instance, no flash attn</td><td>~12x</td><td>~20 min</td></tr>
          <tr><td>1 instance, flash attn (RDNA 3.5)</td><td>~33x</td><td>~7 min</td></tr>
          <tr><td>4 instances, flash attn</td><td>~42x</td><td><strong>5 min 43s</strong></td></tr>
        </tbody>
      </table>
    </div>

    <p>
      Each instance capped at 4GB via Podman. 4 instances = ~12.4GB of 128GB available. Pre-flight memory check
      auto-caps workers on low-memory systems.
    </p>

    <hr />

    <h2>Build It Yourself</h2>

    <p>Minimum viable setup — four commands:</p>

    <pre><code>{`# Build whisper.cpp (use -DGGML_CUDA=ON for NVIDIA)
git clone https://github.com/ggml-org/whisper.cpp.git && cd whisper.cpp
cmake -B build -DGGML_VULKAN=ON -DWHISPER_BUILD_SERVER=ON -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc) --target whisper-server

# Download model
curl -L -o ggml-large-v3-turbo.bin \\
  "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin"

# Start server
./build/bin/whisper-server --model ggml-large-v3-turbo.bin --port 8083

# Transcribe
curl http://localhost:8083/inference \\
  -F "file=@meeting.wav" -F "response_format=verbose_json" \\
  -F "temperature=0.0" -F "language=ro"`}</code></pre>

    <p>
      Everything else — parallel fleet, silence chunking, vocabulary seeding, diarization — is optimization on top of
      this foundation.
    </p>

    <hr />

    <h2>Methodology</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead><tr><th>Component</th><th>Version</th></tr></thead>
        <tbody>
          <tr><td>whisper.cpp</td><td><a href="https://github.com/ggml-org/whisper.cpp/releases/tag/v1.8.4" target="_blank" rel="noopener noreferrer">v1.8.4</a></td></tr>
          <tr><td>Model</td><td>ggml-large-v3-turbo.bin</td></tr>
          <tr><td>Vulkan driver</td><td>RADV (Mesa, Fedora 43)</td></tr>
          <tr><td>Diarization</td><td>FoxNoseTech/diarize</td></tr>
          <tr><td>Teams</td><td>Desktop + Microsoft 365 Copilot, March 2026</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      Parameters: <code>temperature=0.0</code>, <code>language=ro</code>, 300s chunks, 10s overlap, -35dB silence
      threshold. Grading by single evaluator (meeting participant). Deterministic output at temperature 0.
    </p>

    <p><strong>Not tested:</strong> English (Teams likely competitive), real-time transcription (Teams has no local equivalent), meeting summarization (downstream LLM task).</p>

    <hr />

    <p>
      Cloud AI optimizes for the median use case. Local AI optimizes for <em>yours</em>. The 42–21 gap is what
      specialization looks like. The tools are open source. The methodology is documented. Test it on your own
      recordings.
    </p>

    <hr />

    <p>
      <em>
        Technical investigation conducted March 2026. All tools open source. Hardware is consumer-available. No
        confidential meeting content disclosed.
      </em>
    </p>
  </>
);

export default TranscriptionVsTeams;
