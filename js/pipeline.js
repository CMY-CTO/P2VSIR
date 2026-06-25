function simulateLatexFormatting(latexText) {
  const titleMatch = latexText.match(/\\title\{(.+?)\}/s);
  const authorMatch = latexText.match(/\\author\{(.+?)\}/s);
  const abstractMatch = latexText.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);

  const sectionRegex = /\\section\{(.+?)\}([\s\S]*?)(?=\\section\{|\\end\{document\}|$)/g;
  const sections = [];
  let match;
  let index = 1;

  while ((match = sectionRegex.exec(latexText)) !== null) {
    sections.push({
      id: `sec_${index}`,
      title: cleanLatex(match[1]),
      content: cleanLatex(match[2]).slice(0, 1200),
      figures: [],
      equations: []
    });
    index += 1;
  }

  return {
    title: titleMatch ? cleanLatex(titleMatch[1]) : "Untitled Paper",
    authors: authorMatch ? [cleanLatex(authorMatch[1])] : [],
    abstract: abstractMatch ? cleanLatex(abstractMatch[1]) : "",
    sections,
    references: [],
    metadata: {
      generated_by: "frontend_simulated_formatter",
      note:
        "This is a browser-side mock output. Replace this function with your real parser or backend API."
    }
  };
}

function simulateOutlineGeneration(paperDict) {
  const chapters = paperDict.sections.slice(0, 5).map((section, index) => {
    return {
      id: `ch_${index + 1}`,
      title: section.title,
      goal: `Explain the key ideas from section: ${section.title}`,
      source_sections: [section.id],
      estimated_time: 30
    };
  });

  if (chapters.length === 0) {
    chapters.push({
      id: "ch_1",
      title: "Paper Overview",
      goal: "Introduce the paper and summarize its main contribution.",
      source_sections: [],
      estimated_time: 45
    });
  }

  return {
    talk_title: paperDict.title || "Generated Talk",
    target_audience: "researchers, students and technical audience",
    duration_seconds: chapters.length * 30,
    chapters,
    metadata: {
      generated_by: "frontend_simulated_llm_outline",
      note:
        "This is a mock LLM output. Replace this function with your real LLM API call."
    }
  };
}

function simulateStoryboardGeneration(paperDict, outline) {
  const slides = outline.chapters.map((chapter, index) => {
    const section = paperDict.sections.find(
      item => item.id === chapter.source_sections[0]
    );

    const content = section ? section.content : chapter.goal;

    return {
      slide_id: `slide_${String(index + 1).padStart(3, "0")}`,
      title: chapter.title,
      visual_type: index === 0 ? "title_bullets" : "content_slide",
      latex: `\\begin{frame}{${escapeLatex(chapter.title)}}\\begin{itemize}\\item ${escapeLatex(
        chapter.goal
      )}\\item ${escapeLatex(content.slice(0, 120))}\\end{itemize}\\end{frame}`,
      narration: `${chapter.title}. ${chapter.goal}. ${content.slice(0, 240)}`,
      duration: chapter.estimated_time || 30,
      cursor: [
        {
          time: 1.0,
          x: 0.28,
          y: 0.42,
          action: "point",
          target: "title"
        },
        {
          time: 5.0,
          x: 0.38,
          y: 0.56,
          action: "highlight",
          target: "main_content"
        }
      ],
      subtitle: [
        {
          start: 0,
          end: 4,
          text: chapter.title
        },
        {
          start: 4,
          end: chapter.estimated_time || 30,
          text: chapter.goal
        }
      ]
    };
  });

  return {
    video_title: outline.talk_title,
    resolution: {
      width: 1920,
      height: 1080
    },
    slides,
    metadata: {
      generated_by: "frontend_simulated_llm_storyboard",
      note:
        "This is a mock storyboard. Replace this function with your real LLM storyboard generation."
    }
  };
}

function simulateSlideImages(storyboard) {
  return storyboard.slides.map((slide, index) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="bg${index}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="60%" stop-color="#312e81"/>
            <stop offset="100%" stop-color="#0891b2"/>
          </linearGradient>
        </defs>
        <rect width="1280" height="720" rx="0" fill="url(#bg${index})"/>
        <circle cx="1090" cy="110" r="160" fill="rgba(255,255,255,0.08)"/>
        <circle cx="170" cy="610" r="220" fill="rgba(255,255,255,0.06)"/>
        <text x="90" y="145" fill="#ffffff" font-size="48" font-weight="700" font-family="Arial, sans-serif">
          ${escapeXml(slide.title)}
        </text>
        <rect x="90" y="205" width="850" height="4" rx="2" fill="#67e8f9"/>
        <text x="90" y="285" fill="#e0f2fe" font-size="28" font-family="Arial, sans-serif">
          ${escapeXml((slide.narration || "").slice(0, 72))}
        </text>
        <text x="90" y="335" fill="#cbd5e1" font-size="24" font-family="Arial, sans-serif">
          ${escapeXml((slide.narration || "").slice(72, 145))}
        </text>
        <text x="90" y="630" fill="#a5b4fc" font-size="22" font-family="Arial, sans-serif">
          ${escapeXml(slide.slide_id)} · ${escapeXml(slide.visual_type)}
        </text>
      </svg>
    `;

    return {
      id: slide.slide_id,
      title: slide.title,
      dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    };
  });
}

function cleanLatex(text) {
  return text
    .replace(/%.*$/gm, "")
    .replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{([^{}]*)\})?/g, "$3")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeLatex(text) {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/_/g, "\\_")
    .replace(/%/g, "\\%")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#");
}

function escapeXml(text) {
  if (!text) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}