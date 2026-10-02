export const social = {
  linkedin: "https://www.linkedin.com/in/muhammad-safi-ur-rehman-934552253",
  twitter: "https://x.com/sevonai1",
  email: "m.safiurrehmann@gmail.com",
};

export const projects = [
  {
    id: "millos",
    number: "01",
    name: "Millos.ai",
    category: "Agent harness · Industry work",
    summary:
      "From construction drawings to structured estimates. An agent system built around real work, ambiguity, and human judgment.",
    stack: ["LangGraph", "Deep Agents", "Python", "Daytona"],
    role: "Harness Engineer · Zikra Infotech LLC",
    problem:
      "Construction drawings carry incomplete and ambiguous scope. Estimating needs a workflow that can identify what is known, ask for missing information, and produce traceable outputs.",
    contribution:
      "I work on lead-agent and worker-subagent orchestration, tool boundaries, middleware, context management, and history compaction. I also work across human-in-the-loop RFIs, checkpointed workflows, evaluations, and the surrounding full-stack platform.",
    architecture: [
      "Drawings + project context",
      "Lead agent + focused workers",
      "Takeoff + estimate ledger",
      "Checks + human RFIs",
      "Workbook + proposal",
    ],
    decisions: [
      "Separate reasoning from deterministic pricing and output checks.",
      "Run command execution in isolated Daytona sandboxes with versioned Docker images.",
      "Use LangSmith traces and graded runs to examine found, missed, and invented scope.",
      "Keep tenant access bounded through Supabase Auth, row-level security, and server-side writes.",
    ],
    evidence:
      "This is current professional work on the Millos.ai team. The description covers my contributions; private customer drawings, employer source code, and internal performance figures are not included.",
    learning:
      "An estimating agent needs a reliable way to ask, pause, and resume as much as it needs a strong model.",
  },
  {
    id: "clicky",
    number: "02",
    name: "Clicky",
    category: "Computer use · Personal project",
    summary:
      "A little voice-and-text assistant for a Mac. Real tools, scoped permissions, and a receipt before “done.”",
    stack: ["Swift", "Qwen", "Codex", "Playwright"],
    role: "Designer & developer",
    problem:
      "Natural-language computer control becomes unreliable when an agent acts on stale state or claims success without checking the result.",
    contribution:
      "I built a native macOS menu-bar assistant with a schema-validated planner, 26 executable actions, local and cloud planning, a VS Code bridge, file permissions, and structural Chrome automation.",
    architecture: [
      "Voice or typed intent",
      "Local / cloud planner",
      "Validated action",
      "Scoped tool execution",
      "Observation + receipt",
    ],
    decisions: [
      "Execute one action at a time, then inspect its outcome.",
      "Require a user-approved folder and prevent new-file overwrites.",
      "Validate browser references against the current snapshot.",
      "Protect unsaved editor changes and keep credentials in Keychain.",
    ],
    evidence:
      "23 automated tests passed in the September 2026 build. Live checks verified file creation after folder approval and Chrome form filling and clicking. Notes and Calculator passed earlier build checks. Voice and broader real-site workflows still need current end-to-end verification.",
    learning:
      "A successful tool call and a completed user task are different things. The harness has to verify both.",
  },
  {
    id: "agentforge",
    number: "03",
    name: "AgentForge",
    category: "Orchestration · AI platform",
    summary:
      "Compose agents into reusable workflows, with branching and a record of what happened along the way.",
    stack: ["FastAPI", "React", "OpenAI", "MongoDB"],
    role: "Full-stack AI development",
    problem:
      "Multi-step AI workflows need an understandable way to connect agents and inspect execution.",
    contribution:
      "I built visual agent chaining, backend execution orchestration, dynamic prompts, and persistent branching workflows with execution history.",
    architecture: [
      "Visual workflow",
      "Agent orchestration",
      "Branching execution",
      "Persistent history",
    ],
    decisions: [
      "Make agent composition visible in the interface.",
      "Persist execution history so runs can be inspected.",
      "Reuse workflow building blocks across use cases.",
    ],
    evidence:
      "Portfolio project documented in my résumé. Public source code and a live demo are not currently linked.",
    learning:
      "Workflow visibility helps people reason about an agent system before they run it.",
  },
  {
    id: "rag",
    number: "04",
    name: "Multi-Tenant RAG",
    category: "Retrieval · Applied AI",
    summary:
      "Document-grounded chatbots with tenant isolation, embeddable interfaces, and controlled API access.",
    stack: ["FastAPI", "Vector search", "React", "OpenAI"],
    role: "Full-stack AI development",
    problem:
      "An answer grounded in the wrong tenant’s documents is a security failure, even when it sounds correct.",
    contribution:
      "I built document upload and management, vector retrieval, tenant isolation, embeddable chatbots, and API-key access.",
    architecture: [
      "Tenant documents",
      "Scoped retrieval",
      "Grounded generation",
      "Embedded chatbot",
    ],
    decisions: [
      "Carry tenant scope through document management and retrieval.",
      "Connect answers to retrieved document context.",
      "Expose controlled integration points for embedding.",
    ],
    evidence:
      "Portfolio project documented in my résumé. The public portfolio focuses on the architecture and my contribution.",
    learning:
      "Access boundaries belong inside the retrieval path, not just in the interface.",
  },
  {
    id: "cofoundry",
    number: "05",
    name: "Cofoundry",
    category: "Product engineering · Applied AI",
    summary:
      "An idea-to-launch workflow for startup research, competitor analysis, and website generation.",
    stack: ["FastAPI", "React", "OpenAI"],
    role: "Full-stack AI development",
    problem:
      "Testing a startup idea involves several disconnected research and delivery steps.",
    contribution:
      "I built a platform that brings market research, competitor analysis, structured decision support, and website generation into one workflow.",
    architecture: [
      "Startup idea",
      "Research + analysis",
      "Decision support",
      "Website generation",
    ],
    decisions: [
      "Keep research outputs structured enough to inform next steps.",
      "Connect idea validation to a tangible website output.",
      "Build the backend and interface together around the user workflow.",
    ],
    evidence:
      "Portfolio project documented in my résumé. No unverified traction or business-outcome claims are presented.",
    learning:
      "Useful AI products connect reasoning to an output that someone can actually use.",
  },
];

