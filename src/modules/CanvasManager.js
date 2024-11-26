import { getStroke } from 'perfect-freehand';

export class CanvasManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.points = [];
    this.drawingMode = 'brush';
    this.startPoint = null;
    
    this.init();
  }

  init() {
    this.createCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'web-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    this.points = [];
    this.startPoint = { x, y };
    this.addPoint(x, y);
  }

  draw(x, y, settings) {
    if (!this.isDrawing) return;
    
    if (settings.tool === 'brush' || settings.tool === 'eraser') {
      this.drawFreehand(x, y, settings);
    } else {
      this.drawShapePreview(x, y, settings);
    }
  }

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

  drawShapePreview(x, y, settings) {
    // Clear the previous preview
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw the shape preview
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

  stopDrawing() {
    this.isDrawing = false;
    this.startPoint = null;
  }

  addPoint(x, y) {
    this.points.push([x, y, Date.now()]);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  show() {
    this.canvas.style.display = 'block';
  }

  hide() {
    this.canvas.style.display = 'none';
  }
}