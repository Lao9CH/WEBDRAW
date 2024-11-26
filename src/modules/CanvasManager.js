import { getStroke } from 'perfect-freehand';

/**
 * 画布管理器类
 * 负责处理画布的创建、绘制和各种绘画功能
 */
export class CanvasManager {
  constructor() {
    this.canvas = null;      // 画布元素
    this.ctx = null;         // 画布上下文
    this.isDrawing = false;  // 是否正在绘制
    this.points = [];        // 绘制点集合
    this.drawingMode = 'brush'; // 绘制模式
    this.startPoint = null;  // 起始点
    this.drawingHistory = []; // 绘画历史
    
    this.init();
  }

  /**
   * 初始化画布
   */
  init() {
    this.createCanvas();
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
   * 创建画布元素
   */
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'web-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
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
  }

  /**
   * 开始绘制
   * @param {number} x - 起始点x坐标
   * @param {number} y - 起始点y坐标
   */
  startDrawing(x, y) {
    this.isDrawing = true;
    this.points = [];
    this.startPoint = { x, y };
    this.addPoint(x, y);
  }

  /**
   * 绘制
   * @param {number} x - 当前点x坐标
   * @param {number} y - 当前点y坐标
   * @param {Object} settings - 绘制设置
   */
  draw(x, y, settings) {
    if (!this.isDrawing) return;
    
    if (settings.tool === 'brush' || settings.tool === 'eraser') {
      this.drawFreehand(x, y, settings);
    } else {
      this.drawShapePreview(x, y, settings);
    }
    
    // 每次绘制后保存状态
    this.saveDrawing();
  }

  /**
   * 自由绘制
   * @param {number} x - 当前点x坐标
   * @param {number} y - 当前点y坐标
   * @param {Object} settings - 绘制设置
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
   * @param {number} x - 当前点x坐标
   * @param {number} y - 当前点y坐标
   * @param {Object} settings - 绘制设置
   */
  drawShapePreview(x, y, settings) {
    // 清除之前的预览
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制形状预览
    if (this.startPoint) {
      this.shapeManager.drawShape(
        settings.tool,
        this.startPoint.x,
        this.startPoint.y,
        x,
        y,
        settings
      );
    }
  }

  /**
   * 结束绘制
   */
  stopDrawing() {
    this.isDrawing = false;
    this.startPoint = null;
  }

  /**
   * 添加绘制点
   * @param {number} x - 点x坐标
   * @param {number} y - 点y坐标
   */
  addPoint(x, y) {
    this.points.push([x, y, Date.now()]);
  }

  /**
   * 清除画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 清除后也保存状态
    this.saveDrawing();
  }

  /**
   * 显示画布
   */
  show() {
    this.canvas.style.display = 'block';
  }

  /**
   * 隐藏画布
   */
  hide() {
    this.canvas.style.display = 'none';
  }
}