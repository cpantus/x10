const GhosttyOpusFix = () => (
  <>
    <p>
      <strong>TL;DR:</strong> Mitchell Hashimoto reported that Opus 4.6 failed to fix Ghostty's 6-month split flicker bug (#8208), while Codex 5.3 solved it autonomously. I iteratively designed a structured investigation prompt and ran three experiments with Opus. After two rounds of refinement, the third run — uncontaminated and without human nudging — reproduced the core fix strategy that shipped. This is a case study in workflow scaffolding, not a model comparison.
    </p>

    <hr />

    <h2>Disclaimers First</h2>

    <p>I want to get these out of the way because they shape how you should read everything below.</p>

    <p>
      <strong>I did not "fix" this bug.</strong> I did not merge the fix, review it in production, or own the downstream tradeoffs. What I did was get a model to independently arrive at the same core approach — <code>getAncestor</code> to find existing leaf widgets, ref them, detach from old containers, reinsert into new tree, unref — that Mitchell shipped in PR #11170. "Same family of idea" is accurate. "Same fix" is overclaiming.
    </p>

    <p>
      <strong>The issue was half-diagnosed already.</strong> Mitchell's code comments and issue description lay out the root cause in unusual detail. The model wasn't discovering a hidden cause from scratch — it was following breadcrumbs left by the maintainer. That's still useful work, but it's not the same as blind diagnosis.
    </p>

    <p>
      <strong>This is not a controlled model comparison.</strong> I did not run Codex with my structured prompt, or Opus in Mitchell's exact environment and tooling. My experiment shows that workflow scaffolding changes outcomes for Opus. It does not show that model differences are irrelevant.
    </p>

    <p>
      I don't write Zig, but the entire result depended on human expertise: I designed the agent topology, imposed the ranking phase, enforced isolation, interpreted outputs, and judged success against the shipped patch. This is a story about human-guided debugging strategy, not a novice accidentally solving a hard bug.
    </p>

    <p>
      <strong>"Three times" is the development process, not three independent replications.</strong> Run 1 failed, taught me something, I improved the prompt. Run 2 partially succeeded, revealed a contamination issue, I improved the setup. Run 3 was the only clean autonomous success. The honest summary: after two rounds of prompt engineering, I got one clean replication.
    </p>

    <p>
      <strong>I'm including all three runs for transparency.</strong> I could have presented only Run 3 and written a tighter story. Instead, I'm showing the contamination issues, the methodology failures, and the iterative fixes — because if the scientific method isn't transparent, the result isn't worth publishing.
    </p>

    <p>With all that said, here's what happened and what I think it shows.</p>

    <h2>Who I Am</h2>

    <p>
      20 years of CTO/CISO experience across fintech, payments, and telecom. Networking, infrastructure, security, compliance. I can read code and reason about architectures. I'd never looked at GTK4 internals before this experiment.
    </p>

    <h2>What Prompted This</h2>

    <p>
      ThePrimeagen's breakdown of Mitchell Hashimoto's tweet: Codex 5.3 (xhigh reasoning) solved a 6-month-old split flicker bug in 45 minutes for $4.14. Opus 4.6 failed. Mitchell attributed the success to Codex autonomously reading GTK4 source code — the other models never went there.
    </p>

    <p>
      Mitchell's claim was specific: Opus failed in his run, with his prompt, in his environment. He was reporting a data point, not making a universal claim about model capability. I wondered whether a different prompt structure would change the outcome for the same model.
    </p>

    <h2>The Bug</h2>

    <p>
      Issue #8208: every split-modifying action causes a visible flicker on GTK/Linux. <code>propTree()</code> calls <code>tree_bin.setChild(null)</code> — destroying all widgets synchronously — then schedules a deferred rebuild via <code>glib.idleAdd(onRebuild)</code>. Between destruction and rebuild, the user sees one or more frames of empty container.
    </p>

    <p>
      The fix that shipped: reuse existing <code>SurfaceScrolledWindow</code> leaf widgets instead of destroying and recreating them. Extract from old containers, ref, build new tree with them, swap atomically. Plus <code>BuildTreeResult</code> for clean ref lifecycle, <code>freezeNotify</code>/<code>thawNotify</code> for notification batching, and keeping the <code>idleAdd</code> debounce.
    </p>

    <h2>Setup</h2>

    <p>
      Bash script clones the Ghostty repo, checks out the parent of the fix merge commit using only <code>git rev-parse</code> (no commit messages, no <code>gh pr list</code>, no PR titles visible). Each run used a fresh Claude Code session with no conversation history. The prompt provides the issue URL — same starting information Mitchell's prompt used.
    </p>

    <h2>Run 1 — Learning What Breaks</h2>

    <p><strong>Purpose:</strong> See if adding parallel investigation agents to the prompt changes the outcome.</p>

    <p><strong>Prompt:</strong> Issue URL, three parallel agents, no specialist roles, no ranking requirement.</p>

    <p>
      <strong>Result:</strong> Agents correctly mapped the rebuild pipeline and widget hierarchy. But the synthesis fixated on a secondary issue — GtkPaned position timing — and built a fix for that. Real improvement, wrong priority.
    </p>

    <p>
      One nudge: "This is a nice improvement but it doesn't fix the issue." That's not a technical hint — it's the kind of feedback any QA tester or product manager would give when a fix addresses a symptom instead of the cause.
    </p>

    <p>
      The model self-corrected. Re-read Mitchell's description, reframed it from context to specification, and produced a comprehensive fix addressing both the primary structural cause and the secondary position artifact. The post-nudge fix was in the same family as what shipped — arguably more comprehensive because it also addressed the position-timing issue that the shipped PR left open.
    </p>

    <p>
      <strong>What I took from this:</strong> The model found a legitimate secondary issue that the shipped fix doesn't address. But without explicit ranking of artifact sources, it treated the first issue found as primary. Also: one sentence of human redirection was enough to reach the correct solution space.
    </p>

    <p>
      <strong>What this doesn't prove:</strong> That the model could solve it autonomously. It needed a human oracle to reprioritize.
    </p>

    <h2>Run 2 — Finding a Leak 25 Minutes In</h2>

    <p><strong>Purpose:</strong> Test whether specialist roles and mandatory root-cause ranking eliminate the prioritization failure.</p>

    <p>
      <strong>Prompt changes:</strong> Added specialist agent roles (root-cause-analyst, system-architect, research-scout). Added Phase 2 requirement to rank all visual artifact sources by impact before fixing anything.
    </p>

    <p>
      <strong>Result:</strong> Ranking worked — model correctly identified <code>tree_bin.setChild(null)</code> as the primary cause on first pass. Initially pursued a GtkPicture snapshot approach, but the research agent flagged the APIs as unverifiable in Ghostty's Zig bindings. That practical constraint forced a pivot to the same architectural insight as the shipped fix: the old widget tree is already a good placeholder — don't tear it down until the replacement is ready.
    </p>

    <p>
      <strong>The contamination:</strong> The code review agent browsed a directory from Run 1 containing modified files. The model noted this and claimed it wouldn't reference external artifacts. The investigation and fix design happened before the review, but the review is tainted. I'm reporting this rather than hiding it, but a skeptic is right to discount this run.
    </p>

    <p>
      <strong>What I took from this:</strong> Specialist roles + ranking requirement = correct prioritization without nudging. But filesystem isolation is non-negotiable for clean experiments.
    </p>

    <h2>Run 3 — The Defensible Result</h2>

    <p><strong>Purpose:</strong> Full clean-room validation.</p>

    <p>
      <strong>Isolation measures:</strong> All <code>/tmp/ghostty*</code> directories from previous runs deleted. Fresh clone in a new directory. All agents (including reviewers) restricted to the experiment directory only. No <code>gh pr list</code>, no <code>git log</code> with messages, no PR-related commands. Fresh Claude Code session with no conversation history.
    </p>

    <p><strong>Prompt:</strong> Same specialist roles and ranking requirement as Run 2.</p>

    <p>
      <strong>Important caveat:</strong> By this point, the prompt had been optimized using lessons from Runs 1 and 2. I knew ranking mattered and I knew what a successful answer should roughly look like. Filesystem isolation is not cognitive isolation — the prompt itself is the product of iterative refinement. This is honest prompt engineering, not a true independent replication.
    </p>

    <p>
      <strong>Result:</strong> 29 minutes 48 seconds. No nudge. No contamination. No human input beyond the initial prompt.
    </p>

    <p>
      The model correctly ranked the primary cause, identified leaf widget reuse via <code>getAncestor(SurfaceScrolledWindow, surface)</code>, built an atomic <code>tree_bin.setChild(newRoot)</code> swap, and eliminated the multi-tick orphan-waiting mechanism. Code review passed clean within the experiment directory.
    </p>

    <p>
      The core technique matches the shipped fix. The differences are engineering refinements — my version does the rebuild synchronously in <code>propTree</code> (losing the <code>idleAdd</code> debounce), uses a bounded array instead of <code>BuildTreeResult</code>, and is missing <code>freezeNotify</code>/<code>thawNotify</code>. These matter for production. They don't change the fix strategy.
    </p>

    <p>
      <strong>I did not compile or test the generated code.</strong> The output is a fix strategy expressed as plausible Zig, not a validated patch. Same limitation applies to Codex — Prime noted that Mitchell manually corrected two bugs in Codex's output before merging. The question was never "can AI produce merge-ready code" but "can the model identify the correct approach."
    </p>

    <h2>Results</h2>

    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Run 1</th>
            <th>Run 2</th>
            <th>Run 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Purpose</strong></td>
            <td>Capability test</td>
            <td>Integrity test</td>
            <td>Clean room</td>
          </tr>
          <tr>
            <td>Specialist agents</td>
            <td>No</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Ranking requirement</td>
            <td>No</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Filesystem isolation</td>
            <td>N/A</td>
            <td>No</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Human nudge needed</td>
            <td>Yes (1 sentence)</td>
            <td>No</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Contamination</td>
            <td>None</td>
            <td>Review agent</td>
            <td>None</td>
          </tr>
          <tr>
            <td>Correct primary cause</td>
            <td>After nudge</td>
            <td>First pass</td>
            <td>First pass</td>
          </tr>
          <tr>
            <td>Core strategy matches shipped</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>What I Think This Shows (and Doesn't)</h2>

    <p>
      <strong>What it shows:</strong> A structured investigation workflow — parallel specialist agents, mandatory root-cause ranking, phased research — can steer Opus 4.6 toward the same fix strategy that Codex 5.3 found autonomously. Workflow scaffolding changed the outcome.
    </p>

    <p><strong>What it doesn't show:</strong></p>
    <ul>
      <li>That Opus and Codex are equivalent. I didn't control for the model variable.</li>
      <li>That prompting was the only factor. The execution environment, reasoning mode, and tool access also differed between Mitchell's run and mine.</li>
      <li>That the model "had the capability all along." What I showed is that a human-designed debugging framework plus multiple specialist agents plus explicit ranking can produce the right answer. That's a claim about workflow engineering.</li>
    </ul>

    <p>
      <strong>The honest framing:</strong> When a model fails at a hard task with a minimal prompt, it's worth asking how much of the failure is model capability vs. prompt structure. My experiment suggests workflow scaffolding explains at least some failures attributed to the model alone. It doesn't tell you how much.
    </p>

    <p>
      Mitchell's one-line prompt is a legitimate test of autonomous model behavior — and Codex 5.3 passed it brilliantly. My structured prompt is a test of guided reasoning and synthesis. These measure different things, and conflating them leads to wrong conclusions about what models can and can't do.
    </p>

    <h2>Costs and Acknowledgments</h2>

    <p>
      Total across three runs: ~$30 in Claude API usage. Ran on a Saturday — thanks to Anthropic for doubling weekend usage limits, which made running parallel Opus sessions feasible.
    </p>

    <p>My takeaway: a year ago I couldn't have dreamed of this. We live in interesting times.</p>

    <p>Setup scripts and methodology available on request. Happy to answer questions.</p>
  </>
);

export default GhosttyOpusFix;
