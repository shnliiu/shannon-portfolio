import { useEffect, useRef, useState } from "react";
import { projects, experience, img, BASE, RESUME_URL, EMAIL, LINKS } from "./data.js";

/* ---------- routing (hash-based, so deep links work on GitHub Pages) ---------- */
const parse = () => {
  const p = (location.hash.replace(/^#\/?/, "") || "work").split("/");
  return { page: p[0], id: p[1] };
};
const useRoute = () => {
  const [r, setR] = useState(parse);
  useEffect(() => {
    const on = () => setR(parse());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return r;
};
const Link = ({ to, children, ...p }) => <a href={`#/${to}`} {...p}>{children}</a>;
const Ext = ({ href, children }) => (
  <a className="ext" href={href} target="_blank" rel="noreferrer noopener">
    {children}<span className="sr"> (opens in a new tab)</span>
  </a>
);

/* ---------- media ---------- */
function Img({ f, src, w, h, alt, ...p }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div className="img-missing" style={{ aspectRatio: `${w}/${h}` }} role="img" aria-label={`${alt} (image unavailable)`}>Image unavailable</div>;
  return <img src={src || img(f)} width={w} height={h} alt={alt} loading="lazy" decoding="async" onError={() => setBad(true)} {...p} />;
}

function Thumb({ id }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div className="thumb-fallback" aria-hidden="true"><span>Project demo video</span></div>;
  return <img src={`https://i.ytimg.com/vi/${id}/sddefault.jpg`} width={640} height={480} alt="" loading="lazy" decoding="async" onError={() => setBad(true)} />;
}

function Video({ id, title }) {
  const [on, setOn] = useState(false);
  if (on) return <iframe className="yt" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />;
  return (
    <button className="yt poster" onClick={() => setOn(true)} aria-label={`Play video: ${title}`}>
      <Thumb id={id} />
      <span className="play" aria-hidden="true" />
    </button>
  );
}

function Lightbox({ items, index, onClose, onMove }) {
  const ref = useRef(null);
  const it = items[index];
  const touchX = useRef(null);
  const onTouchStart = (e) => { touchX.current = e.touches[0]?.clientX ?? null; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 65) onMove(delta < 0 ? 1 : -1);
    touchX.current = null;
  };
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
      if (e.key === "Tab") { e.preventDefault(); ref.current?.focus(); }
    };
    addEventListener("keydown", key);
    return () => { removeEventListener("keydown", key); prev?.focus?.(); };
  }, []);
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}>
      <figure ref={ref} tabIndex={-1} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={(e) => e.stopPropagation()}>
        <Img f={it.f} w={it.w} h={it.h} alt={it.alt} loading="eager" />
        <figcaption>{it.cap} </figcaption>
        <div className="lb-bar">
          <button onClick={() => onMove(-1)} aria-label="Previous image">Previous</button>
          <button onClick={() => onMove(1)} aria-label="Next image">Next</button>
          <button onClick={onClose}>Close (Esc)</button>
        </div>
      </figure>
    </div>
  );
}

function Gallery({ items, label }) {
  const [i, setI] = useState(null);
  if (!items.length) return null;
  return (
    <section className="gallery" aria-label={label}>
      <ul>
        {items.map((m, k) => (
          <li key={m.f}>
            <button onClick={() => setI(k)} aria-label={`Enlarge: ${m.cap}`}>
              <Img f={m.f} w={m.w} h={m.h} alt={m.alt} />
            </button>
            <span>{m.cap}</span>
          </li>
        ))}
      </ul>
      {i !== null && <Lightbox items={items} index={i} onClose={() => setI(null)} onMove={(d) => setI((i + d + items.length) % items.length)} />}
    </section>
  );
}

/* Drawn from src/app/api/chat/route.ts in the physics-aid repo. Not a screenshot. */
function Diagram() {
  const box = (x, y, w, t1, t2) => (
    <g>
      <rect x={x} y={y} width={w} height="62" rx="3" />
      <text x={x + w / 2} y={y + 27}>{t1}</text>
      <text x={x + w / 2} y={y + 45} className="sub">{t2}</text>
    </g>
  );
  const arr = (x) => <path d={`M${x} 71h22`} />;
  return (
    <figure className="diagram">
      <svg viewBox="0 0 700 142" role="img" aria-labelledby="dt dd">
        <title id="dt">Physics AI tutor request flow</title>
        <desc id="dd">A student question goes to a Next.js API route. For complex questions the route fetches OpenStax University Physics chapter pages, adds them to the prompt, and sends it to a language model API, which returns the answer.</desc>
        {box(8, 40, 112, "Student", "tutor page")}{arr(122)}
        {box(146, 40, 120, "API route", "/api/chat")}{arr(268)}
        {box(292, 40, 140, "Complex question?", "then fetch OpenStax")}{arr(434)}
        {box(458, 40, 112, "Prompt", "question + text")}{arr(572)}
        {box(596, 40, 96, "LLM API", "answer")}
        <text x="350" y="22" className="cap">REQUEST FLOW</text>
        <text x="350" y="128" className="cap">OpenStax University Physics, Volumes 1–3</text>
      </svg>
      <figcaption>Architecture diagram drawn from the repository’s chat route. It is a diagram, not a screenshot of the app.</figcaption>
    </figure>
  );
}

