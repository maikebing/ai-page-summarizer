# Changelog

All notable changes to this project are documented in this file.

## 1.1.0 - 2026-03-14

### Added

- Added a more complete network diagnostics experience with per-provider progress, status summaries, and safer error fallbacks.
- Added a collapsible quick-settings control in the side panel for provider and summary-style selection.
- Added model-status pills in the side panel header, including availability colors and hover tooltips for long model names.
- Added a dedicated CHANGELOG.md file for version tracking.

### Changed

- Reworked the settings page into a more consistent layout across local models, online models, network diagnostics, summary style, and about content.
- Unified panel headers, actions, spacing, badges, and card shells on the options page.
- Refined the side panel layout, moved the settings entry to the lower-left area, and improved action hierarchy.
- Updated the About tab copy and README to reflect the current product structure and supported providers.

### Fixed

- Fixed uncaught fetch failures in network diagnostics so failed requests now render as diagnostic results instead of interrupting the page flow.
- Fixed KoboldCpp auto-detection and refresh flows so unreachable local endpoints no longer produce uncaught promise errors.
- Fixed duplicate title regions in the summary-style section of the settings page.

## 1.0.0 - Initial Release

### Added

- Initial support for full-page summaries, selected-text summaries, and side-panel follow-up chat.
- Initial support for hosted providers including DeepSeek, Doubao, and Gitee AI.
- Initial support for local providers including Ollama, Docker Desktop AI, and KoboldCpp.
- Markdown rendering for summaries and chat responses.
- Settings page for API keys, local endpoints, and model selection.
