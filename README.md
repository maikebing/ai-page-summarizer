# AI 页面总结器 - Edge 浏览器扩展

一款基于 Manifest V3 的 Microsoft Edge 浏览器扩展，支持一键使用 **DeepSeek** 或 **豆包（Doubao）** AI 总结当前网页内容。

## ✨ 功能特性

- 🤖 支持 DeepSeek（V3 / R1）和豆包（Doubao）两种 AI 模型
- ⚡ 一键总结当前标签页内容
- 📋 支持一键复制总结结果
- 🔑 安全地在本地存储 API Key（使用 `chrome.storage.sync`）
- 🎨 简洁美观的弹出窗口界面
- 🌐 支持长文本自动截断（最多 15000 字符）

## 📸 截图

> _截图占位：安装后可在此处添加扩展弹出窗口和设置页面的截图_

## 🚀 安装步骤

1. 下载或克隆本仓库到本地：
   ```bash
   git clone https://github.com/maikebing/ai-page-summarizer.git
   ```
2. 打开 Microsoft Edge 浏览器，在地址栏输入：
   ```
   edge://extensions/
   ```
3. 开启右上角的 **开发者模式**
4. 点击 **加载解压缩的扩展**，选择本仓库的根目录
5. 扩展即可出现在工具栏中

> **注意**：`icons/` 目录下需要放置 `icon16.png`、`icon48.png`、`icon128.png` 三个图标文件，否则扩展图标将无法显示。可使用任意图像工具生成对应尺寸的 PNG 图标。

## 📖 使用方法

1. 点击工具栏中的扩展图标，打开弹出窗口
2. 首次使用，点击底部 **⚙️ 设置 API Key** 进入设置页面，配置 API Key
3. 在弹出窗口中选择 AI 模型（DeepSeek 或 豆包）
4. 点击 **✨ 一键总结当前页面** 按钮
5. 等待 AI 返回总结结果
6. 可点击 **📋 复制** 按钮复制结果

## 🔑 API Key 获取说明

### DeepSeek

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys)
2. 注册/登录账号后，创建 API Key
3. 将 API Key 填入扩展设置页面

### 豆包（Doubao）

1. 访问 [火山引擎 Ark 控制台](https://console.volcengine.com/ark)
2. 注册/登录火山引擎账号，开通 Ark 服务
3. 创建 API Key 并（可选）创建推理接入点
4. 将 API Key 及模型名称/接入点 ID 填入扩展设置页面

## 📁 项目结构

```
ai-page-summarizer/
├── manifest.json      # 扩展清单 (Manifest V3)
├── popup.html         # 弹出窗口 HTML
├── popup.js           # 弹出窗口逻辑
├── styles.css         # 样式文件
├── background.js      # Service Worker
├── options.html       # 设置页面 HTML
├── options.js         # 设置页面逻辑
├── icons/
│   ├── icon16.png     # 16x16 图标
│   ├── icon48.png     # 48x48 图标
│   └── icon128.png    # 128x128 图标
└── README.md
```

## 🗺️ 后续计划

- [ ] 流式输出（Streaming）支持，实时展示总结进度
- [ ] Markdown 渲染，美化总结结果显示
- [ ] 右键菜单支持，选中文字后直接总结
- [ ] 支持更多 AI 模型（如 OpenAI、Claude 等）
- [ ] 历史记录功能，保存近期总结结果

## 📄 License

MIT License

Copyright (c) 2024 maikebing

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.