/* ---------- ID badge ---------- */
function Badge() {
  const [flip, setFlip] = useState(false);
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -8}deg`);
    ref.current.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
  };
  const reset = () => { ref.current.style.setProperty("--rx", "0deg"); ref.current.style.setProperty("--ry", "0deg"); };
  return (
    <button ref={ref} className={`badge${flip ? " flip" : ""}`} onPointerMove={move} onPointerLeave={reset}
      onClick={() => setFlip(!flip)} aria-pressed={flip} aria-label="USC student ID. Press to flip for a little more about Shannon.">
      <span className="face front">
        <Img f="about-usc-id.png" w={1400} h={600} alt="Shannon Liu USC student ID, with student number obscured" />
      </span>
      <span className="face back id-back-design">
        <span className="id-back-content">
          <span className="id-back-row">
            <small>CURRENTLY</small>
            <strong>Seeking Summer 2027 software engineering internships.</strong>
          </span>
          <span className="id-back-row">
            <small>BUILDS</small>
            <strong>AI agents, full-stack web apps, educational tools.</strong>
          </span>
          <span className="id-back-focus">
            <small>FOCUS</small>
            <span className="id-focus-tags"><span>product</span><span>software</span><span>design</span></span>
          </span>
        </span>
        <span className="id-back-flip">Tap to flip to front</span>
      </span>
    </button>
  );
}

/* ---------- pages ---------- */
function Plate({ p }) {
  const m = p.media;
  return (
    <Link to={`work/${p.id}`} className={`plate plate-${p.layout} tone-${p.tone}`} aria-label={`${p.title}: view case study`}>
      <div className="plate-art">
        {p.layout === "video" && <div className="cover-video"><Thumb id={p.video}/><span className="cover-play" aria-hidden="true" /><span className="cover-video-label">WATCH THE PROJECT DEMO / 2025</span></div>}
        {p.layout === "phones" && <div className="phone-gallery"><span className="phone-gallery-label">DESIGNED & BUILT FOR A 160-MEMBER COHORT</span>{m.slice(0, 2).map((x) => <Img key={x.f} f={x.f} w={x.w} h={x.h} alt={x.alt} />)}<span className="phone-gallery-foot">PASS / SCANNER / CHECK-IN</span></div>}
        {p.layout === "diagram" && <div className="study-cover"><span>EDUCATION × ARTIFICIAL INTELLIGENCE</span><strong>Physics<br/>AI Study</strong><div className="study-flow"><span>01 / SELECT A BOOK</span><span>02 / EXPLORE CHAPTERS</span><span>03 / ASK THE AI TUTOR</span></div></div>}
        {p.layout === "type" && <div className="type-cover"><span>PROJECT / \u00a0{p.n}</span><strong>{p.title}</strong><small>{p.kind.toUpperCase()}</small></div>}
      </div>
      <div className="plate-text">
        <div className="plate-overline"><span>{p.n} / {p.kind} / {p.year}</span><span className="plate-view">View project</span></div>
        <h3>{p.title}</h3>
        <p>{p.lead}</p>
        <span className="plate-caption">{p.badge}</span>
      </div>
    </Link>
  );
}

function ShowcaseImage({ file, fallback }) {
  const [unavailable, setUnavailable] = useState(false);
  if (unavailable) return fallback;
  return <img src={img(file)} alt="" loading="lazy" decoding="async"
    onError={() => setUnavailable(true)} />;
}

function ProjectShowcase() {
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const stageRef = useRef(null);
  const projectsToShow = projects;

  const choose = (index) => {
    setActive(index);
    setCursor((c) => ({ ...c, visible: false }));
  };
  const track = (event) => {
    if (event.pointerType !== "mouse" || !stageRef.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current;
    const panel = event.target.closest(".showcase-panel");
    if (!panel || event.target.closest(".showcase-details") || event.target.closest("a")) {
      setCursor((c) => c.visible ? { ...c, visible: false } : c);
      return;
    }
    const panelRect = panel.getBoundingClientRect();
    const info = panel.querySelector(".showcase-details")?.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    if (info && event.clientY >= info.top - 8) {
      setCursor((c) => c.visible ? { ...c, visible: false } : c);
      return;
    }
    // Keep the floating project title within the active card instead of clipping at its edges.
    const titleHalfWidth = Math.min(230, Math.max(65, panelRect.width * 0.3));
    const safeX = Math.min(panelRect.right - titleHalfWidth, Math.max(panelRect.left + titleHalfWidth, event.clientX));
    setCursor({
      x: safeX - stageRect.left,
      y: Math.min(stageRect.height - 160, Math.max(65, event.clientY - stageRect.top)),
      visible: true
    });
  };
  const visual = (p, isActive) => {
    if (p.id === "mini-clint") return (
      <div className="cover-scene scene-clint">
        <ShowcaseImage file="mini-clint-terminal.jpg" fallback={<Img f="mini-clint-award-photo.jpg" w={782} h={1036} alt="" />} />
      </div>
    );
    if (p.id === "usc-flavors") return (
      <div className="cover-scene scene-flavors">
        <Img f="flavors-scanner-login.jpg" w={920} h={1640} alt="" />
        <div className={`flavors-open-image ${isActive ? "is-visible" : ""}`}>
          <Img f="flavors-scanner.jpg" w={920} h={1640} alt="" />
        </div>
      </div>
    );
    if (p.id === "physics-ai") return (
      <div className="cover-scene scene-physics">
        <ShowcaseImage file="physics-study-hub.jpg" fallback={<div className="cover-screenshot-pending">Physics Study Hub</div>} />
      </div>
    );
    if (p.id === "harange") return (
      <div className="cover-scene scene-harange">
        <ShowcaseImage file="harange-home.jpg" fallback={<div className="cover-screenshot-pending">Harangè / Live website</div>} />
      </div>
    );
    return (
      <div className="cover-scene scene-learning">
        <Img f="learningnco-vocab-lesson.webp" w={1440} h={810} alt="" />
      </div>
    );
  };
  return (
    <section className="project-showcase" id="selected-projects" aria-labelledby="archive">
      <div className="showcase-intro">
        <p className="label">01 / SELECTED WORK</p>
        <h2 id="archive">Selected <em>projects.</em></h2>
        <p>Explore five projects across AI, software, and design. Select a project to see the problem, outcome, and full case study.</p>
      </div>
      <div className={`showcase-stage ${cursor.visible ? "has-cursor" : ""}`} data-active={active}
        ref={stageRef} onPointerMove={track}
        onPointerLeave={() => setCursor((c) => ({ ...c, visible: false }))}>
        {projectsToShow.map((p, i) => (
          <article key={p.id} className={`showcase-panel ${i === active ? "is-active" : ""}`}
            onPointerEnter={(e) => { if (e.pointerType === "mouse" && active !== i) choose(i); }}>
            <div className="showcase-visual" aria-hidden="true">{visual(p, i === active)}</div>
            <div className="showcase-shade" aria-hidden="true" />
            <button type="button" className="showcase-select"
              aria-pressed={i === active} onClick={() => choose(i)} onFocus={() => choose(i)}
              aria-label={`Select project ${p.n}: ${p.title}`}>
              <span className="showcase-number">{p.n} / {p.kind}</span>
              <span className="showcase-name">{p.title}</span>
            </button>
            <div className="showcase-details">
              <div className="showcase-rule" aria-hidden="true"/>
              <strong className="showcase-stat">{["1st place / 15 teams", "A lower-cost check-in", "3 textbooks / AI tutor", "Website for Mozilla Festival", "44-page app prototype"][i]}</strong>
              <div className="showcase-details-row">
                <span className="showcase-year">{p.lead}</span>
                <Link to={`work/${p.id}`} className="showcase-link" onFocus={() => setCursor(c => ({...c, visible:false}))}>View case study</Link>
              </div>
            </div>
          </article>
        ))}
        {cursor.visible && <div className="showcase-cursor" aria-hidden="true"
          style={{ left: cursor.x, top: cursor.y }}>{projectsToShow[active].title}</div>}
      </div>
      <p className="showcase-access-note">On mobile, tap a project to expand it, then select View case study.</p>
    </section>
  );
}

const clientWebsites = [
  {
    name: "The Cross Schools",
    type: "Education",
    detail: "School website and online enrollment presence",
    url: "https://www.thecrossschools.com/",
    domain: "thecrossschools.com"
  },
  {
    name: "East Lake Cleaners",
    type: "Local business",
    detail: "Service-led website for a garment-care business",
    url: "https://www.eastlakecleaners.com/",
    domain: "eastlakecleaners.com"
  },
  {
    name: "Olive Tree College Applications",
    type: "College advising",
    detail: "Client website for admissions and advising services",
    url: "https://www.olivetreecollegeapps.com/",
    domain: "olivetreecollegeapps.com"
  },
  {
    name: "Re-Digging the Wells",
    type: "Community & nonprofit",
    detail: "Website for a faith-based community organization",
    url: "https://www.rediggingthewells.org/",
    domain: "rediggingthewells.org"
  }
];

function ClientWebsites() {
  return (
    <section className="client-sites" aria-labelledby="client-sites-title">
      <div className="client-sites-heading">
        <div>
          <p className="label">ALSO MADE / CLIENT WEBSITES</p>
          <h2 id="client-sites-title">Client <em>websites.</em></h2>
        </div>
        <p>Websites I've designed and built using website builders, working with clients on layout, content, and presentation.</p>
      </div>
      <div className="client-sites-index">
        {clientWebsites.map((site, i) => (
          <a className="client-site-row" key={site.url} href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${site.name} website in a new tab`}>
            <span className="client-site-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="client-site-name">{site.name}</span>
            <span className="client-site-meta"><span>{site.type}</span><small>{site.detail}</small></span>
            <span className="client-site-domain">{site.domain}</span>
            <span className="client-site-visit">Visit site</span>
          </a>
        ))}
      </div>
      <p className="client-sites-note">Website design and builder-based implementation are shown separately from the software engineering case studies above. Website content and availability may change after handoff.</p>
    </section>
  );
}

