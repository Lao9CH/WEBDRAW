import { getStroke } from 'perfect-freehand';

/**
 * 画布管理器类
 * 负责处理画布的创建、绘制和各种绘画功能
 */
export class CanvasManager {
  constructor(toolManager) {
    this.canvas = null;      // 画布元素
    this.ctx = null;         // 画布上下文
    this.tempCanvas = null;  // 临时画布元素
    this.tempCtx = null;     // 临时画布上下文
    this.isDrawing = false;  // 是否正在绘制
    this.points = [];        // 绘制点集合
    this.startPoint = null;  // 起始点
    this.drawingHistory = []; // 绘画历史
    this.toolManager = toolManager; // 工具管理器
    
    this.init();
  }

  /**
   * 初始化画布
   */
  init() {
    this.createCanvas();
    this.createTempCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    // 加载保存的涂鸦
    this.loadDrawings();
  }

  /**
   * 保存当前绘画状态
   */
  saveDrawing() {
    // 获取当前页面URL作为标识
    const pageUrl = window.location.href;
    // 获取画布数据
    const imageData = this.canvas.toDataURL();
    
    // 使用Chrome存储API保存数据
    chrome.storage.local.get('drawings', (result) => {
      const drawings = result.drawings || {};
      drawings[pageUrl] = imageData;
      chrome.storage.local.set({ drawings });
    });
  }

  /**
   * 加载保存的涂鸦
   */
  loadDrawings() {
    const pageUrl = window.location.href;
    
    chrome.storage.local.get('drawings', (result) => {
      const drawings = result.drawings || {};
      const savedDrawing = drawings[pageUrl];
      
      if (savedDrawing) {
        // 创建临时图片加载保存的数据
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0);
        };
        img.src = savedDrawing;
      }
    });
  }

  /**
   * 创建主画布元素
   */
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'web-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.resizeCanvas();
  }

  /**
   * 创建临时画布元素
   */
  createTempCanvas() {
    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.className = 'web-canvas temp';
    this.tempCtx = this.tempCanvas.getContext('2d');
    document.body.appendChild(this.tempCanvas);
    this.resizeCanvas();
  }

  /**
   * 调整画布大小
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.tempCanvas) {
      this.tempCanvas.width = window.innerWidth;
      this.tempCanvas.height = window.innerHeight;
      this.tempCtx.lineCap = 'round';
      this.tempCtx.lineJoin = 'round';
    }
  }

  /**
   * 开始绘制
   */
  startDrawing(x, y) {
    this.isDrawing = true;
    this.points = [];
    this.startPoint = { x, y };
    this.addPoint(x, y);
    
    // 保存当前状态到历史记录
    this.saveToHistory();
  }

  /**
   * 绘制
   */
  draw(x, y, settings) {
    if (!this.isDrawing) return;
    
    const tool = settings.tool;
    
    switch (tool) {
      case 'brush':
      case 'eraser':
        this.drawFreehand(x, y, settings);
        break;
      case 'shape':
        this.drawShapePreview(x, y, settings);
        break;
      case 'text':
        this.drawTextPreview(x, y, settings);
        break;
      case 'select':
        this.updateSelection(x, y);
        break;
    }
  }

  /**
   * 自由绘制
   */
  drawFreehand(x, y, { color, size, tool }) {
    this.addPoint(x, y);
    
    if (this.points.length < 2) return;
    
    const stroke = getStroke(this.points, {
      size: size,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });

    this.ctx.fillStyle = tool === 'eraser' ? '#fff' : color;
    this.ctx.beginPath();
    
    const [first, ...rest] = stroke;
    this.ctx.moveTo(first[0], first[1]);
    
    rest.forEach(point => {
      this.ctx.lineTo(point[0], point[1]);
    });
    
    this.ctx.fill();
  }

  /**
   * 绘制形状预览
   */
  drawShapePreview(x, y, settings) {
    // 清除临时画布
    this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    
    this.tempCtx.strokeStyle = settings.color;
    this.tempCtx.lineWidth = settings.size;
    
    const shape = settings.shape || 'rectangle';
    
    switch (shape) {
      case 'rectangle':
        this.drawRectangle(this.tempCtx, this.startPoint.x, this.startPoint.y, x - this.startPoint.x, y - this.startPoint.y);
        break;
      case 'circle':
        this.drawCircle(this.tempCtx, this.startPoint.x, this.startPoint.y, x, y);
        break;
      case 'line':
        this.drawLine(this.tempCtx, this.startPoint.x, this.startPoint.y, x, y);
        break;
    }
  }

  /**
   * 绘制文本预览
   */
  drawTextPreview(x, y, settings) {
    this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    this.tempCtx.font = `${settings.size}px Arial`;
    this.tempCtx.fillStyle = settings.color;
    this.tempCtx.fillText(settings.text || 'Text', x, y);
  }

  /**
   * 更新选择区域
   */
  updateSelection(x, y) {
    this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    this.tempCtx.strokeStyle = '#4F46E5';
    this.tempCtx.lineWidth = 1;
    this.tempCtx.setLineDash([5, 5]);
    
    const width = x - this.startPoint.x;
    const height = y - this.startPoint.y;
    
    this.tempCtx.strokeRect(this.startPoint.x, this.startPoint.y, width, height);
  }

  /**
   * 停止绘制
   */
  stopDrawing() {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    this.points = [];
    
    // 如果是形状或文本，将临时画布的内容复制到主画布
    const settings = this.toolManager.getToolSettings();
    if (['shape', 'text'].includes(settings.tool)) {
      this.ctx.drawImage(this.tempCanvas, 0, 0);
      this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }
    
    // 保存到历史记录
    this.saveToHistory();
    // 保存到Chrome存储
    this.saveDrawing();
  }

  /**
   * 添加点
   */
  addPoint(x, y) {
    this.points.push([x, y, Date.now()]);
  }

  /**
   * 清除画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    this.saveToHistory();
  }

  /**
   * 保存画布状态到历史记录
   */
  saveToHistory() {
    const state = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.toolManager.addToHistory(state);
  }

  /**
   * 撤销
   */
  undo() {
    const state = this.toolManager.undo();
    if (state) {
      this.ctx.putImageData(state, 0, 0);
    }
  }

  /**
   * 重做
   */
  redo() {
    const state = this.toolManager.redo();
    if (state) {
      this.ctx.putImageData(state, 0, 0);
    }
  }

  /**
   * 保存画布
   */
  saveCanvas() {
    const link = document.createElement('a');
    link.download = 'web-canvas.png';
    link.href = this.canvas.toDataURL();
    link.click();
  }

  /**
   * 显示画布
   */
  show() {
    this.canvas.style.display = 'block';
    this.tempCanvas.style.display = 'block';
  }

  /**
   * 隐藏画布
   */
  hide() {
    this.canvas.style.display = 'none';
    this.tempCanvas.style.display = 'none';
  }

  /**
   * 切换画布显示状态
   */
  toggleCanvas(isEnabled) {
    if (isEnabled) {
      this.show();
    } else {
      this.hide();
    }
  }

  // 绘制基本形状的辅助方法
  drawRectangle(ctx, x, y, width, height) {
    ctx.strokeRect(x, y, width, height);
  }

  drawCircle(ctx, x1, y1, x2, y2) {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}