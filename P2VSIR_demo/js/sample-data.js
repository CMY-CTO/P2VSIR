const SAMPLE_PAPER_DICT = {
  title: "Example Paper: Learning Visual Explanations from Scientific Documents",
  authors: ["Alice Zhang", "Bob Chen"],
  abstract:
    "This paper proposes a pipeline that converts scientific LaTeX documents into structured video presentations.",
  sections: [
    {
      id: "sec_1",
      title: "Introduction",
      content:
        "Scientific papers are dense and difficult to consume. We aim to transform papers into accessible video explanations.",
      figures: [],
      equations: []
    },
    {
      id: "sec_2",
      title: "Method",
      content:
        "Our method parses LaTeX into a document dictionary, generates an outline, creates a storyboard, and renders visual slides.",
      figures: [
        {
          id: "fig_1",
          caption: "Overview of the LaTeX to video pipeline.",
          path: "figures/pipeline.pdf"
        }
      ],
      equations: [
        {
          id: "eq_1",
          latex: "\\mathcal{V} = f(\\mathcal{D}, \\mathcal{S}, \\mathcal{A})"
        }
      ]
    },
    {
      id: "sec_3",
      title: "Experiments",
      content:
        "We evaluate the system using academic papers from multiple domains.",
      figures: [],
      equations: []
    }
  ],
  references: [
    {
      id: "ref_1",
      title: "Automatic Scientific Document Understanding",
      year: 2024
    }
  ]
};

const SAMPLE_OUTLINE = {
  talk_title: "Turning LaTeX Papers into Videos",
  target_audience: "researchers and students",
  duration_seconds: 180,
  chapters: [
    {
      id: "ch_1",
      title: "Motivation",
      goal: "Explain why paper-to-video conversion is useful.",
      source_sections: ["sec_1"],
      estimated_time: 35
    },
    {
      id: "ch_2",
      title: "Pipeline Overview",
      goal: "Introduce the end-to-end system.",
      source_sections: ["sec_2"],
      estimated_time: 65
    },
    {
      id: "ch_3",
      title: "Results and Demo",
      goal: "Show the generated presentation and video result.",
      source_sections: ["sec_3"],
      estimated_time: 50
    }
  ]
};

const SAMPLE_STORYBOARD = {
  video_title: "Turning LaTeX Papers into Videos",
  resolution: {
    width: 1920,
    height: 1080
  },
  slides: [
    {
      slide_id: "slide_001",
      title: "Why Convert Papers to Videos?",
      visual_type: "title_bullets",
      latex:
        "\\begin{frame}{Why Convert Papers to Videos?}\\begin{itemize}\\item Papers are information dense\\item Videos are easier to consume\\item Structured generation improves scalability\\end{itemize}\\end{frame}",
      narration:
        "Scientific papers are difficult to consume quickly. Our goal is to turn dense LaTeX documents into accessible video explanations.",
      duration: 12,
      cursor: [
        {
          time: 1.0,
          x: 0.32,
          y: 0.42,
          action: "point",
          target: "bullet_1"
        },
        {
          time: 5.2,
          x: 0.36,
          y: 0.52,
          action: "point",
          target: "bullet_2"
        }
      ],
      subtitle: [
        {
          start: 0,
          end: 4,
          text: "Scientific papers are difficult to consume quickly."
        },
        {
          start: 4,
          end: 10,
          text:
            "We transform dense LaTeX documents into accessible video explanations."
        }
      ]
    },
    {
      slide_id: "slide_002",
      title: "Pipeline Overview",
      visual_type: "flow_diagram",
      latex:
        "\\begin{frame}{Pipeline Overview} LaTeX $\\rightarrow$ JSON $\\rightarrow$ Storyboard $\\rightarrow$ Slides $\\rightarrow$ Video \\end{frame}",
      narration:
        "The pipeline starts with LaTeX input, then produces structured JSON, generates a storyboard, renders slides, and finally composes video.",
      duration: 15,
      cursor: [
        {
          time: 2.0,
          x: 0.22,
          y: 0.50,
          action: "highlight",
          target: "latex_input"
        },
        {
          time: 7.0,
          x: 0.70,
          y: 0.50,
          action: "highlight",
          target: "video_output"
        }
      ],
      subtitle: [
        {
          start: 0,
          end: 6,
          text: "The system starts with a LaTeX paper."
        },
        {
          start: 6,
          end: 15,
          text:
            "Then it generates structured JSON, storyboard, slides and a final video."
        }
      ]
    }
  ]
};