function HomeIntroduction() {
  return (
    <section className="home-introduction" aria-labelledby="home-introduction-title">
      <div className="home-introduction-title">
        <p className="label">A LITTLE MORE ABOUT ME</p>
        <h2 id="home-introduction-title">Engineering, design, <em>and the people behind both.</em></h2>
      </div>
      <div className="home-introduction-copy">
        <p>I enjoy the part of a project where a real problem starts becoming something useful. That has taken me from building AI tools and websites to helping student organizations run more smoothly.</p>
        <p>At USC, I work on university web and newsletter projects. Outside class, I'm involved with Flavors USC and Project Play, a startup developing a beginner-friendly musical instrument. I've also explored semiconductor fabrication through UCLA CNSI training.</p>
        <div className="home-introduction-links"><Link to="about">More about me</Link><Link to="experience">My experience</Link></div>
      </div>
    </section>
  );
}

function HomeClosing() {
  return (
    <section className="home-closing" aria-labelledby="home-closing-title">
      <div className="home-closing-intro">
        <p className="label">EXPERIENCE / INVOLVEMENT</p>
        <h2 id="home-closing-title">Beyond the <em>projects.</em></h2>
        <p>My experience includes web development at USC Viterbi, an education-technology internship in Seoul, and leadership in student organizations.</p>
      </div>
      <div className="home-closing-links">
        <div><span>01 / EXPERIENCE</span><strong>Work and internships</strong><Link to="experience">View experience</Link></div>
        <div><span>02 / ABOUT</span><strong>Clubs, Project Play & UCLA CNSI</strong><Link to="about">View involvement</Link></div>
        <div><span>03 / RÉSUMÉ</span><strong>Education, skills & experience</strong><Link to="resume">View résumé</Link></div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <>
      <section className="editorial-cover" aria-labelledby="editorial-cover-title">
        <div className="editorial-topnote">
          <span>SHANNON LIU</span>
          <span>SOFTWARE ENGINEERING & CREATIVE TECHNOLOGY</span>
          <span>LOS ANGELES, CA</span>
        </div>
        <div className="editorial-hero">
          <div className="editorial-hero-copy">
            <p className="editorial-eyebrow">PORTFOLIO / 2026</p>
            <h1 id="editorial-cover-title">Hi, I'm<br/><em>Shannon.</em></h1>
            <p className="editorial-lead">I’m a Computer Science & Engineering student at USC, interested in practical software and the way people experience it. My projects range from AI learning tools to websites and systems for student communities.</p>
            <div className="editorial-hero-links">
              <button type="button" onClick={() => document.getElementById("selected-projects")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}>View selected work</button>
              <Link to="about">About me</Link>
            </div>
            <div className="editorial-hero-footnote">USC VITERBI / B.S. COMPUTER SCIENCE & ENGINEERING</div>
          </div>
          <div className="editorial-hero-art home-student-id">
            <Badge />
            <p className="home-id-hint">Select the ID to flip it</p>
          </div>
        </div>
        <div className="editorial-ribbon">
          <span>AI & ENGINEERING</span><span>WEB DESIGN</span><span>COMMUNITY PROJECTS</span><span>SELECTED WORK · 2025—2026</span>
        </div>
      </section>
      <HomeIntroduction />
      <ProjectShowcase />
      <ClientWebsites />
      <HomeClosing />

    </>
  );
}

