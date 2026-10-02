export const destinations = {
  work: { label: "Explore the projects", href: "#work" },
  millos: { label: "Inside Millos.ai", href: "#millos" },
  clicky: { label: "Explore Clicky", href: "#clicky" },
  agentforge: { label: "Explore AgentForge", href: "#agentforge" },
  rag: { label: "Explore the RAG platform", href: "#rag" },
  cofoundry: { label: "Explore Cofoundry", href: "#cofoundry" },
  experience: { label: "See experience", href: "#experience" },
  about: { label: "About Safi & his stack", href: "#about" },
  system: { label: "See the harness come together", href: "#system" },
  contact: { label: "Get in touch", href: "#contact" },
  resume: { label: "Read the résumé", href: "/resume.pdf" },
};

export const facts = [
  {
    id: "intro",
    keywords: [
      "who",
      "safi",
      "introduce",
      "yourself",
      "summary",
      "background",
      "engineer",
    ],
    sources: ["experience", "work"],
    answer:
      "Safi is Muhammad Safi ur Rehman, an AI engineer building agent harnesses and applied AI products. He works at Zikra Infotech LLC on the Millos.ai team, combining multi-agent orchestration, human review, evaluations, and full-stack delivery. Start with Millos.ai for his industry work, or Clicky for his personal computer-use project.",
  },
  {
    id: "experience",
    keywords: [
      "job",
      "experience",
      "zikra",
      "current",
      "working",
      "employment",
      "since",
      "august",
      "role",
    ],
    sources: ["experience"],
    answer:
      "Safi has been a Harness Engineer at Zikra Infotech LLC on the Millos.ai team since August 2026. Previously, he was a Software Developer and AI Engineer Intern at ExiTech, and an AI Engineer Intern at Quantum Edge LLC. His current focus is the engineering around agents: tools, context, durable workflows, human review, and evaluation.",
  },
  {
    id: "millos",
    keywords: [
      "millos",
      "estimating",
      "construction",
      "millwork",
      "production",
      "drawings",
      "bedrock",
    ],
    sources: ["millos"],
    answer:
      "At Millos.ai, Safi works on an agent harness for construction estimating. His work includes lead and worker agents with Deep Agents and LangChain JS, checkpointed LangGraph workflows, LangSmith traces, RFIs and human review, isolated Daytona/Docker execution, and a Python estimate ledger. He also contributes to the Next.js and Supabase platform. The public case study describes his contribution without exposing customer drawings or private source code.",
  },
  {
    id: "clicky",
    keywords: [
      "clicky",
      "mac",
      "voice",
      "computer",
      "desktop",
      "swift",
      "assistant",
      "26",
      "23",
    ],
    sources: ["clicky"],
    answer:
      "Clicky is Safi’s native Mac assistant with voice and typed input. It has 26 executable actions spanning approved-folder files, selected text, native UI, Chrome, Notes, Calculator, and Trello. Its planner acts one step at a time and checks tool receipts. The September 2026 build passed 23 automated tests; live checks verified file creation and browser form interaction. Voice and broader workflows still need current end-to-end checks.",
  },
  {
    id: "agentforge",
    keywords: ["agentforge", "visual", "pipeline", "pipelines", "branching"],
    sources: ["agentforge"],
    answer:
      "AgentForge is a visual multi-agent workflow platform. Safi built agent chaining, backend orchestration, dynamic prompts, persistent branching workflows, and execution history using FastAPI, React, OpenAI, and MongoDB. The central idea is to make agent composition and execution easier to understand.",
  },
  {
    id: "rag",
    keywords: [
      "rag",
      "retrieval",
      "documents",
      "tenant",
      "tenants",
      "chatbot",
      "embeddable",
      "vector",
    ],
    sources: ["rag"],
    answer:
      "Safi’s Multi-Tenant RAG platform supports document uploads, vector retrieval, embeddable chatbots, and controlled API access. The important engineering boundary is tenant isolation: each retrieval must stay within the right tenant’s documents. The stack includes FastAPI, React, vector search, and OpenAI.",
  },
  {
    id: "cofoundry",
    keywords: [
      "cofoundry",
      "startup",
      "founder",
      "validation",
      "competitor",
      "market",
    ],
    sources: ["cofoundry"],
    answer:
      "Cofoundry brings startup validation and delivery into one workflow. Safi built market research, competitor analysis, structured decision support, and a website generation and deployment flow with FastAPI, React, and OpenAI.",
  },
  {
    id: "harness",
    keywords: [
      "harness",
      "orbit",
      "core",
      "spinning",
      "animation",
      "orchestration",
      "explain",
      "guardrail",
      "guardrails",
    ],
    sources: ["system", "millos", "clicky"],
    answer:
      "An agent harness is the software around a language model: tool interfaces, context and memory, permission boundaries, evaluations, workflow state, tracing, and human approval. Safi’s work connects these pieces so a model can act toward a useful outcome. The orbiting scene is an illustration of those components coming together, not a live run.",
  },
  {
    id: "stack",
    keywords: [
      "stack",
      "skills",
      "tools",
      "languages",
      "technologies",
      "typescript",
      "python",
      "langchain",
      "react",
      "docker",
      "supabase",
      "langgraph",
      "langsmith",
    ],
    sources: ["about", "millos"],
    answer:
      "Safi’s core languages are TypeScript and Python, with Swift for Clicky. His agent stack includes LangChain JS, Deep Agents, LangGraph, and LangSmith. Across delivery he uses AWS Bedrock, Daytona, Docker, Supabase/Postgres, Drizzle, Next.js, React, FastAPI, Vercel, and GitHub Actions. The portfolio links each tool to the job it does.",
  },
  {
    id: "education",
    keywords: [
      "education",
      "degree",
      "graduate",
      "university",
      "fast",
      "studied",
      "study",
      "islamabad",
    ],
    sources: ["about", "resume"],
    answer:
      "Safi completed a BS in Software Engineering at FAST NUCES, Islamabad, in June 2026. His résumé lists a CGPA of 3.08, along with study in AI, generative AI, databases, software architecture, algorithms, and cloud computing.",
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "email",
      "hire",
      "hiring",
      "recruit",
      "collaborate",
      "reach",
      "linkedin",
      "twitter",
      "salary",
      "availability",
      "available",
    ],
    sources: ["contact", "resume"],
    answer:
      "You can reach Safi at m.safiurrehmann@gmail.com, on LinkedIn as Muhammad Safi Ur Rehman, or on X as @sevonai1. For a role or collaboration, send the problem, team context, and what you’d like him to build. I don’t have confirmed salary expectations or current availability; please ask him directly.",
  },
  {
    id: "resume",
    keywords: ["resume", "résumé", "cv", "download"],
    sources: ["resume"],
    answer:
      "You can open or download Safi’s résumé here. It covers his current Harness Engineer role at Zikra Infotech, prior experience, selected AI projects, education, and technical skills.",
  },
  {
    id: "tour",
    keywords: [
      "tour",
      "guide",
      "recommend",
      "best",
      "start",
      "navigate",
      "show",
      "projects",
      "project",
    ],
    sources: ["millos", "clicky", "experience"],
    answer:
      "Here’s a short route: Millos.ai shows Safi’s professional agent-harness work. Clicky shows how he designs guarded computer-use tools. Then visit Experience or the résumé for the wider picture. Choose a destination below and I’ll take you there.",
  },
];

