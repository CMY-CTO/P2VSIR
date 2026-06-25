const state = {
  latexText: "",
  paper: null,
  outline: null,
  storyboard: null,
  slideImages: [],
  audioFile: null,
  videoFile: null
};

const els = {
  latexInput: document.getElementById("latexInput"),
  paperDictInput: document.getElementById("paperDictInput"),
  outlineInput: document.getElementById("outlineInput"),
  storyboardInput: document.getElementById("storyboardInput"),
  imagesInput: document.getElementById("imagesInput"),
  audioInput: document.getElementById("audioInput"),
  videoInput: document.getElementById("videoInput"),

  latexFileName: document.getElementById("latexFileName"),
  paperDictFileName: document.getElementById("paperDictFileName"),
  outlineFileName: document.getElementById("outlineFileName"),
  storyboardFileName: document.getElementById("storyboardFileName"),
  imagesFileName: document.getElementById("imagesFileName"),
  audioFileName: document.getElementById("audioFileName"),
  videoFileName: document.getElementById("videoFileName"),

  jsonViewer: document.getElementById("jsonViewer"),
  jsonSelect: document.getElementById("jsonSelect"),
  logViewer: document.getElementById("logViewer"),
  slidePreviewGrid: document.getElementById("slidePreviewGrid"),
  videoPreview: document.getElementById("videoPreview"),
  videoPlaceholder: document.getElementById("videoPlaceholder"),

  runFormatterBtn: document.getElementById("runFormatterBtn"),
  runOutlineBtn: document.getElementById("runOutlineBtn"),
  runStoryboardBtn: document.getElementById("runStoryboardBtn"),
  runSlidesBtn: document.getElementById("runSlidesBtn"),
  runCursorBtn: document.getElementById("runCursorBtn"),
  runVideoBtn: document.getElementById("runVideoBtn"),

  clearBtn: document.getElementById("clearBtn"),
  downloadJsonBtn: document.getElementById("downloadJsonBtn")
};

init();

function init() {
  bindFileInputs();
  bindButtons();
  bindTabs();

  // Load sample data by default so the page has something to show.
  state.paper = SAMPLE_PAPER_DICT;
  state.outline = SAMPLE_OUTLINE;
  state.storyboard = SAMPLE_STORYBOARD;
  state.slideImages = simulateSlideImages(SAMPLE_STORYBOARD);

  setStatus("paper", "ready");
  setStatus("outline", "ready");
  setStatus("storyboard", "ready");
  setStatus("slides", "ready");

  updateJsonViewer();
  renderSlides();
  log("[Demo] Loaded sample data.");
}

function bindFileInputs() {
  els.latexInput.addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;

    els.latexFileName.textContent = file.name;
    state.latexText = await file.text();
    setStatus("latex", "ready");
    log(`[Upload] LaTeX file loaded: ${file.name}`);
  });

  els.paperDictInput.addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;

    const json = await readJsonFile(file);
    state.paper = json;
    els.paperDictFileName.textContent = file.name;
    setStatus("paper", "ready");
    updateJsonViewer("paper");
    log(`[Upload] paper_dict.json loaded: ${file.name}`);
  });

  els.outlineInput.addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;

    const json = await readJsonFile(file);
    state.outline = json;
    els.outlineFileName.textContent = file.name;
    setStatus("outline", "ready");
    updateJsonViewer("outline");
    log(`[Upload] outline.json loaded: ${file.name}`);
  });

  els.storyboardInput.addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;

    const json = await readJsonFile(file);
    state.storyboard = json;
    els.storyboardFileName.textContent = file.name;
    setStatus("storyboard", "ready");
    updateJsonViewer("storyboard");
    log(`[Upload] storyboard.json loaded: ${file.name}`);
  });

  els.imagesInput.addEventListener("change", event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    state.slideImages = files.map((file, index) => {
      return {
        id: `uploaded_image_${index + 1}`,
        title: file.name,
        dataUrl: URL.createObjectURL(file)
      };
    });

    els.imagesFileName.textContent = `${files.length} image(s) selected`;
    setStatus("slides", "ready");
    renderSlides();
    switchTab("slides");
    log(`[Upload] ${files.length} slide image(s) loaded.`);
  });

  els.audioInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    state.audioFile = file;
    els.audioFileName.textContent = file.name;
    setStatus("audio", "ready");
    log(`[Upload] Audio loaded: ${file.name}`);
  });

  els.videoInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    state.videoFile = file;
    els.videoFileName.textContent = file.name;
    setStatus("video", "ready");
    renderVideo(file);
    switchTab("video");
    log(`[Upload] Video loaded: ${file.name}`);
  });
}

