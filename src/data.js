// All site content lives here. To add a project, append an object to `projects`;
// to add media, drop a file in public/assets/img and reference it in `media`.
export const BASE = import.meta.env.BASE_URL;
export const img = (f) => `${BASE}assets/img/${f}`;

export const RESUME_URL = `${BASE}assets/docs/Shannon_Liu_Resume.pdf?v=4b8f7390`;
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
      ["Problem","Students asking about university math placement need clear answers based on school guidance and their academic history. Our camp team explored how an AI assistant could respond to these inquiries using retrieved information rather than generic answers."],
      ["My role","I led task assignments for a five-person team and implemented the AWS SES email agent. Other teammates handled the phone agent, chatbot, and guardrails. I used Amazon Q to help develop my component."],
      ["Solution","We stored collected university guidance in a shared Amazon S3 bucket. My email workflow interpreted a student's question, retrieved relevant information, and for placement-related requests matched provided details against a synthetic student record to compose a response."],
      ["Result","We demonstrated the integrated concept at the Cal Poly AWS AI Summer Camp and won first place among 15 teams. This was a camp prototype, not a university production system."],
      ["What I learned","This project taught me to separate a large agent workflow into independently owned components and to check that retrieved context and student-specific records actually support the response."],
    ],
    media: [
      { f: "mini-clint-team.jpg", w: 782, h: 1036, alt: "Mini Clint team holding awards at the Cal Poly AWS AI Summer Camp", cap: "Mini Clint team" },
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
      ["Problem","Flavors needed a way to check in a cohort of roughly 160 members. The initial digital wallet API option cost about $50 a month, which was too expensive for the organization."],
      ["My role","I designed and built the member-pass and officer-scanner workflow, including QR-based check-in, meeting management, and the underlying attendance records."],
      ["Solution","I used static HTTPS pages for passes and scanning, Google Sheets as the record of attendance, and Google Apps Script for API endpoints. When a simultaneous opening by many members slowed the app, I reduced polling and unnecessary requests."],
      ["Result","The lower-cost system has worked in subsequent use. I have not yet repeated the full 160-person simultaneous-load test, so that capacity remains unverified. Screenshots show a test account whose old QR credential has been disabled."],
      ["What I learned","A solution has to fit an organization's budget as well as its workflow. I also learned to treat concurrent traffic and request volume as design constraints, not just last-minute performance issues."],
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
      ["Problem","Physics course material was spread across three textbooks and separate chapters, making it harder for students to find relevant explanations and practice."],
      ["My role","During a four-week Chinchilla AI Academy mentorship, I built the study platform and applied the Claude Code and MCP workflows I was learning."],
      ["Solution","I organized the material by textbook and chapter and built practice-question navigation and an AI tutor that could use relevant physics content when responding to questions."],
      ["Result","Book selection, chapter browsing, practice material, and the AI tutor were implemented and working. I considered a student discussion forum but did not ship it because moderation and implementation needs were beyond the scope."],
      ["What I learned","I learned to make dispersed reference material easier to navigate and to prioritize a reliable core learning experience over adding an untested community feature."],
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
      ["Problem","The Harangè team needed a working website based on Figma designs for its Mozilla Festival-related project, while the backend mosaic content was still being developed."],
      ["My role","I built the initial desktop frontend using Next.js, React, Tailwind CSS, and Claude Code. Teammates took responsibility for mobile responsiveness and later integration."],
      ["Solution","I translated the provided designs into working pages and used placeholder mosaic tiles so the frontend could be reviewed before the backend data was ready."],
      ["Result","I delivered the initial desktop experience for the team to continue developing. I did not build the backend or claim the later mobile work as my own."],
      ["What I learned","The project reinforced how to hand off an interface that is useful before every dependency is finished and how to coordinate frontend and backend responsibilities without blocking progress."],
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
      ["Problem","LearningNCo wanted to explore how its English-learning materials, including Sentence Stretching 101, could become approachable digital experiences. The team needed concrete screens and documentation to evaluate the ideas."],
      ["My role","During my Seoul internship, I independently designed a 44-page vocabulary app prototype and collaborated with the team on SS101 concept work and a detailed developer handoff."],
      ["Solution","For vocabulary learning, I designed onboarding, lessons, flashcards, pronunciation exercises, quizzes, and review flows. For SS101, we documented proposed features, user journeys, screen behavior, and technical requirements for developers."],
      ["Result","The work produced a 44-page vocabulary prototype and a collaborative SS101 presentation and 71-page internal handoff. These were product designs and specifications, not a launched production application."],
      ["What I learned","I learned how to turn a broad educational concept into screens and requirements that other people can review, discuss, and implement."],
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