export function retrieve(message) {
  const normalized = message.toLowerCase().normalize("NFKC");
  const tokens = new Set(normalized.match(/[\p{L}\p{N}]+/gu) || []);
  const identityQuestion = /\bwho (?:is|are)\b.*\b(?:safi|you|muhammad)\b/.test(
    normalized,
  );
  return facts
    .map((f) => ({
      ...f,
      score: f.keywords.reduce(
        (score, word) =>
          score +
          (tokens.has(word) && !["safi", "who"].includes(word)
            ? word === f.id
              ? 5
              : 1
            : 0),
        f.id === "intro" && identityQuestion ? 4 : 0,
      ),
    }))
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function guideAnswer(message) {
  if (
    /\b(ignore|override|system prompt|api key|secret|password|instructions above|reveal prompt)\b/i.test(
      message,
    )
  ) {
    return {
      answer:
        "I can help you explore Safi’s public work, skills, and experience. I don’t have private account details to share. Where would you like to start?",
      sources: ["work", "experience"],
      mode: "guide",
    };
  }
  if (/^(hi|hey|hello|thanks|thank you)[!.\s]*$/i.test(message.trim())) {
    return {
      answer:
        "Hi! I’m Bip, Safi’s portfolio guide. Ask me about his experience, the agent harness, or a project. I can also give you a quick tour.",
      sources: ["work", "experience"],
      mode: "guide",
    };
  }
  const matches = retrieve(message);
  if (!matches.length)
    return {
      answer:
        "I don’t have that information in Safi’s portfolio. I can tell you about his projects, skills, experience, or how to get in touch.",
      sources: ["work", "contact"],
      mode: "guide",
    };
  return {
    answer: matches[0].answer,
    sources: matches[0].sources,
    mode: "guide",
  };
}
