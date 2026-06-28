// All copy / data live here so components stay clean
export const PROFILE = {
  name: "RAJAT",
  fullName: "Rajat",
  roles: ["AI / ML Engineer", "Full Stack Builder", "Researcher"],
  tagline: "Engineering intelligence at the edge of language, vision and the web.",
  location: "New Delhi · India",
  coords: "28.6139° N · 77.2090° E",
  email: "rajatyadav5492@gmail.com",
  phone: "+91 9588 770 587",
  github: "rajatyadav2004",
  linkedin: "rajat-bmu",
  availability: "Open to research & engineering collaborations · 2026",
  bio: "B.Tech (CSE — AI / DSA) at BML Munjal University, class of 2027. I build hallucination-aware RAG systems, fine-tune LLMs with PEFT/LoRA, ship full-stack experiences, and prototype IoT × ML hybrids. Currently writing my thesis on Marathi Word Sense Disambiguation under Prof. Satyender.",
};

export const STATS = [
  { value: 7, label: "Shipped projects", suffix: "+" },
  { value: 92, label: "Best mAP", suffix: "%" },
  { value: 25, label: "Runtime gain", suffix: "%" },
  { value: 5, label: "Workshops led", suffix: "" },
];

export const PROJECTS = [
  {
    id: "rag",
    title: "Hallucination-Aware RAG",
    subtitle: "LLM fine-tuning · confidence scoring",
    year: "2026",
    tags: ["Python", "HuggingFace", "LoRA / PEFT", "FAISS", "ChromaDB", "Streamlit"],
    blurb:
      "End-to-end retrieval system with calibrated confidence scoring and dynamic vector ingestion. Fine-tuned GPT-2 on a curated CS Q&A set — lifted BLEU from 0.03 → 0.09 and ROUGE-L by 38%.",
    color: "#00FFF0",
    github: "https://github.com/rajatyadav2004",
    demo: "#",
  },
  {
    id: "marathi",
    title: "Marathi Word Sense Disambiguation",
    subtitle: "Undergraduate thesis · NLP for low-resource Indic",
    year: "2025",
    tags: ["NLP", "Sentence-Transformers", "Sklearn", "Research"],
    blurb:
      "Disambiguating polysemous Marathi tokens with custom preprocessing pipelines, contextual embeddings and classical ML baselines — supervised by Prof. Satyender.",
    color: "#6C00FF",
    github: "https://github.com/rajatyadav2004",
    demo: "#",
  },
  {
    id: "vehicle",
    title: "Vehicle Registration Analytics",
    subtitle: "EDA · clustering · regression on 10K+ records",
    year: "2025",
    tags: ["Pandas", "NumPy", "Seaborn", "K-Means"],
    blurb:
      "Mined 10,000+ Indian vehicle registration records — exposed regional fuel-type migration trends and a 25% runtime gain on the data pipeline.",
    color: "#00FFF0",
    github: "https://github.com/rajatyadav2004",
    demo: "#",
  },
  {
    id: "smartbottle",
    title: "Smart Water Bottle",
    subtitle: "IoT × Android hydration coach",
    year: "2024",
    tags: ["ESP32", "Arduino", "Firebase", "Android"],
    blurb:
      "ESP32-powered hydration sensor streaming to Firebase with an Android companion app — push reminders, analytics dashboards, family sharing.",
    color: "#6C00FF",
    github: "https://github.com/rajatyadav2004",
    demo: "#",
  },
  {
    id: "cityserve",
    title: "City Serve",
    subtitle: "Civic complaints platform for municipalities",
    year: "2024",
    tags: ["Android", "Java", "Firebase"],
    blurb:
      "Lets citizens file geo-tagged complaints with photo evidence; routes to municipal officers with live status tracking, dark mode and profiles.",
    color: "#00FFF0",
    github: "https://github.com/rajatyadav2004",
    demo: "#",
  },
  {
    id: "evault",
    title: "E-Vault",
    subtitle: "Encrypted document vault",
    year: "2025",
    tags: ["Web", "Security", "Auth"],
    blurb:
      "A zero-leak digital vault for sensitive documents with quick-access auth and end-to-end confidentiality.",
    color: "#6C00FF",
    github: "https://github.com/rajatyadav2004",
    demo: "#",
  },
  {
    id: "wallpaper-ocean",
    title: "Wallpaper Ocean",
    subtitle: "Full-stack wallpaper gallery · React + Vite",
    year: "2024",
    tags: ["React", "TypeScript", "Vite", "Tailwind", "Wouter"],
    blurb:
      "A free, fast wallpaper gallery with category browsing, lightbox viewer, favorites, and one-click downloads. Deployed on Vercel with responsive design across mobile, tablet and desktop.",
    color: "#00FFF0",
    github: "https://github.com/rajatyadav2004/wallpaper-ocean",
    demo: "https://wallpaper-ocean.vercel.app/wallpaper-ocean/",
  },
];

export const STACK = {
  "AI / ML": ["PyTorch", "TensorFlow", "HuggingFace", "LangChain", "LoRA / PEFT", "Sentence-Transformers", "OpenCV"],
  "RAG / Vector": ["FAISS", "ChromaDB", "LlamaIndex", "Prompt-Eng"],
  "Frontend": ["React", "Three.js", "GSAP", "Tailwind", "Streamlit"],
  "Backend": ["FastAPI", "Node.js", "Express", "REST"],
  "Data / DB": ["Pandas", "NumPy", "MongoDB", "MySQL", "Firebase"],
  "DevOps / Tools": ["Git", "Linux", "Arduino / ESP32", "Unity"],
};

export const TIMELINE = [
  { date: "Aug 2025 — Dec 2025", title: "Thesis · Marathi WSD", body: "Research under Prof. Satyender — preprocessing, embedding, ML baselines for Marathi polysemy.", side: "left" },
  { date: "Jan 2026 — May 2026", title: "Hallucination-Aware RAG", body: "Confidence-scored RAG with dynamic ingestion; fine-tuned GPT-2 — BLEU 0.03 → 0.09.", side: "right" },
  { date: "Jan 2025 — May 2025", title: "Vehicle Registration Analytics", body: "EDA + clustering on 10K+ records · 25% pipeline speed-up.", side: "left" },
  { date: "Aug 2024 — Dec 2024", title: "Smart Water Bottle (IoT)", body: "ESP32 + Firebase + Android — hydration analytics for households.", side: "right" },
  { date: "Jan 2024 — May 2024", title: "City Serve · Android", body: "Civic complaints platform with photo + geotag uploads.", side: "left" },
  { date: "Aug 2023 — Dec 2023", title: "Wallpaper Ocean", body: "Visual-search wallpaper platform · 92% mAP, 25% faster runtime.", side: "right" },
  { date: "2023 — 2027", title: "B.Tech CSE · AI / DSA", body: "BML Munjal University.", side: "left" },
];
