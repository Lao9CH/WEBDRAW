export class ToolManager {
  constructor() {
    this.currentTool = 'brush';
    this.currentColor = '#4F46E5';
    this.brushSize = 5;
    this.smoothness = 0.5;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
  }

  setCurrentTool(tool) {
    const validTools = ['brush', 'eraser', 'select', 'shape', 'text'];
    if (validTools.includes(tool)) {
      this.currentTool = tool;
    }
  }

  setColor(color) {
    this.currentColor = color;
  }

  setBrushSize(size) {
    this.brushSize = size;
  }

  setSmoothness(value) {
    this.smoothness = value;
  }

  getToolSettings() {
    return {
      tool: this.currentTool,
      color: this.currentColor,
      size: this.brushSize,
      smoothness: this.smoothness
    };
  }

  // 历史记录管理
  addToHistory(state) {
    // 如果不是在历史记录的最新位置，删除当前位置之后的所有记录
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    // 添加新的状态
    this.history.push(state);
    this.historyIndex++;

    // 如果历史记录超过最大大小，删除最早的记录
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  undo() {
    if (this.canUndo()) {
      this.historyIndex--;
      return this.history[this.historyIndex];
    }
    return null;
  }

  redo() {
    if (this.canRedo()) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    }
    return null;
  }
}