function bindButtons() {
  els.runFormatterBtn.addEventListener("click", async () => {
    setStatus("paper", "running");

    await wait(500);

    if (!state.latexText) {
      log("[Warning] No LaTeX uploaded. Using demo LaTeX content.");
      state.latexText = getDemoLatex();
    }

    state.paper = simulateLatexFormatting(state.latexText);
    els.paperDictFileName.textContent = "generated-paper_dict.json";
    setStatus("paper", "ready");
    updateJsonViewer("paper");
    log("[Script] Formatting completed. Generated paper_dict.json.");
  });

  els.runOutlineBtn.addEventListener("click", async () => {
    if (!state.paper) {
      log("[Error] Missing paper_dict.json.");
      return;
    }

    setStatus("outline", "running");
    await wait(700);

    state.outline = simulateOutlineGeneration(state.paper);
    els.outlineFileName.textContent = "generated-outline.json";
    setStatus("outline", "ready");
    updateJsonViewer("outline");
    log("[LLM] Outline generated from paper_dict.json.");
  });

  els.runStoryboardBtn.addEventListener("click", async () => {
    if (!state.paper || !state.outline) {
      log("[Error] Missing paper_dict.json or outline.json.");
      return;
    }

    setStatus("storyboard", "running");
    await wait(900);

    state.storyboard = simulateStoryboardGeneration(state.paper, state.outline);
    els.storyboardFileName.textContent = "generated-storyboard.json";
    setStatus("storyboard", "ready");
    updateJsonViewer("storyboard");
    log("[LLM] Storyboard generated from paper_dict.json + outline.json.");
  });

  els.runSlidesBtn.addEventListener("click", async () => {
    if (!state.storyboard) {
      log("[Error] Missing storyboard.json.");
      return;
    }

    setStatus("slides", "running");
    await wait(800);

    state.slideImages = simulateSlideImages(state.storyboard);
    els.imagesFileName.textContent = `${state.slideImages.length} generated image(s)`;
    setStatus("slides", "ready");
    renderSlides();
    switchTab("slides");
    log("[Script] Generated LaTeX slides and compiled slide images.");
  });

  els.runCursorBtn.addEventListener("click", async () => {
    if (!state.storyboard || state.slideImages.length === 0) {
      log("[Error] Missing storyboard.json or slide images.");
      return;
    }

    setStatus("slides", "running");
    await wait(700);

    setStatus("slides", "ready");
    renderSlides(true);
    switchTab("slides");
    log("[Script] Rendered cursor paths and subtitle overlays on images.");
  });

  els.runVideoBtn.addEventListener("click", async () => {
    if (state.slideImages.length === 0 || !state.audioFile) {
      log("[Warning] Static demo cannot really render video without backend. Please upload final_video.mp4 manually or connect video API.");
      return;
    }

    setStatus("video", "running");
    await wait(1000);

    setStatus("video", "ready");
    log("[Video] In a real system, images + audio would be passed to FFmpeg or backend renderer.");
  });

  els.clearBtn.addEventListener("click", () => {
    els.logViewer.textContent = "[System] Logs cleared.";
    els.jsonViewer.textContent = "请选择或生成 JSON 文件。";
  });

  els.downloadJsonBtn.addEventListener("click", () => {
    const type = els.jsonSelect.value;
    const data = getJsonByType(type);

    if (!data) {
      log(`[Error] No ${type}.json available.`);
      return;
    }

    downloadJson(data, getFileNameByType(type));
  });

  els.jsonSelect.addEventListener("change", () => {
    updateJsonViewer();
  });
}

function bindTabs() {
  document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  document.querySelectorAll(".tab-content").forEach(panel => {
    panel.classList.toggle("active", panel.id === `tab-${tabName}`);
  });
}

