// All site content lives here. To add a project, append an object to `projects`;
// to add media, drop a file in public/assets/img and reference it in `media`.
export const BASE = import.meta.env.BASE_URL;
export const img = (f) => `${BASE}assets/img/${f}`;

export const RESUME_URL = `${BASE}assets/docs/Shannon_Liu_Resume.pdf`;
export const EMAIL = "shannon.liu04@gmail.com";
export const LINKS = {
  github: "https://github.com/shnliiu",
  linkedin: "https://linkedin.com/in/shannonliu00",
};

export const projects = [
  {
    id: "mini-clint", n: "01", title: "Mini Clint", kind: "AI agents", year: "2025",
    tone: "blue", layout: "video",
    org: "Cal Poly AWS AI Summer Camp",
    lead: "An AI agent that answers university math placement questions.",
    badge: "1st place of 15 teams",
    stack: ["Python", "AWS SES", "Amazon S3", "Amazon Bedrock", "Amazon Q"],
    video: "ty9m0VWL6cA",
    links: [{ label: "Email agent source", href: "https://github.com/shnliiu/math_placement_emails" }],
    sections: [
      ["Context", "A five-person team built four components: an AWS SES email agent, a phone-call agent, an AI chatbot, and chatbot guardrails. I led the team in dividing responsibilities and overseeing progress."],
      ["My contribution", "I built the AWS SES email implementation, using Amazon Q to assist development. Institutional information was collected in a shared Amazon S3 bucket, and each teammate built their own retrieval workflow for their component."],
      ["The hard part", "Connecting retrieved information to student-specific details. The agent had to decide whether an inquiry was about math placement, use student-provided credentials to find the matching record in synthetic student data, retrieve the relevant placement information, and write an appropriate email reply."],
      ["Outcome", "First place out of 15 teams."],
    ],
    media: [
      { f: "mini-clint-team.jpg", w: 782, h: 1036, alt: "Mini Clint team holding awards at the Cal Poly AWS AI Summer Camp", cap: "Mini Clint team" },
      { f: "mini-clint-award-photo.jpg", w: 782, h: 1036, alt: "Shannon holding her award at the AI Summer Camp", cap: "Personal award photograph" },
      { f: "mini-clint-first-place.jpg", w: 1404, h: 1084, alt: "Mini Clint first-place team award certificate", cap: "First-place team award" },
      { f: "mini-clint-ai-mastery.jpeg", w: 1404, h: 1084, alt: "Shannon Liu AI Mastery certificate", cap: "AI Mastery certificate" },
      { f: "mini-clint-shaving-the-yak.jpeg", w: 1404, h: 1084, alt: "Shannon Liu Shaving the Yak award certificate", cap: "Shaving the Yak award" },
      { f: "mini-clint-aws-certificate.jpeg", w: 1408, h: 1055, alt: "AWS Building Generative AI Applications Using Amazon Bedrock certificate", cap: "AWS Bedrock training certificate" },
    ],
    creds: ["First-place team award", "AI Mastery certificate", "Shaving the Yak award", "AWS certificate: Building Generative AI Applications Using Amazon Bedrock"],
  },
  {
    id: "usc-flavors", n: "02", title: "USC Flavors Attendance", kind: "Full-stack web app", year: "2026",
    tone: "red", layout: "phones",
    org: "Student organization, about 160 cohort members",
    lead: "QR member passes and an officer scanner, built after a $50/month wallet API proved too costly.",
    badge: "Replaced a ~$50/month option",
    stack: ["JavaScript", "Google Apps Script", "Google Sheets", "QR codes", "GitHub Pages"],
    links: [{ label: "Source", href: "https://github.com/shnliiu/usc-flavors-attendance" }],
    sections: [
      ["Context", "The organization considered a digital wallet API for attendance, at roughly $50 per month, which was too expensive. I built an alternative with digital member passes, unique QR codes, an officer scanner interface, check-in tracking and meeting management. Google Sheets is the data source and Google Apps Script is the backend."],
      ["Design, testing and improvement", "Built the pass and scanner workflow with Google Sheets, Apps Script, and static HTTPS pages to avoid an approximately $50/month paid service. When a large group attempted to open passes simultaneously, the site became slow; I adjusted polling and request frequency to reduce unnecessary backend traffic."],
      ["Results and next steps", "The attendance system is functioning in subsequent use, and the test pass screenshots show its check-in states. I have not yet repeated the full simultaneous-load test, so capacity under a 160-person surge is still an open validation task."],
      ["Privacy", "The screenshots use a test account. Its QR credential has been disabled and is no longer valid."],
    ],
    media: [
      { f: "flavors-pass.jpg", w: 920, h: 1640, alt: "USC Flavors digital membership pass for a test account", cap: "Member pass / test account" },
      { f: "flavors-scanner-login.jpg", w: 920, h: 1640, alt: "USC Flavors officer scanner PIN entry screen", cap: "Scanner login" },
      { f: "flavors-scanner.jpg", w: 920, h: 1640, alt: "USC Flavors officer scanner processing a check-in", cap: "Scanning a member" },
      { f: "flavors-already-checked-in.jpg", w: 920, h: 1640, alt: "USC Flavors scanner already-checked-in confirmation", cap: "Duplicate check-in confirmation" },
      { f: "flavors-welcome.jpg", w: 920, h: 1640, alt: "USC Flavors successful check-in welcome message", cap: "Successful check-in" },
    ],
  },
  {
    id: "physics-ai", n: "03", title: "Physics Study Hub", kind: "AI / education", year: "2025",
    tone: "green", layout: "diagram",
    org: "Chinchilla AI Academy",
    lead: "One place to study from three physics textbooks, with an AI tutor.",
    badge: "Four-week mentorship project",
    stack: ["Next.js", "TypeScript", "Claude Code", "MCP servers", "AI-assisted workflows"],
    links: [{ label: "Live Physics Tutor", href: "https://physics-aid.vercel.app/tutor" }, { label: "Source on GitHub", href: "https://github.com/shnliiu/physics-aid" }],
    sections: [
      ["Context", "During a four-week developer mentorship I learned Claude Code, MCP servers and AI-assisted engineering workflows. At Riverside City College, students used three separate textbooks with class materials scattered across chapters."],
      ["What I built", "A website with textbook selection, chapter navigation, practice problems and a retrieval-based AI tutoring chatbot. These core features worked."],
      ["Engineering decisions and next steps", "The delivered platform focused on making three textbooks searchable through chapter navigation, practice problems, and an AI tutor. I also explored adding a student forum, but kept it outside the completed scope because moderation and implementation requirements needed further work."],
    ],
    creds: ["Chinchilla AI Academy mentorship completion certificate"],
    media: [],
    certificate: "physics-chinchilla-certificate.pdf",
  },
  {
    id: "harange", n: "04", title: "Harangè", kind: "Frontend", year: "2025",
    tone: "sand", layout: "type",
    org: "GirlsWhoML × Mozilla Festival",
    lead: "The initial desktop website, built from Figma designs.",
    badge: "Initial desktop build",
    stack: ["Next.js", "React", "Tailwind CSS", "Claude Code", "Figma"],
    links: [{ label: "Live site", href: "https://harange.org" }],
    sections: [
      ["What I did", "Given Figma designs, I built the initial desktop website from scratch using Claude Code. I developed the frontend experience and created placeholder mosaic tiles because another team was building the backend."],
      ["Collaboration and scope", "I implemented the initial desktop frontend from Figma and created placeholder mosaic tiles while the backend was developed separately. Teammates subsequently handled mobile responsiveness and later integration, allowing us to divide responsibilities across the project."],
    ],
    media: [], missing: ["Screenshots of the site"],
  },
  {
    id: "learningnco", n: "05", title: "LearningNCo", kind: "Product design & docs", year: "2026",
    tone: "sand", layout: "type",
    org: "Developer intern, Seoul, South Korea",
    lead: "Designing approachable English-learning experiences, from app concepts to developer handoff.",
    badge: "Vocabulary prototype + SS101 product specification",
    stack: ["Product design", "UI/UX", "Learning flows", "Technical handoff", "Canva"],
    links: [],
    sections: [
      ["Problem and approach", "LearningNCo wanted to turn existing English-learning materials into approachable digital experiences. I worked on vocabulary-learning interface designs and an implementation-ready SS101 product specification so the team could evaluate features and guide future development."],
      ["Vocabulary learning app", "I independently designed a 44-page vocabulary-learning app prototype covering onboarding, student learning journeys, themed flashcards, pronunciation and listening practice, quizzes, review, and progress tracking. The screens show how the experience would work, with design notes explaining key choices."],
      ["Sentence Stretching 101", "Our team proposed an application based on LearningNCo's Sentence Stretching 101 book. We explored its user experience in a concept presentation, then prepared a detailed 71-page developer handoff with proposed screens, feature behavior, user flows, and technical considerations."],
      ["My contribution", "I designed the vocabulary app prototype independently. The SS101 presentation and technical documentation were collaborative work. The 71-page manual is an internal draft and is not published on this portfolio."],
      ["Outcome and learning", "Delivered a 44-page vocabulary-app prototype and contributed to a 71-page SS101 technical handoff that communicated user flows, feature requirements, and proposed APIs. I learned how to turn loosely defined educational ideas into concrete, reviewable product deliverables. The documents are designs and specifications, not evidence of a launched production app."],
    ],
    media: [
      { f: "learningnco-vocab-cover.webp", w: 1440, h: 810, alt: "Vocabulary learning app concept cover", cap: "Vocabulary learning prototype / cover" },
      { f: "learningnco-vocab-dashboard.webp", w: 1440, h: 810, alt: "Vocabulary learning app dashboard concept", cap: "Vocabulary app / dashboard" },
      { f: "learningnco-vocab-lesson.webp", w: 1440, h: 810, alt: "Vocabulary learning lesson and pronunciation screen", cap: "Vocabulary app / interactive lessons" },
      { f: "learningnco-ss101-cover.webp", w: 1440, h: 810, alt: "SS101 sentence stretching app concept presentation cover", cap: "SS101 / concept presentation" },
      { f: "learningnco-ss101-home.webp", w: 1440, h: 810, alt: "SS101 mascot-based home screen design", cap: "SS101 / home screen" },
      { f: "learningnco-ss101-diagnostic.webp", w: 1440, h: 810, alt: "SS101 diagnostic placement flow concept", cap: "SS101 / placement flow" },
    ],
    documents: [
      { title: "Vocabulary Learning App", subtitle: "44-page independently designed prototype", file: "LearningNCo_Vocabulary_Prototype.pdf" },
      { title: "Sentence Stretching 101", subtitle: "32-page collaborative concept presentation", file: "LearningNCo_SS101_Concept.pdf" },
    ],
  },
];

export const experience = [
  { org: "USC Viterbi School of Engineering", role: "AI & Website Assistant", when: "Aug 2026 – Present", tone: "red",
    pts: ["Implemented new HTML email newsletter templates from Figma designs.", "Worked through email-client rendering issues: dark mode, National 2 font compatibility and Arial fallbacks.", "Tested rendering with Email on Acid.", "Manages department websites in WordPress."] },
  { org: "LearningNCo · Seoul", role: "Developer Intern", when: "Summer 2026", tone: "blue",
    pts: ["Planned and designed educational app concepts, including a vocabulary learning app.", "Wrote a detailed technical handoff document."] },
  { org: "Chinchilla AI Academy", role: "AI Development Trainee", when: "Fall 2025", tone: "green",
    pts: ["Four-week developer mentorship in Claude Code, MCP servers and AI-assisted workflows.", "Built the Physics AI Study Platform."] },
  { org: "Association for Computing Machinery", role: "Vice President", when: "2025 – 2026", tone: "sand",
    pts: ["Helped lead a 500+ member community.", "Secured $2,500 to send 15 students to Cal Hacks."] },
];
