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
  return <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} width={480} height={360} alt="" loading="lazy" decoding="async" onError={() => setBad(true)} />;
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
      onClick={() => setFlip(!flip)} aria-pressed={flip} aria-label="Shannon Liu ID badge. Press to flip.">
      <span className="badge-clip" aria-hidden="true" />
      <span className="face front">
        <small>USC · VITERBI SCHOOL OF ENGINEERING</small>
        <b className="mono-mark" aria-hidden="true">SL</b>
        <strong>Shannon Liu</strong>
        <span>Computer Science & Engineering</span>
        <small>CLASS OF DEC 2028</small>
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
      <div className="plate-art" aria-hidden={p.layout === "type"}>
        {p.layout === "video" && <><Thumb id={p.video} /><span className="play">▶</span></>}
        {p.layout === "phones" && m.map((x) => <Img key={x.f} f={x.f} w={x.w} h={x.h} alt="" style={{ height: x.h > 300 ? 300 : 170, width: "auto" }} />)}
        {p.layout === "diagram" && <div className="mini-flow"><i>question</i><i>textbook</i><i>tutor</i></div>}
        {p.layout === "type" && <span className="big-n">{p.n}</span>}
      </div>
      <div className="plate-text">
        <span className="label">{p.n} · {p.kind} · {p.year}</span>
        <h3>{p.title}<span className="plate-arrow" aria-hidden="true">↗</span></h3>
        <p>{p.lead}</p>
        <span className="plate-caption">{p.badge}</span>
      </div>
    </Link>
  );
}

function Work() {
  const [a, b, c, ...rest] = projects;
  return (
    <>
      <section className="hero">
        <div className="hero-note"><span>VOL. 01 / AN ENGINEER'S ARCHIVE</span><span>LOS ANGELES · 2026</span></div>
        <div className="hero-composition">
          <div className="hero-text">
            <p className="label">HELLO, I'M SHANNON LIU <span aria-hidden="true">✳</span></p>
            <h1>Making<br /><em>things</em><br />work<span className="hero-period">.</span></h1>
            <p className="deck">Engineering with a creative point of view. I’m a USC Computer Science & Engineering student building AI agents, web applications, and useful tools for real communities.</p>
            <p className="hero-meta">USC VITERBI · DECEMBER 2028 · AVAILABLE SUMMER 2027</p>
            <div className="hero-actions"><button type="button" className="btn" onClick={() => document.getElementById("archive-section")?.scrollIntoView({ behavior: "smooth" })}>Explore selected work <span aria-hidden="true">↘</span></button><Link to="resume" className="resume-text">Résumé ↗</Link></div>
          </div>
          <div className="hero-plate">
            <div className="hero-plate-label"><span>FIG 01 / PROJECT DEMONSTRATION</span><span>MINI CLINT</span></div>
            <Video id={a.video} title="Mini Clint project demonstration"/>
            <div className="hero-video-caption"><span>FIRST PLACE / 15 TEAMS</span><Link to="work/mini-clint">OPEN CASE STUDY ↗</Link></div>
          </div>
        </div>
        <div className="hero-bottom"><span>AI · PRODUCT ENGINEERING · CREATIVE TECHNOLOGY</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>
      <section aria-labelledby="archive" id="archive-section">
        <header className="sec-head"><div><p className="label">01 / PROJECT INDEX</p><h2 id="archive">Selected <em>work.</em></h2></div><p className="sec-blurb">What I built, why I built it, and the problems I worked through.</p></header>
        <div className="archive">
          <Plate p={a} /><Plate p={b} /><Plate p={c} />
          {rest.map((p) => <Plate key={p.id} p={p} />)}
        </div>
      </section>
    </>
  );
}

function Case({ id }) {
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
      <Gallery items={p.media} label={`${p.title} images`} />
      
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
  return (
    <section className="page">
      <p className="label">DOCUMENTS / 04</p>
      <h1 tabIndex={-1} className="focus-h">The short <em>version.</em></h1>
      {RESUME_URL ? (
        <>
          <p><a className="btn" href={RESUME_URL} download>Download PDF</a></p>
          <object className="pdf" data={RESUME_URL} type="application/pdf" aria-label="Résumé PDF preview"><p>Preview unavailable in this browser. Use the download button.</p></object>
        </>
      ) : (
        <div className="callout" role="status">
          <b>The résumé PDF has not been published to this site yet.</b>
          <p>Add <code>Shannon_Liu_Resume.pdf</code> to <code>public/</code> and set <code>RESUME_URL</code> in <code>src/data.js</code> to show a preview and download button here.</p>
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