function DocumentLink({ file }) {
  const href = `${import.meta.env.BASE_URL}assets/docs/${file}`;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    fetch(href, { method: "HEAD" })
      .then((r) => { if (live) setReady(r.ok); })
      .catch(() => { if (live) setReady(false); });
    return () => { live = false; };
  }, [href]);
  return ready ? <a href={href} target="_blank" rel="noopener noreferrer">View presentation PDF</a> : <span className="doc-pending">Presentation PDF not yet uploaded</span>;
}

function PhysicsLivePreview() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const url = "https://physics-aid.vercel.app/tutor";
  return (
    <section className="physics-live" aria-labelledby="physics-live-title">
      <div className="physics-live-heading">
        <div>
          <p className="label">LIVE PROJECT / TRY THE TUTOR</p>
          <h2 id="physics-live-title">Try Physics Study Hub.</h2>
          <p>Explore the deployed physics tutor here or open the full application in a new tab.</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="physics-open-site">Open live app</a>
      </div>
      <div className="physics-live-window">
        <div className="physics-live-bar">
          <span className="physics-live-dots" aria-hidden="true"><i/><i/><i/></span>
          <span className="physics-live-address">physics-aid.vercel.app/tutor</span>
          <span className="physics-live-status">LIVE PREVIEW</span>
        </div>
        {previewOpen ? (
          <iframe
            title="Interactive Physics Study Hub tutor"
            src={url}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="physics-live-iframe"
            allow="clipboard-write"
          />
        ) : (
          <div className="physics-live-poster">
            <Img f="physics-study-hub.jpg" w={1600} h={900} alt="Physics Study Hub homepage screenshot" />
            <div className="physics-live-poster-action">
              <span>THE ACTUAL DEPLOYED PROJECT</span>
              <button type="button" onClick={() => setPreviewOpen(true)}>Launch interactive preview</button>
            </div>
          </div>
        )}
      </div>
      <p className="physics-live-note">If the preview cannot load, the app may block embedding or require its own browser session. <a href={url} target="_blank" rel="noopener noreferrer">Open Physics Study Hub directly</a>.</p>
    </section>
  );
}

