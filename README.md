
# AI 页面总结器（Edge/Chrome 扩展）

[English](#ai-page-summarizer-edgechrome-extension)

> 一键总结网页内容，支持多轮对话。兼容主流在线模型和本地模型，并提供统一设置、网络诊断与侧边栏快捷配置能力。

## 🆕 版本更新

- 当前版本：`1.1.0`
- 发布日期：`2026-03-14`
- 历史版本说明：见 [CHANGELOG.md](CHANGELOG.md)

### 1.1.0 重点更新

- 设置页统一为本地模型、在线模型、网络诊断、总结风格和关于五类内容，标题区和卡片布局整体重构
- 网络诊断补齐逐项状态反馈、失败兜底和本地 provider 优先检查，减少未捕获请求异常
- 侧边栏加入折叠式快捷配置、模型状态胶囊、可用性配色和更清晰的操作层次
- 关于页、README 和版本记录同步更新，方便查看当前发布内容

### 1.0.0 初始版本

- 提供网页全文总结、选中文本总结、侧边栏多轮追问与 Markdown 渲染能力
- 支持本地与在线模型的基础配置和切换

## ✨ 主要特性

- 支持 DeepSeek、OpenAI、Gemini、Anthropic、GitHub Copilot、豆包、Gitee AI 等在线模型总结网页
- 支持 Ollama、Docker Desktop AI、Foundry Local、KoboldCpp 等本地模型，无需 API Key
- 设置页内置连接测试、模型刷新、网络诊断、总结风格和关于说明
- 侧边栏支持折叠式快捷配置、模型状态提示和多轮上下文追问
- 总结结果与对话均支持 Markdown 渲染
- 一键总结当前页面或右键仅总结选中内容
- 支持长文本自动截断（最多 15000 字符）

## 🚀 安装指南

1.  打开微软Edge在线商店 的[AI 页面总结器 ]([https://platform.deepseek.com/api_keys](https://microsoftedge.microsoft.com/addons/detail/kebnpdbgakknaffddedhkpkgalggodpi)) 页面，点击右边获取， 后续使用请参考快速上手章节。 
2.  如果要使用开发版本， 请克隆本仓库：
   ```bash
   git clone https://github.com/maikebing/ai-page-summarizer.git
   # 或
   git clone https://gitee.com/maikebing/ai-page-summarizer.git
   ```
3. 打开 Edge 或 Chrome，访问：
   - `edge://extensions/` 或 `chrome://extensions/`
4. 开启右上角「开发者模式」
5. 点击「加载已解压的扩展程序」，选择本项目根目录
6. 安装成功后，图标会出现在工具栏，可自定义固定侧边栏

## 🏁 快速上手

1. 点击扩展图标，自动打开侧边栏
2. 首次使用请点击底部「⚙️ 设置」，配置 API Key 或本地模型
3. 选择 AI Provider（DeepSeek / OpenAI / Gemini / Anthropic / GitHub Copilot / 豆包 / Gitee AI / Ollama / Docker Desktop AI / Foundry Local / KoboldCpp）
4. 点击「🔄 总结当前页面」或右键菜单总结选中内容
5. 等待 AI 返回总结结果（支持 Markdown 格式）
6. 可在底部对话框继续追问，AI 会基于页面内容和历史对话智能回复
7. 可通过侧边栏右侧快捷开关展开或折叠模型与总结风格配置

## 各模型说明

### Ollama 本地模型

- 默认自动拉取 `qwen2.5:7b`
- 支持模型动态选择、状态检测
- 无需 API Key，适合本地部署

### OpenAI / DeepSeek / Gemini / Anthropic / GitHub Copilot / 豆包 / Gitee AI

- 需在设置页面填写 API Key 或访问令牌
- 支持多轮对话、总结与翻译场景
- 可在设置页直接测试连接并切换模型

### Docker Desktop AI

- 默认运行在 `http://localhost:12434`
- 支持模型动态选择、状态检测

### Foundry Local

- 默认运行在 `http://127.0.0.1:55928/`
- 支持本地模型列表刷新与快速切换

### KoboldCpp

- 默认运行在 `http://localhost:5001`
- 支持本地部署、模型切换与状态检测

## 🔑 API Key 获取方式

- **DeepSeek**：[DeepSeek 开放平台](https://platform.deepseek.com/api_keys)
- **OpenAI**：[OpenAI API Keys](https://platform.openai.com/api-keys)
- **Gemini**：[Google AI Studio](https://aistudio.google.com/app/apikey)
- **Anthropic**：[Anthropic Console](https://console.anthropic.com/)
- **豆包（Doubao）**：[火山引擎 Ark 控制台](https://console.volcengine.com/ark)
- **Gitee AI**：
  1. 登录 [Gitee AI 平台](https://ai.gitee.com/)
  2. 完成账号注册与实名认证
  3. 进入 API Key 管理页面创建并复制 Key
  4. 在扩展设置页面填入即可使用

## ❓ 常见问题

1. **本地模型无法连接？**
   请先确认本地服务已经启动，并检查对应端口是否可访问。
2. **API Key 配置后仍不可用？**
   检查 Key 是否正确、模型名是否有效，以及网络是否可访问目标服务。
3. **设置页出现连接异常？**
   建议先打开「网络诊断」逐项检查 provider 连通性，再查看对应卡片状态提示。
4. **总结结果不理想？**
   可尝试切换模型、切换总结风格或缩小总结范围。

如有更多问题，欢迎提交 Issue 或 PR 反馈。

---

# AI Page Summarizer (Edge/Chrome Extension)

> Summarize webpages with one click, continue with multi-turn chat, and switch between hosted and local providers through a unified settings experience.

## 🆕 Release Notes

- Current version: `1.1.0`
- Release date: `2026-03-14`
- Version history: see [CHANGELOG.md](CHANGELOG.md)

### Highlights in 1.1.0

- Reworked the settings page into a clearer experience for local models, online models, network diagnostics, summary style, and about content
- Added stronger diagnostics feedback and safer error fallbacks so failed requests do not surface as uncaught page errors
- Refined the side panel with collapsible quick settings, model-status pills, and clearer action placement
- Updated the about tab, README, and version history to match the current release

### Initial release 1.0.0

- Introduced webpage summaries, selected-text summaries, multi-turn side-panel chat, and Markdown rendering
- Added the first unified setup flow for both hosted and local providers

## ✨ Features

- Works with hosted providers such as DeepSeek, OpenAI, Gemini, Anthropic, GitHub Copilot, Doubao, and Gitee AI
- Works with local providers such as Ollama, Docker Desktop AI, Foundry Local, and KoboldCpp
- Includes connection tests, model refresh actions, network diagnostics, summary-style controls, and an about tab
- Supports collapsible quick settings and model availability indicators in the side panel
- Renders summaries and chat replies in Markdown
- Summarizes the full page or selected text from the context menu
- Automatically truncates long page content up to 15,000 characters

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
3. Choose a provider (DeepSeek / OpenAI / Gemini / Anthropic / GitHub Copilot / Doubao / Gitee AI / Ollama / Docker Desktop AI / Foundry Local / KoboldCpp)
4. Click `🔄 Summarize current page` or use the context menu to summarize selected text
5. Review the Markdown summary and continue with follow-up questions in chat
6. Expand the quick-settings toggle in the side panel whenever you need to switch the provider or summary style

## Provider Notes

### Ollama

- Automatically pulls `qwen2.5:7b` by default
- Supports dynamic model selection and status detection
- No API key required

### Hosted providers

- OpenAI, DeepSeek, Gemini, Anthropic, GitHub Copilot, Doubao, and Gitee AI require valid credentials
- Settings include direct connection tests and model switching

### Docker Desktop AI

- Default endpoint: `http://localhost:12434`
- Supports dynamic model selection and local status detection

### Foundry Local

- Default endpoint: `http://127.0.0.1:55928/`
- Supports local model refresh and quick switching

### KoboldCpp

- Default endpoint: `http://localhost:5001`
- Supports local deployment, model switching, and endpoint checks

## 🔑 API Key Links

- **DeepSeek**: [DeepSeek Open Platform](https://platform.deepseek.com/api_keys)
- **OpenAI**: [OpenAI API Keys](https://platform.openai.com/api-keys)
- **Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Anthropic**: [Anthropic Console](https://console.anthropic.com/)
- **Doubao**: [Volcengine Ark Console](https://console.volcengine.com/ark)
- **Gitee AI**:
  1. Sign in to [Gitee AI](https://ai.gitee.com/)
  2. Complete registration and verification
  3. Create an API key
  4. Paste it into the extension settings page

## ❓ FAQ

1. **A local model cannot be reached?**
   Make sure the local service is running and that the configured endpoint is correct.
2. **A credential still does not work after configuration?**
   Check the token, the model name, and network access to the target service.
3. **The settings page shows a connection error?**
   Open Network diagnostics first and review the provider-specific status messages.
4. **Summary quality is not ideal?**
   Try another model, another summary style, or a smaller content range.

If you have more questions, feel free to open an Issue or PR.
