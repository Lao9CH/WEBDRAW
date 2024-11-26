export class ToolManager {
  constructor() {
    this.currentTool = 'brush';
    this.currentColor = '#4F46E5';
    this.brushSize = 5;
    this.smoothness = 0.5;
  }

  setCurrentTool(tool) {
    this.currentTool = tool;
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
}