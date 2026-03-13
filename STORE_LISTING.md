# AI Page Summarizer Store Listing

This file prepares the extension metadata needed for Chrome Web Store or Microsoft Edge Add-ons submission.

## Release status

- Version: 1.1.0
- Package status: Ready to package from this repository
- Blocking item outside the repository: store screenshots are still missing

## Submission checklist

- [x] Manifest version updated to 1.1.0
- [x] Extension icons available: 16 / 32 / 48 / 64 / 128 / 300 / 2048
- [x] README, changelog, and release notes updated
- [x] About tab copy synced across zh_CN, en, ja, ko, ru, zh_TW
- [x] Homepage URL added to manifest
- [ ] Capture store screenshots
- [ ] Upload package and screenshots to the target store console

## Recommended screenshots

The repository does not currently include store screenshots. Capture at least these scenes before submitting:

1. Side panel main view showing provider / mode / model status pills and a completed summary
2. Settings page local models tab with unified card layout
3. Settings page online models tab with provider cards and save area
4. Network diagnostics tab with provider-level status results
5. Summary style tab showing compact / standard / detailed presets

## Short description

### zh-CN

一键总结网页内容，支持在线模型、本地模型、多轮追问与网络诊断。

### en

Summarize webpages with hosted or local AI models, follow-up chat, and built-in diagnostics.

## Long description

### zh-CN

AI 页面总结器是一款面向 Edge 和 Chrome 的网页摘要扩展。它支持对当前页面或选中文本进行总结，并在侧边栏继续多轮追问。扩展兼容 DeepSeek、OpenAI、Gemini、Anthropic、GitHub Copilot、豆包、Gitee AI 等在线 provider，也支持 Ollama、Docker Desktop AI、Foundry Local、KoboldCpp 等本地 provider。

1. 一键总结当前网页或选中文本
2. 侧边栏多轮追问，保留页面上下文
3. 支持本地模型与在线模型切换
4. 设置页内置连接测试、模型刷新、网络诊断和总结风格配置
5. 总结结果与对话内容支持 Markdown 渲染
6. 适合阅读长文、技术文档、新闻页面与知识整理

1.1.0 版本重点重构了设置页布局，补齐网络诊断兜底处理，增加侧边栏快捷配置与模型状态提示，使日常使用和排错都更直接。

### en

AI Page Summarizer is a browser extension for Edge and Chrome that summarizes the current webpage or selected text and lets you continue with follow-up questions in a side panel. It works with hosted providers such as DeepSeek, OpenAI, Gemini, Anthropic, GitHub Copilot, Doubao, and Gitee AI, as well as local providers such as Ollama, Docker Desktop AI, Foundry Local, and KoboldCpp.

1. Summarize the current page or selected text in one click
2. Continue with side-panel follow-up chat while keeping page context
3. Switch between hosted and local providers
4. Use built-in connection tests, model refresh actions, network diagnostics, and summary-style presets
5. Read summaries and chat replies with Markdown rendering
6. Useful for long articles, technical docs, news pages, and research notes

Version 1.1.0 focuses on a unified settings experience, safer diagnostics behavior, and quicker side-panel controls for everyday use.

## Permissions notes

Use this section when a store review asks why the permissions are needed:

- activeTab: read the current page for summarization
- tabs: obtain the active tab URL and title
- scripting: extract page content when summarizing
- storage: save provider, model, and UI preferences
- sidePanel: open and manage the browser side panel experience
- declarativeNetRequest: support extension-side request handling rules
- contextMenus: summarize selected text from the right-click menu
- host_permissions <all_urls>: allow summarization on arbitrary webpages opened by the user

## Packaging command

Create the upload package from the repository root after excluding git metadata and optional local files.

PowerShell example:

```powershell
Compress-Archive -Path .\* -DestinationPath .\ai-page-summarizer-1.1.0.zip -Force
```

If you want a cleaner upload package, exclude `.git`, local editor folders, and any temporary files before compressing.