function updateJsonViewer(type) {
  if (type) {
    els.jsonSelect.value = type;
  }

  const selected = els.jsonSelect.value;
  const json = getJsonByType(selected);

  if (!json) {
    els.jsonViewer.textContent = `No ${selected}.json available.`;
    return;
  }

  els.jsonViewer.textContent = JSON.stringify(json, null, 2);
  switchTab("json");
}

function renderSlides(withCursorOverlay = false) {
  if (!state.slideImages || state.slideImages.length === 0) {
    els.slidePreviewGrid.innerHTML = `
      <div class="empty-state">
        <span>🖼️</span>
        <p>上传或生成 slide images 后将在这里显示。</p>
      </div>
    `;
    return;
  }

  els.slidePreviewGrid.innerHTML = "";

  state.slideImages.forEach((image, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "slide-wrapper";
    wrapper.style.position = "relative";

    const img = document.createElement("img");
    img.src = image.dataUrl;
    img.alt = image.title || image.id;

    wrapper.appendChild(img);

    if (withCursorOverlay) {
      const cursor = document.createElement("div");
      cursor.textContent = "⌖";
      cursor.style.position = "absolute";
      cursor.style.left = "38%";
      cursor.style.top = "48%";
      cursor.style.fontSize = "34px";
      cursor.style.color = "#facc15";
      cursor.style.textShadow = "0 2px 8px rgba(0,0,0,0.5)";
      wrapper.appendChild(cursor);

      const subtitle = document.createElement("div");
      subtitle.textContent =
        state.storyboard?.slides?.[index]?.subtitle?.[0]?.text ||
        "Generated subtitle overlay";
      subtitle.style.position = "absolute";
      subtitle.style.left = "8%";
      subtitle.style.right = "8%";
      subtitle.style.bottom = "8%";
      subtitle.style.padding = "12px 16px";
      subtitle.style.borderRadius = "12px";
      subtitle.style.background = "rgba(15, 23, 42, 0.78)";
      subtitle.style.color = "white";
      subtitle.style.fontWeight = "700";
      subtitle.style.fontSize = "14px";
      wrapper.appendChild(subtitle);
    }

    els.slidePreviewGrid.appendChild(wrapper);
  });
}

function renderVideo(file) {
  const url = URL.createObjectURL(file);
  els.videoPreview.src = url;
  els.videoPreview.style.display = "block";
  els.videoPlaceholder.style.display = "none";
}

function readJsonFile(file) {
  return file.text().then(text => {
    try {
      return JSON.parse(text);
    } catch (error) {
      log(`[Error] Invalid JSON file: ${file.name}`);
      throw error;
    }
  });
}

function getJsonByType(type) {
  if (type === "paper") return state.paper;
  if (type === "outline") return state.outline;
  if (type === "storyboard") return state.storyboard;
  return null;
}

function getFileNameByType(type) {
  if (type === "paper") return "paper_dict.json";
  if (type === "outline") return "outline.json";
  if (type === "storyboard") return "storyboard.json";
  return "data.json";
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
  log(`[Download] ${filename}`);
}

function setStatus(name, status) {
  const el = document.getElementById(`status-${name}`);
  if (!el) return;

  el.className = `status-badge ${status}`;
  el.textContent =
    status === "ready" ? "Ready" : status === "running" ? "Running" : "Pending";
}

function log(message) {
  const now = new Date().toLocaleTimeString();
  els.logViewer.textContent += `\n[${now}] ${message}`;
  els.logViewer.scrollTop = els.logViewer.scrollHeight;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDemoLatex() {
  return `
\\documentclass{article}
\\title{Learning Visual Explanations from Scientific Documents}
\\author{Alice Zhang and Bob Chen}

\\begin{document}
\\maketitle

\\begin{abstract}
This paper proposes a pipeline that converts scientific LaTeX documents into structured video presentations.
\\end{abstract}

\\section{Introduction}
Scientific papers are dense and difficult to consume. We aim to transform papers into accessible video explanations.

\\section{Method}
Our method parses LaTeX into a document dictionary, generates an outline, creates a storyboard, and renders visual slides.

\\section{Experiments}
We evaluate the system using academic papers from multiple domains.

\\end{document}
  `;
}