function HarangeLivePreview() {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <section className="harange-live" aria-labelledby="harange-live-title">
      <div className="harange-live-heading">
        <div>
          <p className="label">INTERACTIVE PROJECT PREVIEW</p>
          <h2 id="harange-live-title">Explore the real website.</h2>
          <p>Browse the live Harangè site here, or open it full screen. This is the actual public website, not a recreation.</p>
        </div>
        <a href="https://www.harange.org/" target="_blank" rel="noopener noreferrer" className="harange-open-site">Open full website</a>
      </div>
      <div className="harange-browser">
        <div className="harange-browser-bar">
          <div className="harange-browser-dots" aria-hidden="true"><span/><span/><span/></div>
          <span className="harange-browser-address">www.harange.org</span>
          <span className="harange-browser-status">LIVE SITE</span>
        </div>
        {previewOpen ? (
          <iframe
            title="Interactive preview of the Harangè website"
            src="https://www.harange.org/"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="harange-iframe"
          />
        ) : (
          <div className="harange-preview-intro">
            <span>HARANGÈ / GIRLSWHOML × MOZILLA FESTIVAL 2025</span>
            <strong>Experience the live project.</strong>
            <p>Open the interactive preview to browse Harangè from within this portfolio.</p>
            <button type="button" onClick={() => setPreviewOpen(true)}>Launch interactive preview</button>
          </div>
        )}
      </div>
      <p className="harange-embed-note">Some browsers or website security settings may prevent embedded viewing. If the preview is blank or displays an error, use <a href="https://www.harange.org/" target="_blank" rel="noopener noreferrer">Open full website</a> instead.</p>
    </section>
  );
}

function Case({ id }) {
  const [internshipReady, setInternshipReady] = useState(false);
  useEffect(() => {
    if (id !== "learningnco") { setInternshipReady(false); return; }
    let live = true;
    fetch(img("learningnco-vocab-cover.webp"), { method: "HEAD" })
      .then((r) => { if (live) setInternshipReady(r.ok); })
      .catch(() => { if (live) setInternshipReady(false); });
    return () => { live = false; };
  }, [id]);
  const i = projects.findIndex((p) => p.id === id);
  if (i < 0) return <section className="page"><h1 tabIndex={-1} className="focus-h">Project not found</h1><p><Link to="work">Back to the work archive</Link></p></section>;
  const p = projects[i], next = projects[(i + 1) % projects.length], prev = projects[(i + projects.length - 1) % projects.length];
  return (
    <article className={`case tone-${p.tone}`}>
      <Link to="work" className="back">Work archive</Link>
      <header className="case-head">
        <p className="label">{p.n} · {p.kind} · {p.year} · {p.org}</p>
        <h1 tabIndex={-1} className="focus-h">{p.title}</h1>
        <p className="deck">{p.lead}</p>
        {p.links.length > 0 && <div className="case-quicklinks">{p.links.map(l => <Ext key={l.href} href={l.href}>{l.label.includes("GitHub") || l.label.includes("Source") ? "View public GitHub source" : l.label}</Ext>)}</div>}
        <span className="chip">{p.badge}</span>
      </header>
      <div className="case-body case-story">
        <div className="prose">{p.sections.map(([h, t]) => <section key={h}><h2>{h}</h2><p>{t}</p></section>)}</div>
        <aside><h2 className="label">Tools used</h2><ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul></aside>
      </div>
      {p.video && <section aria-label="Project demonstration video" className="case-video"><Video id={p.video} title={`${p.title} project demonstration`} /></section>}
      {p.id === "physics-ai" && <PhysicsLivePreview />}
      {p.id === "harange" && <HarangeLivePreview />}
      {p.layout === "diagram" && <Diagram />}

      {p.creds && <section className="creds" aria-label="Recognition and credentials"><h2 className="label">Recognition and credentials</h2><ul>{p.creds.map((c) => <li key={c}>{c}</li>)}</ul></section>}
      <Gallery items={p.id === "learningnco" && !internshipReady ? [] : p.media} label={`${p.title} images`} />
      {p.documents && (
        <section className="internship-documents">
          <p className="label">PROJECT DELIVERABLES / CONCEPTS & USER FLOWS</p>
          <h2>A closer look at the work.</h2>
          <div className="internship-doc-grid">
            {p.documents.map((doc, index) => (
              <div key={doc.file} className="internship-doc-card">
                <span className="internship-doc-num">0{index + 1} / LEARNINGNCO</span>
                <h3>{doc.title}</h3>
                <p>{doc.subtitle}</p>
                <DocumentLink file={doc.file}/>
              </div>
            ))}
          </div>
          <p className="internship-disclosure">These presentations are design concepts, not screenshots of shipped applications. The internal SS101 developer handoff document is not published.</p>
        </section>
      )}
      {p.certificate && (
        <section className="certificate-section" aria-label="Certificate">
          <div className="certificate-section-title"><p className="label">CERTIFICATION / 2025</p><h2>Completed the mentorship.</h2><p>View the original Chinchilla AI Academy certificate.</p></div>
          <a className="certificate-preview-link" href={img(p.certificate)} target="_blank" rel="noopener noreferrer" aria-label="Open Chinchilla AI mentorship certificate PDF in a new tab">
            <div className="certificate-preview-icon" aria-hidden="true">PDF</div><span>CHINCHILLA AI ACADEMY<br/><strong>View certificate</strong></span>
          </a>
        </section>
      )}
      
      <nav className="pn" aria-label="Project navigation">
        <Link to={`work/${prev.id}`}>Previous: {prev.title}</Link>
        <Link to={`work/${next.id}`}>Next: {next.title}</Link>
      </nav>
    </article>
  );
}

