import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Menu,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  Sun,
  X,
} from "lucide-react";
import { phases, projects, social } from "./content";
import { narrativeFrame } from "../shared/narrative.mjs";
import Bip, { BipCharacter } from "./Bip";
const HarnessScene = lazy(() => import("./HarnessScene"));

function initialTheme() {
  try {
    return localStorage.getItem("safi-theme") || "dark";
  } catch {
    return "dark";
  }
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [menu, setMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageProgress, setPageProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [bipOpen, setBipOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("system");
  const story = useRef<HTMLElement>(null);
  const narrative = narrativeFrame(progress, reduced);
  const phase = narrative.active;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("safi-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = story.current!.getBoundingClientRect();
      setProgress(
        Math.max(
          0,
          Math.min(
            1,
            -rect.top / Math.max(1, rect.height - window.innerHeight),
          ),
        ),
      );
      setPageProgress(
        window.scrollY /
          Math.max(
            1,
            document.documentElement.scrollHeight - window.innerHeight,
          ),
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reduced) {
      elements.forEach((el) => (el.dataset.revealed = "true"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reduced]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const readHash = () => {
      const id = location.hash.slice(1);
      if (projects.some((p) => p.id === id)) {
        setOpenProject(id);
        setTimeout(
          () =>
            document
              .getElementById(id)
              ?.scrollIntoView({ block: "start", behavior: "instant" }),
          80,
        );
      }
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  const jumpPhase = (index: number) => {
    const el = story.current!;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + range * (index === 4 ? 0.94 : index * 0.2 + 0.01),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const toggleProject = (id: string) => {
    const next = openProject === id ? null : id;
    setOpenProject(next);
    history.replaceState(null, "", next ? `#${id}` : "#work");
  };
  const navigate = (id: string) => {
    setMenu(false);
    if (projects.some((p) => p.id === id)) setOpenProject(id);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", `#${id}`);
    }, 40);
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(social.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${social.email}`;
    }
  };

  return (
    <>
      <a className="skip-link" href="#work">
        Skip animation to selected work
      </a>
      <div
        className="page-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${pageProgress})` }}
      />
      <header className="header">
        <a
          className="wordmark"
          href="#system"
          onClick={() => jumpPhase(0)}
          aria-label="Safi, back to top"
        >
          safi<span>.</span>
        </a>
        <nav
          aria-label="Main navigation"
          className={menu ? "main-nav open" : "main-nav"}
        >
          {["system", "work", "experience", "about"].map((id) => (
            <a
              key={id}
              className={activeSection === id ? "active" : ""}
              href={`#${id}`}
              onClick={() => setMenu(false)}
            >
              {id === "system"
                ? "The thinking"
                : id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a href="#contact" className="contact-link">
            Let’s talk <ArrowUpRight size={16} />
          </a>
          <button
            className="icon-button mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section id="system" className="story" ref={story}>
          <div className="story-stage">
            <div className="story-top mono">
              <span>INDEPENDENT MIND. SYSTEMS ENGINEER.</span>
              <span>PORTFOLIO — 2026</span>
            </div>
            <div className="hero-copy">
              <p className="hero-identity">
                <span className="tiny-light" />
                Muhammad Safi ur Rehman
              </p>
              <div className="narrative-stack">
                {phases.map((chapter, index) => (
                  <div
                    className="narrative-panel"
                    key={chapter.label}
                    aria-hidden={index !== phase}
                    inert={index !== phase}
                    style={{
                      opacity: 1,
                      transform: `translate3d(0, ${narrative.panels[index].y}%, 0)`,
                      visibility:
                        narrative.panels[index].opacity === 0
                          ? "hidden"
                          : "visible",
                    }}
                  >
                    <p className="eyebrow">
                      {index === 0
                        ? "AI Engineer / Agent systems & applied AI"
                        : chapter.eyebrow}
                    </p>
                    {index === 0 ? (
                      <h1>
                        {chapter.title}
                        <br />
                        <em>{chapter.accent}</em>
                      </h1>
                    ) : (
                      <h2 className="hero-title">
                        {chapter.title}
                        <br />
                        <em>{chapter.accent}</em>
                      </h2>
                    )}
                    <p className="hero-description">{chapter.copy}</p>
                    <p className="hero-note">{chapter.note}</p>
                    {index === 0 ? (
                      <div className="hero-links">
                        <a className="primary-button" href="#work">
                          Explore my work <ArrowUpRight size={17} />
                        </a>
                        <button
                          className="text-button"
                          onClick={() => setBipOpen(true)}
                        >
                          <BipCharacter small /> Meet Bip
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-button phase-next"
                        onClick={() =>
                          index < 4 ? jumpPhase(index + 1) : navigate("work")
                        }
                      >
                        {index === 4
                          ? "See it in my work"
                          : "Connect the next layer"}{" "}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="hero-scene"
              aria-label="One model, progressively assembled into an agent system"
            >
              <Suspense
                fallback={
                  <div className="scene-loading">
                    <span className="loading-orbit" />
                    Assembling the scene
                  </div>
                }
              >
                <HarnessScene
                  progress={progress}
                  paused={paused}
                  reduced={reduced}
                  theme={theme}
                />
              </Suspense>
              <span className="scene-caption mono">
                {phases[phase].caption}
              </span>
            </div>
            <div className="story-bottom">
              <button
                className="scroll-prompt"
                onClick={() =>
                  phase < 4 ? jumpPhase(phase + 1) : navigate("work")
                }
              >
                <ArrowDown size={17} />
                <span>
                  {phase === 0
                    ? "SCROLL TO BUILD THE SYSTEM"
                    : "KEEP EXPLORING"}
                </span>
              </button>
              <div className="chapter-nav" aria-label="Assembly chapters">
                <div className="chapter-status" aria-hidden="true">
                  <span>{phases[phase].label}</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                {phases.map((p, i) => (
                  <button
                    key={p.label}
                    aria-label={`Chapter ${i + 1}: ${p.label}`}
                    aria-current={i === phase ? "step" : undefined}
                    title={p.label}
                    onClick={() => jumpPhase(i)}
                  >
                    <span className="chapter-line">
                      <span
                        style={{
                          transform: `scaleX(${Math.max(0, Math.min(1, progress * 5 - i))})`,
                        }}
                      />
                    </span>
                    <span className="chapter-number">0{i + 1}</span>
                  </button>
                ))}
              </div>
              <button
                className="motion-button"
                onClick={() => setPaused(!paused)}
                aria-label={
                  paused
                    ? "Resume orbital animation"
                    : "Pause orbital animation"
                }
                aria-pressed={paused}
              >
                {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
                <span>
                  {reduced
                    ? "REDUCED MOTION"
                    : paused
                      ? "MOTION PAUSED"
                      : "MOTION ON"}
                </span>
              </button>
            </div>
          </div>
        </section>

        <section id="work" className="section work-section">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <div>
              <h2>
                Ideas with
                <br />
                <em>working parts.</em>
              </h2>
              <p>
                Different problems. The same care for the system behind the
                answer.
              </p>
            </div>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article
                className={`project ${openProject === project.id ? "expanded" : ""}`}
                key={project.id}
                id={project.id}
                data-reveal
              >
                <button
                  className="project-toggle"
                  onClick={() => toggleProject(project.id)}
                  aria-expanded={openProject === project.id}
                  aria-controls={`detail-${project.id}`}
                >
                  <span className="project-num mono">{project.number}</span>
                  <div className="project-name">
                    <span className="mono">{project.category}</span>
                    <h3>{project.name}</h3>
                  </div>
                  <div className="project-summary">
                    <p>{project.summary}</p>
                    <span className="project-stack mono">
                      {project.stack.join(" / ")}
                    </span>
                  </div>
                  <span className="project-arrow">
                    {openProject === project.id ? (
                      <Minus size={23} />
                    ) : (
                      <ArrowUpRight size={23} />
                    )}
                  </span>
                </button>
                <div
                  className="project-detail"
                  id={`detail-${project.id}`}
                  hidden={openProject !== project.id}
                >
                  <div className="detail-intro">
                    <span className="eyebrow">MY ROLE</span>
                    <p>{project.role}</p>
                    <button
                      className="text-button"
                      onClick={() => {
                        setBipOpen(true);
                        window.dispatchEvent(
                          new CustomEvent("bip-question", {
                            detail: `Tell me about ${project.name}`,
                          }),
                        );
                      }}
                    >
                      Ask Bip about this <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <div className="case-body">
                    <div>
                      <h4>The problem</h4>
                      <p>{project.problem}</p>
                    </div>
                    <div>
                      <h4>What I built</h4>
                      <p>{project.contribution}</p>
                    </div>
                    <div
                      className="architecture-strip"
                      aria-label="Architecture"
                    >
                      {project.architecture.map((step, i) => (
                        <span key={step}>
                          {i > 0 && <ArrowRight size={13} />}
                          <span>{step}</span>
                        </span>
                      ))}
                    </div>
                    <div>
                      <h4>Decisions that matter</h4>
                      <ul>
                        {project.decisions.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Evidence & current scope</h4>
                      <p>{project.evidence}</p>
                    </div>
                    <blockquote>{project.learning}</blockquote>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="section experience-section">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">02 / EXPERIENCE</p>
            <div>
              <h2>
                Building in
                <br />
                <em>the real world.</em>
              </h2>
              <p>
                From learning the models to engineering the systems around them.
              </p>
            </div>
          </div>
          <div className="experience-list">
            <div className="experience-row" data-reveal>
              <span className="mono experience-date">
                AUG 2026 — PRESENT
                <span className="current-label">
                  <i /> CURRENT
                </span>
              </span>
              <div>
                <h3>Harness Engineer</h3>
                <p className="employer">
                  Zikra Infotech LLC <span>/ Millos.ai team</span>
                </p>
                <p>
                  Building the harness for construction-estimating agents: lead
                  and worker orchestration, tool design, context management,
                  human review, durable workflows, and evaluation.
                </p>
                <p>
                  Across the stack: isolated execution with Daytona and Docker,
                  LangSmith traces, a Python estimate ledger, and a TypeScript
                  application backed by Supabase.
                </p>
              </div>
            </div>
            <div className="experience-row" data-reveal>
              <span className="mono experience-date">JAN — MAR 2026</span>
              <div>
                <h3>Software Developer</h3>
                <p className="employer">ExiTech</p>
                <p>
                  Developed web-based workflow automation and maintained
                  delivery workflows for business processes.
                </p>
              </div>
            </div>
            <div className="experience-row" data-reveal>
              <span className="mono experience-date">OCT 2025 — JAN 2026</span>
              <div>
                <h3>AI Engineer Intern</h3>
                <p className="employer">ExiTech</p>
                <p>
                  Built full-stack AI MVPs, vector-search retrieval, APIs, and
                  interactive interfaces with FastAPI, React, OpenAI, and
                  MongoDB.
                </p>
              </div>
            </div>
            <div className="experience-row" data-reveal>
              <span className="mono experience-date">JUN — AUG 2025</span>
              <div>
                <h3>AI Engineer Intern</h3>
                <p className="employer">Quantum Edge LLC</p>
                <p>
                  Worked with predictive modeling, CNNs, RNNs, and GANs,
                  training and evaluating models on real-world datasets.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="about-intro" data-reveal>
            <p className="eyebrow">03 / THE PERSON BEHIND THE SYSTEMS</p>
            <h2>
              I like the space between
              <br />
              <em>“what if” and “it works.”</em>
            </h2>
            <div className="about-columns">
              <p>
                I’m Safi, an AI engineer with a software engineering degree from
                FAST NUCES, Islamabad. I work across model behavior, backend
                systems, and the interfaces that make them useful.
              </p>
              <p>
                My favorite part is putting the pieces together: giving an agent
                the right tools, knowing when it should ask a person, and making
                sure the result holds up when the demo is over.
              </p>
            </div>
          </div>
          <div className="toolbox" data-reveal>
            <p className="eyebrow">THE TOOLBOX, WITH PURPOSE</p>
            {[
              [
                "Agent systems",
                "LangChain JS · Deep Agents · LangGraph · LangSmith",
                "Orchestration, context, tracing, and evaluation.",
              ],
              [
                "Application layer",
                "TypeScript · Python · Swift · Next.js · React · FastAPI",
                "From the runtime to the interface.",
              ],
              [
                "Data & access",
                "Supabase · Postgres · Drizzle · MongoDB · Qdrant",
                "Useful context with explicit boundaries.",
              ],
              [
                "Execution & delivery",
                "AWS Bedrock · Daytona · Docker · Vercel · GitHub Actions",
                "Isolated execution and repeatable delivery.",
              ],
            ].map(([name, tools, purpose]) => (
              <div className="toolbox-row" key={name}>
                <h3>{name}</h3>
                <div>
                  <p>{tools}</p>
                  <span>{purpose}</span>
                </div>
                <Plus size={14} />
              </div>
            ))}
          </div>
          <div className="education-line" data-reveal>
            <span className="mono">FOUNDATION</span>
            <p>
              BS Software Engineering{" "}
              <span>· FAST NUCES, Islamabad · 2026</span>
            </p>
            <a
              className="text-button"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              The full résumé <Download size={15} />
            </a>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div data-reveal>
            <p className="eyebrow">04 / WHAT COULD WE BUILD?</p>
            <h2>
              Let’s make
              <br />
              <em>intelligence useful.</em>
              <ArrowDownRight className="contact-flourish" aria-hidden="true" />
            </h2>
            <p className="contact-description">
              Have an interesting problem, an ambitious team, or a question
              about my work? I’d like to hear it.
            </p>
            <div className="email-row">
              <a href={`mailto:${social.email}`}>
                {social.email}
                <ArrowUpRight size={20} />
              </a>
              <button
                className="icon-button copy-email"
                aria-label={copied ? "Email copied" : "Copy email address"}
                onClick={copyEmail}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <span role="status" className="copy-state">
                {copied ? "Copied" : ""}
              </span>
            </div>
            <div className="social-links">
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <ArrowUpRight size={14} />
              </a>
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                X / @sevonai1 <ArrowUpRight size={14} />
              </a>
              <a
                href="/resume.pdf"
                download="Muhammad-Safi-ur-Rehman-Resume.pdf"
              >
                Résumé <Download size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#system">
          safi<span>.</span>
        </a>
        <span className="mono">CRAFTED WITH INTENT. BUILT TO BE USEFUL.</span>
        <a href="#system" className="text-button">
          Back to the beginning <ArrowUpRight size={15} />
        </a>
      </footer>
      <Bip open={bipOpen} setOpen={setBipOpen} navigate={navigate} />
    </>
  );
}
