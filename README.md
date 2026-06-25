# LaTeX2Video Pipeline Demo

## API 
`https://cmy-cto.github.io/P2VSIR/`

一个用于展示 **LaTeX 论文自动转换为视频展示** 的前端项目 Demo。




本项目提供一个可部署到 GitHub Pages 的静态前端页面，用于展示从 LaTeX 输入，到结构化 JSON、演讲大纲、Storyboard、PPT/Slides、图片帧、字幕、音频，最终生成视频的完整流程。

> 当前版本是 **静态前端 Demo**，主要用于项目展示、流程说明和文件预览。  
> LaTeX 解析、LLM 生成、PPT 编译、视频合成等真实计算逻辑需要后续接入后端服务或 API。





---

## 项目流程

整体 pipeline 如下：

```text
LaTeX Input
  ↓
Formatting Script
  ↓
paper_dict.json
  ↓
LLM
  ↓
outline.json
  ↓
LLM
  ↓
storyboard.json
  ↓
Script
  ↓
LaTeX Slides / PPT / Images
  ↓
Cursor + Subtitle Rendering
  ↓
Images + Audio
  ↓
Final Video
