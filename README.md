# LaTeX2Video Pipeline Demo

一个用于展示 **LaTeX 论文自动转换为视频展示** 的前端项目 Demo。

<img width="1880" height="2560" alt="Hi4D_images_fight23_Camera04_000011 jpg_00_pred_smpl" src="https://github.com/user-attachments/assets/22a5941d-490a-4d78-bd69-4f6d6bab1d9e" />


本项目提供一个可部署到 GitHub Pages 的静态前端页面，用于展示从 LaTeX 输入，到结构化 JSON、演讲大纲、Storyboard、PPT/Slides、图片帧、字幕、音频，最终生成视频的完整流程。

> 当前版本是 **静态前端 Demo**，主要用于项目展示、流程说明和文件预览。  
> LaTeX 解析、LLM 生成、PPT 编译、视频合成等真实计算逻辑需要后续接入后端服务或 API。

<img width="526" height="713" alt="Screenshot 2026-05-25 at 12 38 57" src="https://github.com/user-attachments/assets/a5beb1d1-1158-4712-a5d3-9a0044fe6219" />



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
