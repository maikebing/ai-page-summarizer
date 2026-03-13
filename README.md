
# AI 页面总结器（Edge/Chrome 扩展）

[English](#ai-page-summarizer-edgechrome-extension)

> 一键总结网页内容，支持多轮对话。兼容 Gitee AI、DeepSeek、豆包等主流在线模型，以及 Ollama、Docker Desktop AI、KoboldCpp 等本地模型。


## ✨ 主要特性

- 支持 DeepSeek、豆包、Gitee AI 等在线模型总结网页
- 支持 Ollama、Docker Desktop AI、KoboldCpp 等本地模型，无需 API Key
- Ollama/Docker Desktop AI 支持自动拉取和动态切换模型
- 侧边栏对话框，支持多轮追问与上下文理解
- 总结结果与对话均支持 Markdown 渲染
- 一键总结当前页面或右键仅总结选中内容
- 侧边栏一键开启，界面美观简洁
- API Key/本地模型配置自动检测状态
- CORS/权限自动处理，Ollama 本地免配置
- 支持长文本自动截断（最多 15000 字符）



## 🚀 安装指南

1. 克隆本仓库：
   ```bash
   git clone https://github.com/maikebing/ai-page-summarizer.git
   # 或
   git clone https://gitee.com/maikebing/ai-page-summarizer.git
   ```
2. 打开 Edge 或 Chrome，访问：
   - `edge://extensions/` 或 `chrome://extensions/`
3. 开启右上角「开发者模式」
4. 点击「加载已解压的扩展程序」，选择本项目根目录
5. 安装成功后，图标会出现在工具栏，可自定义固定侧边栏



## 🏁 快速上手

1. 点击扩展图标，自动打开侧边栏
2. 首次使用请点击底部「⚙️ 设置」，配置 API Key 或本地模型
3. 选择 AI Provider（DeepSeek/豆包/Gitee AI/Ollama/Docker Desktop AI/KoboldCpp）
4. 点击「🔄 总结当前页面」或右键菜单总结选中内容
5. 等待 AI 返回总结结果（支持 Markdown 格式）
6. 可在底部对话框继续追问，AI 会基于页面内容和历史对话智能回复
7. 可随时切换模型、重新总结



### 各模型说明

#### Ollama 本地模型
- 默认自动拉取 `qwen2.5:7b`（适合总结/翻译）
- 支持模型动态选择、状态检测
- 无需 API Key，直接本地部署
- 支持多轮对话

#### DeepSeek/豆包
- 需在设置页面填写 API Key
- 支持多轮对话、总结、翻译

#### Gitee AI
- 需在设置页面填写 Gitee AI API Key
- 支持 Qwen3-8B 等模型
- 支持多轮对话、总结、翻译

#### Docker Desktop AI
- 默认运行在 `http://localhost:12434`
- 支持模型动态选择、状态检测
- 支持多轮对话、总结、翻译

#### KoboldCpp (本地模型)
- 默认运行在 `http://localhost:5001`
- 支持本地部署、模型切换
- 支持多轮对话、总结、翻译


## 🔑 API Key 获取方式

- **DeepSeek**：[DeepSeek 开放平台](https://platform.deepseek.com/api_keys)
- **豆包（Doubao）**：[火山引擎 Ark 控制台](https://console.volcengine.com/ark)
- **Gitee AI**：
  1. 登录 [Gitee AI 平台](https://ai.gitee.com/)
  2. 注册账号并完成实名认证
  3. 进入「API Key管理」页面，创建并复制你的 API Key
  4. 在扩展设置页面填写该 Key 即可使用

---

## ❓ 常见问题

1. **Ollama 本地模型无法连接？**  
   请确保 Ollama 已启动，且端口未被占用。
2. **API Key 配置后仍不可用？**  
   检查 Key 是否正确、网络是否可访问目标服务。
3. **总结结果不理想？**  
   可尝试切换模型或缩小总结范围。

如有更多问题，欢迎提交 Issue 或 PR 反馈。

---

# AI Page Summarizer (Edge/Chrome Extension)

> Summarize any webpage with one click and continue with multi-turn follow-up questions. Works with mainstream hosted models such as Gitee AI, DeepSeek, and Doubao, as well as local models like Ollama, Docker Desktop AI, and KoboldCpp.

## ✨ Features

- Summarize webpages with hosted models such as DeepSeek, Doubao, and Gitee AI
- Use local models including Ollama, Docker Desktop AI, and KoboldCpp without an API key
- Automatically fetch and switch Ollama/Docker Desktop AI models
- Chat in the side panel with multi-turn context awareness
- Render summaries and chat replies in Markdown
- Summarize the full page or only selected text from the context menu
- One-click side panel workflow with a clean UI
- Auto-check API key and local model configuration status
- Built-in CORS and permission handling for local Ollama usage
- Automatically truncates long page content (up to 15,000 characters)

## 🚀 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/maikebing/ai-page-summarizer.git
   # or
   git clone https://gitee.com/maikebing/ai-page-summarizer.git
   ```
2. Open Edge or Chrome:
   - `edge://extensions/` or `chrome://extensions/`
3. Enable Developer mode
4. Click Load unpacked and select the project root directory
5. After installation, pin the extension to the toolbar if needed

## 🏁 Quick Start

1. Click the extension icon to open the side panel
2. On first use, click `⚙️ Settings` and configure an API key or local model
3. Choose an AI provider (DeepSeek / Doubao / Gitee AI / Ollama / Docker Desktop AI / KoboldCpp)
4. Click `🔄 Summarize current page` or use the context menu to summarize selected text
5. Wait for the AI summary in Markdown format
6. Ask follow-up questions in the chat box at the bottom
7. Switch models and re-run summaries at any time

## Model Notes

### Ollama
- Automatically pulls `qwen2.5:7b` by default
- Supports dynamic model selection and status detection
- No API key required
- Supports multi-turn chat

### DeepSeek / Doubao
- Requires an API key in the settings page
- Supports summaries, translation, and multi-turn chat

### Gitee AI
- Requires a Gitee AI API key in settings
- Supports models such as `Qwen3-8B`
- Supports summaries, translation, and multi-turn chat

### Docker Desktop AI
- Default endpoint: `http://localhost:12434`
- Supports dynamic model selection and status detection
- Supports summaries, translation, and multi-turn chat

### KoboldCpp
- Default endpoint: `http://localhost:5001`
- Supports local deployment and model switching
- Supports summaries, translation, and multi-turn chat

## 🔑 API Key Links

- **DeepSeek**: [DeepSeek Open Platform](https://platform.deepseek.com/api_keys)
- **Doubao**: [Volcengine Ark Console](https://console.volcengine.com/ark)
- **Gitee AI**:
  1. Sign in to [Gitee AI](https://ai.gitee.com/)
  2. Complete account registration and verification
  3. Open the API key management page and create a key
  4. Paste the key into the extension settings page

## ❓ FAQ

1. **Cannot connect to Ollama?**  
   Make sure Ollama is running and the port is available.
2. **API key still does not work after configuration?**  
   Check whether the key is correct and whether the target service is reachable.
3. **Summary quality is not ideal?**  
   Try another model or summarize a smaller content range.

If you have more questions, feel free to open an Issue or PR.