const involvement = [
  {
    id: "flavors",
    index: "01",
    name: "Flavors USC",
    tag: "STUDENT ORGANIZATION / USC",
    role: "Executive Board · Graphic Design",
    text: "I work on visuals and member experiences for Flavors, a USC student community. I also built the check-in system used for cohort meetings.",
    photos: ["about-flavors-1.jpg", "about-flavors-2.jpg"],
    links: [{ href: "https://www.uscflavors.com/", label: "Flavors website" }, { href: "https://www.instagram.com/uscflavors/?hl=en", label: "Flavors Instagram" }, { to: "work/usc-flavors", label: "My attendance system" }]
  },
  {
    id: "project-play",
    index: "02",
    name: "Project Play",
    tag: "STARTUP / MUSIC TECHNOLOGY",
    role: "Founding Team",
    text: "Project Play is building a beginner-friendly chord synthesizer to make playing music more approachable. I've been involved in the team's launch and creative work.",
    photos: ["about-project-play-1.jpg", "about-project-play-2.jpg"],
    links: [{ href: "https://www.projectplay.tech/", label: "Project Play website" }, { href: "https://www.instagram.com/projectplay.tech/", label: "Project Play Instagram" }]
  }
];

function InvolvementPhotos({ files, name }) {
  const [available, setAvailable] = useState([]);
  useEffect(() => {
    let active = true;
    Promise.all(files.map(async (file) => {
      try { const r = await fetch(img(file), { method: "HEAD" }); return r.ok && (r.headers.get("content-type") || "").startsWith("image/") ? file : null; }
      catch { return null; }
    })).then(found => { if (active) setAvailable(found.filter(Boolean)); });
    return () => { active = false; };
  }, [files.join("|")]);
  if (!available.length) return null;
  return <div className="involvement-photos">{available.map((file, i) => <Img key={file} f={file} w={900} h={600} alt={`${name} photo ${i+1}`} />)}</div>;
}

const cnsiCertificates = [
  { title: "Cleanroom Protocols and Safety", description: "Certificate of participation · October 3, 2025", badge: "cnsi-badge-cleanroom.png", pdf: "cnsi-cleanroom-protocols.pdf" },
  { title: "Introduction to Microfabrication", description: "Certificate of participation · October 10, 2025", badge: "cnsi-badge-microfabrication.png", pdf: "cnsi-introduction-to-microfabrication.pdf" },
  { title: "Introduction to Lithography", description: "Certificate of completion · November 7, 2025", badge: "cnsi-badge-lithography.png", pdf: "cnsi-introduction-to-lithography.pdf" }
];

