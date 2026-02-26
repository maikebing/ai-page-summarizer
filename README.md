# AI 页面总结器（Edge/Chrome 扩展）

> 一键总结网页、支持多轮对话，DeepSeek/豆包/Ollama 本地模型全支持。

## ✨ 最新功能

- 🧠 支持 DeepSeek、豆包、Ollama（本地部署）三种 AI 模型
- 🖥️ Ollama 支持自动拉取模型、动态选择、无需 API Key
- 💬 侧边栏底部新增对话框，支持多轮追问（总结后可继续提问）
- 📋 总结结果和对话均支持 Markdown 渲染
- 🔄 一键总结当前页面，自动提取正文
- 🚀 一键打开侧边栏，直接开始总结
- 🔑 API Key/本地模型配置页面，自动检测模型状态
- 🛡️ CORS/权限自动处理，Ollama 本地无需额外配置
- 🌐 支持长文本自动截断（最多 15000 字符）
- 🎨 美观简洁的侧边栏和设置界面


## 🚀 安装方法

1. 克隆本仓库：
   ```bash
   git clone https://github.com/maikebing/ai-page-summarizer.git
   ```
2. 打开 Edge 或 Chrome，访问：
   ```
   edge://extensions/ 或 chrome://extensions/
   ```
3. 开启右上角「开发者模式」
4. 点击「加载解压缩的扩展」，选择本项目根目录
5. 图标出现在工具栏，侧边栏可自定义固定


## 🏁 使用说明

1. 点击扩展图标，侧边栏自动打开
2. 首次使用，点击底部「⚙️ 设置」配置 API Key 或 Ollama 本地模型
3. 选择 AI Provider（DeepSeek/豆包/Ollama）
4. 点击「🔄 总结当前页面」
5. 等待 AI 返回总结结果（支持 Markdown 格式）
6. 可在底部对话框继续追问，AI 会基于页面内容和历史对话智能回复
7. 可随时切换模型、重新总结

### Ollama 本地模型

- 默认自动拉取 `qwen2.5:7b`（适合总结/翻译）
- 支持模型动态选择、状态检测
- 无需 API Key，直接本地部署
- 支持多轮对话

### DeepSeek/豆包

- 需在设置页面填写 API Key
- 支持多轮对话、总结、翻译

## 🔑 API Key 获取

**DeepSeek**：[DeepSeek 开放平台](https://platform.deepseek.com/api_keys)

**豆包（Doubao）**：[火山引擎 Ark 控制台](https://console.volcengine.com/ark)

## 📁 项目结构

```
ai-page-summarizer/
├── manifest.json      # 扩展清单 (Manifest V3)
├── sidepanel.html     # 侧边栏主界面
├── sidepanel.js       # 侧边栏逻辑（总结/对话）
├── styles.css         # 样式文件
├── background.js      # Service Worker（权限/CORS/代理）
├── options.html       # 设置页面 HTML
├── options.js         # 设置页面逻辑
├── icons/
│   ├── icon16.png     # 16x16 图标
│   ├── icon48.png     # 48x48 图标
│   └── icon128.png    # 128x128 图标
└── README.md
```

## 🗺️ 后续计划

- [ ] Ollama 流式输出（Streaming）支持
- [ ] 右键菜单支持，选中文字后直接总结
- [ ] 支持更多 AI Provider（如 OpenAI、Claude 等）
- [ ] 总结/对话历史记录功能

## 📄 License

MIT License

Copyright (c) 2024 maikebing

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.