export const phases = [
  {
    eyebrow: "Muhammad Safi ur Rehman / AI Engineer",
    title: "Intelligence,",
    accent: "engineered.",
    copy: "I build the systems around language models that turn their potential into useful products.",
    note: "Currently building agent harnesses at Zikra Infotech, on the Millos.ai team.",
    label: "The model",
    caption: "01 — A little intelligence. A lot of possibility.",
  },
  {
    eyebrow: "01 / Give intelligence a way to act",
    title: "A model needs",
    accent: "a world.",
    copy: "Tools connect reasoning to real actions. Memory brings the right context into the next decision.",
    note: "Tool design · Context management · Retrieval",
    label: "Tools & memory",
    caption: "02 — Connect capability to context.",
  },
  {
    eyebrow: "02 / Make every action accountable",
    title: "Capability needs",
    accent: "boundaries.",
    copy: "Guardrails define the scope. Evaluations tell us whether the system found, missed, or invented important work.",
    note: "Permissions · Evaluations · Trace debugging",
    label: "Control & quality",
    caption: "03 — Make the work inspectable.",
  },
  {
    eyebrow: "03 / Keep people in the loop",
    title: "Build for",
    accent: "real work.",
    copy: "Real tasks pause, change, and need judgment. Durable state and human approval let the system continue with context.",
    note: "Checkpoints · Pause & resume · Human review",
    label: "People & state",
    caption: "04 — Progress without losing the thread.",
  },
  {
    eyebrow: "04 / Bring the whole system together",
    title: "Potential becomes",
    accent: "a product.",
    copy: "The same core. A complete harness. An observable workflow that moves from input to a result someone can use.",
    note: "Illustrative estimating workflow · Inspired by my work at Millos.ai",
    label: "A complete system",
    caption: "05 — This is the engineering I do.",
  },
];
