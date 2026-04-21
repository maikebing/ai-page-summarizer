/**
 * 历史记录管理模块
 * 使用 chrome.storage.local 存储总结历史
 */

const HISTORY_STORAGE_KEY = "ai_page_summarizer_history";
const MAX_HISTORY_ITEMS = 100;

/**
 * 历史记录项结构
 * {
 *   id: string,           // 唯一标识符 (时间戳 + 随机数)
 *   title: string,        // 网页标题
 *   url: string,          // 网页 URL
 *   summary: string,      // 总结内容 (纯文本)
 *   summaryHtml: string,  // 总结内容 (HTML格式)
 *   pageContent: string,  // 原始页面内容 (用于重新总结)
 *   createdAt: number,    // 创建时间戳
 *   provider: string      // 使用的 AI 模型
 * }
 */

const HistoryManager = {
  /**
   * 获取所有历史记录
   * @returns {Promise<Array>} 历史记录数组，按时间倒序排列
   */
  async getAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get([HISTORY_STORAGE_KEY], (data) => {
        const history = data[HISTORY_STORAGE_KEY] || [];
        history.sort((a, b) => b.createdAt - a.createdAt);
        resolve(history);
      });
    });
  },

  /**
   * 根据 ID 获取单条记录
   * @param {string} id - 记录 ID
   * @returns {Promise<Object|null>} 记录对象或 null
   */
  async getById(id) {
    const history = await this.getAll();
    return history.find((item) => item.id === id) || null;
  },

  /**
   * 添加新的历史记录
   * @param {Object} item - 记录对象 (不需要包含 id 和 createdAt)
   * @returns {Promise<Object>} 新添加的记录 (包含 id 和 createdAt)
   */
  async add(item) {
    const history = await this.getAll();
    const newItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: item.title || "未获取标题",
      url: item.url || "",
      summary: item.summary || "",
      summaryHtml: item.summaryHtml || "",
      pageContent: item.pageContent || "",
      createdAt: Date.now(),
      provider: item.provider || "unknown",
    };

    history.unshift(newItem);

    if (history.length > MAX_HISTORY_ITEMS) {
      history.splice(MAX_HISTORY_ITEMS);
    }

    await this.save(history);
    return newItem;
  },

  /**
   * 更新现有记录
   * @param {string} id - 记录 ID
   * @param {Object} updates - 要更新的字段
   * @returns {Promise<Object|null>} 更新后的记录或 null
   */
  async update(id, updates) {
    const history = await this.getAll();
    const index = history.findIndex((item) => item.id === id);
    if (index === -1) return null;

    history[index] = {
      ...history[index],
      ...updates,
      updatedAt: Date.now(),
    };

    await this.save(history);
    return history[index];
  },

  /**
   * 删除单条记录
   * @param {string} id - 记录 ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  async delete(id) {
    const history = await this.getAll();
    const index = history.findIndex((item) => item.id === id);
    if (index === -1) return false;

    history.splice(index, 1);
    await this.save(history);
    return true;
  },

  /**
   * 清空所有历史记录
   * @returns {Promise<void>}
   */
  async clearAll() {
    return new Promise((resolve) => {
      chrome.storage.local.remove([HISTORY_STORAGE_KEY], resolve);
    });
  },

  /**
   * 保存历史记录到存储
   * @param {Array} history - 历史记录数组
   * @returns {Promise<void>}
   */
  async save(history) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: history }, resolve);
    });
  },

  /**
   * 获取历史记录数量
   * @returns {Promise<number>}
   */
  async count() {
    const history = await this.getAll();
    return history.length;
  },

  /**
   * 格式化时间戳为可读字符串
   * @param {number} timestamp - 时间戳
   * @returns {string} 格式化后的时间字符串
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;

    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /**
   * 截断文本用于预览
   * @param {string} text - 原始文本
   * @param {number} maxLength - 最大长度
   * @returns {string} 截断后的文本
   */
  truncateForPreview(text, maxLength = 100) {
    if (!text) return "";
    const plainText = text
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  },
};