function CnsiGallery() {
  return (
    <div className="cnsi-media">
      <div className="cnsi-photo-grid">
        <figure className="cnsi-photo cnsi-photo-main">
          <Img f="about-cnsi-1.jpg" w={1200} h={1600} alt="Participants in protective cleanroom suits during UCLA CNSI microelectronics training" />
          <figcaption>Cleanroom training</figcaption>
        </figure>
        <figure className="cnsi-photo cnsi-photo-second">
          <Img f="about-cnsi-2.jpg" w={1200} h={1600} alt="Microscope and monitor in a microelectronics laboratory" />
          <figcaption>Laboratory equipment</figcaption>
        </figure>
        <figure className="cnsi-photo cnsi-photo-third">
          <Img f="about-cnsi-3.jpg" w={1200} h={1600} alt="Semiconductor wafers and tools on a laboratory workbench" />
          <figcaption>Wafer samples</figcaption>
        </figure>
      </div>
      <div className="cnsi-certificates">
        <div className="cnsi-certificate-heading">
          <h3>Training certificates</h3>
          <p>IEEE certificates earned during the UCLA CNSI program.</p>
        </div>
        <div className="cnsi-certificate-grid">
          {cnsiCertificates.map((certificate) => (
            <a key={certificate.pdf} className="cnsi-certificate" href={`${BASE}assets/docs/${certificate.pdf}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${certificate.title} PDF certificate`}>
              <Img f={certificate.badge} w={400} h={400} alt={`${certificate.title} IEEE course badge`} />
              <span className="cnsi-certificate-info"><strong>{certificate.title}</strong><small>{certificate.description}</small><span className="cnsi-certificate-action">View certificate (PDF)</span></span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const diplomaImages = [
  { file: "diploma-physics-norco.jpg", title: "Physics for Transfer", school: "Norco College" },
  { file: "diploma-pre-engineering-norco.jpg", title: "Pre-Engineering", school: "Norco College" },
  { file: "diploma-math-science-norco.jpg", title: "Math and Science", school: "Norco College" },
  { file: "diploma-social-behavioral-norco.jpg", title: "Social and Behavioral Studies", school: "Norco College" },
  { file: "diploma-mathematics-mt-sac.jpg", title: "Liberal Arts and Sciences (Mathematics)", school: "Mt. San Antonio College" }
];

function DiplomaGallery() {
  const [found, setFound] = useState([]);
  const [pdfFound, setPdfFound] = useState(false);
  const diplomaPdf = `${BASE}assets/docs/Shannon_Liu_Associate_Degrees.pdf`;
  useEffect(() => {
    let mounted = true;
    Promise.all(diplomaImages.map(async (d) => {
      try {
        const r = await fetch(img(d.file), { method: "HEAD" });
        return r.ok && (r.headers.get("content-type") || "").startsWith("image/") ? d.file : null;
      } catch { return null; }
    })).then(files => { if (mounted) setFound(files.filter(Boolean)); });
    fetch(diplomaPdf, { method: "HEAD" })
      .then(r => { if (mounted) setPdfFound(r.ok && (r.headers.get("content-type") || "").includes("pdf")); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);
  if (!found.length && !pdfFound) return null;
  return (
    <div className="diploma-gallery" aria-label="Associate degree diplomas">
      <div className="diploma-gallery-heading">
        <h3>Degree certificates</h3>
        {pdfFound && <a href={diplomaPdf} target="_blank" rel="noopener noreferrer">View all five diplomas (PDF)</a>}
      </div>
      {found.length > 0 && <div className="diploma-gallery-grid">
        {diplomaImages.filter(d => found.includes(d.file)).map(d => (
          <a key={d.file} href={img(d.file)} target="_blank" rel="noopener noreferrer" className="diploma-thumbnail" aria-label={`View ${d.title} diploma from ${d.school}`}>
            <Img f={d.file} w={850} h={680} alt={`${d.school} diploma: ${d.title}`} />
            <span>{d.title}<small>{d.school}</small></span>
          </a>
        ))}
      </div>}
    </div>
  );
}

function About() {
  return (
    <div className="about-page">
      <section className="page about">
        <div>
          <p className="label">ABOUT</p>
          <h1 tabIndex={-1} className="focus-h">About <em>me.</em></h1>
          <p className="deck">I'm studying Computer Science and Engineering at USC Viterbi, after earning five associate degrees through Norco College and Mt. SAC.</p>
          <p>My work includes AI tools, web development, and student-led projects. Outside of coursework, I've also spent time on student organizations, design, music technology, and hands-on microelectronics training.</p>
          <p><Link to="experience" className="btn">Experience</Link> <Link to="work" className="btn ghost">Projects</Link></p>
        </div>
        <figure className="about-award-photo">
          <Img f="mini-clint-award-photo.jpg" w={782} h={1036} alt="Shannon holding her award at the Cal Poly AWS AI Summer Camp" />
          <figcaption>Cal Poly AWS AI Summer Camp · 2025</figcaption>
        </figure>
      </section>
      <section className="about-education" aria-labelledby="education-title">
        <div className="about-education-heading">
          <p className="label">EDUCATION</p>
          <h2 id="education-title">Academic <em>background.</em></h2>
          <p>My path to USC included coursework in mathematics, physics, and engineering at two community colleges.</p>
        </div>
        <div className="about-education-records">
          <div className="education-record">
            <span className="education-record-year">2026–2028 (expected)</span>
            <div>
              <h3>University of Southern California</h3>
              <p>B.S. in Computer Science and Engineering · Viterbi School of Engineering</p>
            </div>
          </div>
          <div className="education-record">
            <span className="education-record-year">2026</span>
            <div>
              <h3>Norco College &amp; Mt. San Antonio College</h3>
              <p>Five associate degrees, including four from Norco College awarded with Great Distinction.</p>
              <ul className="education-degrees">
                <li><strong>A.S. Physics for Transfer</strong><span>Norco · Great Distinction</span></li>
                <li><strong>A.S. Pre-Engineering</strong><span>Norco · Great Distinction</span></li>
                <li><strong>A.S. Math and Science</strong><span>Norco · Great Distinction</span></li>
                <li><strong>A.A. Social and Behavioral Studies</strong><span>Norco · Great Distinction</span></li>
                <li><strong>A.A. Liberal Arts and Sciences, Mathematics Emphasis</strong><span>Mt. SAC</span></li>
              </ul>
            </div>
          </div>
        </div>
        <DiplomaGallery />
      </section>
      <section className="involvement-section" aria-labelledby="involvement-title">
        <div className="about-section-heading">
          <p className="label">AT USC / INVOLVEMENT</p>
          <h2 id="involvement-title">Outside the <em>classroom.</em></h2>
          <p>Student organizations and projects I'm involved in beyond my coursework.</p>
        </div>
        <div className="involvement-list">
          {involvement.map((item) => <article key={item.id} className={`involvement-entry involvement-${item.id}`}>
            <span className="involvement-number">{item.index}</span>
            <div className="involvement-content">
              <span className="label">{item.tag}</span>
              <h3>{item.name}</h3>
              <p className="involvement-role">{item.role}</p>
              <p>{item.text}</p>
              <div className="involvement-links">{item.links.map((link) => link.to ? <Link key={link.to} to={link.to}>{link.label}</Link> : <a key={link.href} target="_blank" rel="noopener noreferrer" href={link.href}>{link.label}</a>)}</div>
              <InvolvementPhotos files={item.photos} name={item.name} />
            </div>
          </article>)}
        </div>
      </section>
      <section className="cnsi-section" aria-labelledby="cnsi-title">
        <div className="cnsi-index"><span className="label">ADDITIONAL TRAINING / 2025</span><span>UCLA CNSI</span></div>
        <div className="cnsi-body">
          <div>
            <h2 id="cnsi-title">Inside the <em>cleanroom.</em></h2>
            <p className="cnsi-role">UCLA California NanoSystems Institute · Microelectronics Training Program</p>
          </div>
          <div className="cnsi-description">
            <p>Selected as one of ten participants for microelectronics training in October–November 2025. I learned about semiconductor fabrication and lithography, including cleanroom procedures and wafer processing.</p>

          </div>
        </div>
        <CnsiGallery />
      </section>
    </div>
  );
}

function Experience() {
  return (
    <section className="page">
      <p className="label">TIMELINE / 03</p>
      <h1 tabIndex={-1} className="focus-h">Places I’ve <em>worked.</em></h1>
      <ol className="xp">
        {experience.map((x) => (
          <li key={x.org} className={`tone-${x.tone}`}>
            <time>{x.when}</time>
            <div><h2>{x.org}</h2><p className="role">{x.role}</p><ul>{x.pts.map((t) => <li key={t}>{t}</li>)}</ul></div>
          </li>
        ))}
      </ol>
      <section className="edu"><p className="label">Education</p>
        <p><b>USC Viterbi School of Engineering</b>, B.S. Computer Science and Engineering, expected December 2028.</p>
        <p>Previously Norco College and Mt. San Antonio College: five associate degrees.</p>
      </section>
    </section>
  );
}

function Resume() {
  const [pdfReady, setPdfReady] = useState(false);
  useEffect(() => {
    if (!RESUME_URL) return;
    let live = true;
    fetch(RESUME_URL, { method: "HEAD" })
      .then((r) => { if (live) setPdfReady(r.ok); })
      .catch(() => { if (live) setPdfReady(false); });
    return () => { live = false; };
  }, []);
  return (
    <section className="page">
      <p className="label">DOCUMENTS / 04</p>
      <h1 tabIndex={-1} className="focus-h">My <em>résumé.</em></h1>
      {pdfReady ? (
        <>
          <p><a className="btn" href={RESUME_URL} download>Download PDF</a></p>
          <object className="pdf" data={RESUME_URL} type="application/pdf" aria-label="Résumé PDF preview"><p>Preview unavailable in this browser. Use the download button.</p></object>
        </>
      ) : (
        <div className="callout" role="status">
          <b>The résumé PDF has not been published to this site yet.</b>
          <p>Upload <code>Shannon_Liu_Resume.pdf</code> into <code>public/assets/docs/</code>. The PDF preview and download button will appear automatically after deployment.</p>
          <p><a className="btn" href={`mailto:${EMAIL}?subject=Résumé request`}>Request the résumé</a></p>
        </div>
      )}
      <p className="label">Find me</p>
      <ul className="links"><li><Ext href={LINKS.github}>GitHub</Ext></li><li><Ext href={LINKS.linkedin}>LinkedIn</Ext></li><li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li></ul>
    </section>
  );
}

/* ---------- shell ---------- */
const tabs = [["work", "Work"], ["about", "About"], ["experience", "Experience"], ["resume", "Résumé"]];
const titles = { work: "Work", about: "About", experience: "Experience", resume: "Résumé" };

export default function App() {
  const { page, id } = useRoute();
  const [menu, setMenu] = useState(false);
  const main = useRef(null);
  useEffect(() => {
    const root = main.current;
    if (!root) return;
    const targets = root.querySelectorAll(".cover-heading, .cover-collage, .showcase-intro, .showcase-stage, .contact-strip, .page > *, .case-head, .case-video, .case-body, .gallery, .internship-documents, .certificate-section");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("entered");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px 20px 0px" });
    targets.forEach((target, index) => {
      target.classList.add("reveal-ready");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 70}ms`);
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, [page, id]);
  useEffect(() => {
    const t = id ? projects.find((p) => p.id === id)?.title : titles[page];
    document.title = `${t || "Not found"} · Shannon Liu`;
    scrollTo(0, 0);
    setMenu(false);
    main.current?.querySelector(".focus-h")?.focus({ preventScroll: true });
  }, [page, id]);
  const view = page === "work" && id ? <Case id={id} /> : page === "work" ? <Work /> : page === "about" ? <About /> : page === "experience" ? <Experience /> : page === "resume" ? <Resume /> : <section className="page"><h1 tabIndex={-1} className="focus-h">Page not found</h1><Link to="work">Home</Link></section>;
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>Skip to content</a>
      <header className="top">
        <Link to="work" className="wordmark">Shannon <span>·</span> Liu</Link>
        <button className="menu-btn" aria-expanded={menu} aria-controls="tabs" onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}</button>
        <nav id="tabs" className={`tabs${menu ? " open" : ""}`} aria-label="Primary">
          {tabs.map(([k, l]) => <Link key={k} to={k} aria-current={page === k ? "page" : undefined}>{l}</Link>)}
        </nav>
      </header>
      <main id="main" ref={main} tabIndex={-1}>{view}</main>
      <footer className="foot">
        <span>© 2026 Shannon Liu · Los Angeles</span>
        <span><Ext href={LINKS.github}>GitHub</Ext> · <Ext href={LINKS.linkedin}>LinkedIn</Ext> · <a href={`mailto:${EMAIL}`}>Email</a></span>
      </footer>
    </>
  );
}
