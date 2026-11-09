import { useEffect, useRef, useState } from "react";
import { projects, experience, img, RESUME_URL, EMAIL, LINKS } from "./data.js";

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
    {children}<span aria-hidden="true"> ↗</span><span className="sr"> (opens in a new tab)</span>
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
      <span className="play" aria-hidden="true">▶</span>
    </button>
  );
}

function Lightbox({ items, index, onClose, onMove }) {
  const ref = useRef(null);
  const it = items[index];
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
      <figure ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <Img f={it.f} w={it.w} h={it.h} alt={it.alt} loading="eager" />
        <figcaption>{it.cap} </figcaption>
        <div className="lb-bar">
          <button onClick={() => onMove(-1)} aria-label="Previous image">←</button>
          <button onClick={() => onMove(1)} aria-label="Next image">→</button>
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
  const arr = (x) => <path d={`M${x} 71h22m-6-5 6 5-6 5`} />;
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
      <span className="face back">
        <small>CURRENTLY</small>
        <span>Seeking Summer 2027 software engineering internships.</span>
        <small>BUILDS</small>
        <span>AI agents, full-stack web apps, educational tools.</span>
        <small>FLIP BACK ↺</small>
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
        {p.layout === "video" && <div className="cover-video"><Thumb id={p.video}/><span className="cover-play" aria-hidden="true">▶</span><span className="cover-video-label">WATCH THE PROJECT DEMO / 2025</span></div>}
        {p.layout === "phones" && <div className="phone-gallery"><span className="phone-gallery-label">DESIGNED & BUILT FOR A 160-MEMBER COHORT</span>{m.slice(0, 2).map((x) => <Img key={x.f} f={x.f} w={x.w} h={x.h} alt={x.alt} />)}<span className="phone-gallery-foot">PASS / SCANNER / CHECK-IN</span></div>}
        {p.layout === "diagram" && <div className="study-cover"><span>EDUCATION × ARTIFICIAL INTELLIGENCE</span><strong>Physics<br/>AI Study</strong><div className="study-flow"><span>01 / SELECT A BOOK</span><span>02 / EXPLORE CHAPTERS</span><span>03 / ASK THE AI TUTOR</span></div></div>}
        {p.layout === "type" && <div className="type-cover"><span>PROJECT / \u00a0{p.n}</span><strong>{p.title}</strong><small>{p.kind.toUpperCase()}</small></div>}
      </div>
      <div className="plate-text">
        <div className="plate-overline"><span>{p.n} / {p.kind} / {p.year}</span><span>↗</span></div>
        <h3>{p.title}</h3>
        <p>{p.lead}</p>
        <span className="plate-caption">{p.badge}</span>
      </div>
    </Link>
  );
}

function Work() {
  const [mini, flavors, physics, ...other] = projects;
  return (
    <>
      <section className="cover-intro">
        <div className="cover-topline"><span>SHANNON LIU / PORTFOLIO 2026</span><span>SOFTWARE ENGINEERING · CREATIVE TECHNOLOGY</span></div>
        <div className="cover-layout">
          <div className="cover-heading">
            <p className="label">HELLO, I'M SHANNON.</p>
            <h1>Ideas in<br/><em>motion.</em></h1>
            <p className="deck">I'm a USC Computer Science & Engineering student building practical AI systems, interactive web products, and tools for communities.</p>
            <div className="intro-tags"><span>ENGINEERING</span><span>PRODUCT</span><span>CREATIVE THINKING</span></div>
            <div className="intro-cta"><button onClick={() => document.getElementById("selected-projects")?.scrollIntoView({behavior:"smooth"})}>Discover my work <span aria-hidden="true">↘</span></button><Link to="resume">Résumé ↗</Link></div>
          </div>
          <div className="cover-collage">
            <div className="collage-number">PORTFOLIO / 001</div>
            <div className="collage-film"><Img f="mini-clint-team.jpg" w={782} h={1036} alt="Mini Clint team celebrating their first-place award" /><div className="film-strip"><span>MINI CLINT</span><span>AI / AGENTS</span></div></div>
            <div className="collage-ticket"><span>01 / FEATURED STORY</span><strong>FIRST PLACE</strong><span>CAL POLY AWS AI SUMMER CAMP</span></div>
            <Link to="work/mini-clint" className="collage-link">EXPLORE THE STORY ↗</Link>
          </div>
        </div>
        <div className="cover-foot"><span>USC VITERBI / LOS ANGELES</span><span>AVAILABLE SUMMER 2027</span><span>SCROLL ↓</span></div>
      </section>

      <section className="work-index" id="selected-projects" aria-labelledby="archive">
        <header className="index-heading">
          <div><p className="label">01 / SELECTED PROJECTS</p><h2 id="archive">The work<span>.</span></h2></div>
          <p>Projects with a purpose. Explore the process, the engineering, and the results behind each one.</p>
        </header>

        <div className="work-feature">
          <div className="feature-visual feature-mini">
            <Img f="mini-clint-award-photo.jpg" w={782} h={1036} alt="Shannon holding her Cal Poly AWS AI Summer Camp award" />
            <div className="mini-overlay"><span>AWARD-WINNING AI PROJECT</span><b>Mini Clint</b><span>CAL POLY × AWS / 2025</span></div>
          </div>
          <div className="feature-copy">
            <span className="label">01 / AI AGENTS</span>
            <h3>Making math placement <em>make sense.</em></h3>
            <p>I led a five-person team and built an AWS SES email agent that uses retrieved information and synthetic student records to respond to placement questions.</p>
            <div className="feature-facts"><span>1ST PLACE / 15 TEAMS</span><span>RAG · AWS SES · AMAZON S3</span></div>
            <Link to="work/mini-clint" className="feature-link">View case study <span>↗</span></Link>
          </div>
        </div>
        <div className="two-features">
          <Plate p={flavors}/>
          <Plate p={physics}/>
        </div>
        <div className="index-footer">
          <p className="label">02 / MORE IN THE ARCHIVE</p>
          {other.map((p)=><Link key={p.id} to={`work/${p.id}`} className="archive-line"><span>{p.n} / {p.year}</span><strong>{p.title}</strong><span>{p.kind}</span><span aria-hidden="true">↗</span></Link>)}
        </div>
      </section>
      <section className="contact-strip">
        <span className="label">A LITTLE MORE ABOUT ME</span>
        <h2>Curiosity meets <em>craft.</em></h2>
        <Link to="about">Get to know me ↗</Link>
      </section>
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
  return ready ? <a href={href} target="_blank" rel="noopener noreferrer">View presentation PDF ↗</a> : <span className="doc-pending">Presentation PDF not yet uploaded</span>;
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
  if (i < 0) return <section className="page"><h1 tabIndex={-1} className="focus-h">Project not found</h1><p><Link to="work">← Back to the work archive</Link></p></section>;
  const p = projects[i], next = projects[(i + 1) % projects.length], prev = projects[(i + projects.length - 1) % projects.length];
  return (
    <article className={`case tone-${p.tone}`}>
      <Link to="work" className="back">← Work archive</Link>
      <header className="case-head">
        <p className="label">{p.n} · {p.kind} · {p.year} · {p.org}</p>
        <h1 tabIndex={-1} className="focus-h">{p.title}</h1>
        <p className="deck">{p.lead}</p>
        <span className="chip">{p.badge}</span>
      </header>
      {p.video && <section aria-label="Project demonstration video" className="case-video"><Video id={p.video} title={`${p.title} project demonstration`} /></section>}
      {p.layout === "diagram" && <Diagram />}
      <div className="case-body">
        <div className="prose">{p.sections.map(([h, t]) => <section key={h}><h2>{h}</h2><p>{t}</p></section>)}</div>
        <aside>
          <h2 className="label">Stack</h2>
          <ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          {p.links.length > 0 && <><h2 className="label">Links</h2><ul className="links">{p.links.map((l) => <li key={l.href}><Ext href={l.href}>{l.label}</Ext></li>)}</ul></>}
        </aside>
      </div>
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
            <div className="certificate-preview-icon" aria-hidden="true">PDF</div><span>CHINCHILLA AI ACADEMY<br/><strong>View certificate ↗</strong></span>
          </a>
        </section>
      )}
      
      <nav className="pn" aria-label="Project navigation">
        <Link to={`work/${prev.id}`}>← {prev.title}</Link>
        <Link to={`work/${next.id}`}>{next.title} →</Link>
      </nav>
    </article>
  );
}

function About() {
  return (
    <section className="page about">
      <div>
        <p className="label">PERSONAL FILE / 02</p>
        <h1 tabIndex={-1} className="focus-h">A little more <em>human.</em></h1>
        <p className="deck">I’m a Computer Science and Engineering student at USC Viterbi, transferring in with five associate degrees from Norco College and Mt. SAC. I like building software people can use right away: AI assistants, check-in tools, study aids, websites.</p>
        <p>I lead teams (project manager for Mini Clint, ACM vice president) and I care about the design side too, from Figma-to-code frontends to email templates that survive dark mode.</p>
        <p><Link to="experience" className="btn">Experience</Link> <Link to="work" className="btn ghost">The work</Link></p>
      </div>
      <Badge />
    </section>
  );
}

function Experience() {
  return (
    <section className="page">
      <p className="label">TIMELINE / 03</p>
      <h1 tabIndex={-1} className="focus-h">Work in <em>progress.</em></h1>
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
      <h1 tabIndex={-1} className="focus-h">The short <em>version.</em></h1>
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
    const t = id ? projects.find((p) => p.id === id)?.title : titles[page];
    document.title = `${t || "Not found"} · Shannon Liu`;
    scrollTo(0, 0);
    setMenu(false);
    main.current?.querySelector(".focus-h")?.focus({ preventScroll: true });
  }, [page, id]);
  const view = page === "work" && id ? <Case id={id} /> : page === "work" ? <Work /> : page === "about" ? <About /> : page === "experience" ? <Experience /> : page === "resume" ? <Resume /> : <section className="page"><h1 tabIndex={-1} className="focus-h">Page not found</h1><Link to="work">← Home</Link></section>;
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>Skip to content</a>
      <header className="top">
        <Link to="work" className="wordmark">Shannon <span>✳</span> Liu</Link>
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
