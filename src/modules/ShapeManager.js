export class ShapeManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.shapes = {
      rectangle: this.drawRectangle.bind(this),
      circle: this.drawCircle.bind(this),
      triangle: this.drawTriangle.bind(this),
      arrow: this.drawArrow.bind(this),
      line: this.drawLine.bind(this)
    };
  }

  drawRectangle(startX, startY, endX, endY, style) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = style.color;
    this.ctx.lineWidth = style.size;
    this.ctx.rect(startX, startY, endX - startX, endY - startY);
    this.ctx.stroke();
  }

  drawCircle(startX, startY, endX, endY, style) {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    this.ctx.beginPath();
    this.ctx.strokeStyle = style.color;
    this.ctx.lineWidth = style.size;
    this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  drawTriangle(startX, startY, endX, endY, style) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = style.color;
    this.ctx.lineWidth = style.size;
    this.ctx.moveTo(startX, endY);
    this.ctx.lineTo((startX + endX) / 2, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawArrow(startX, startY, endX, endY, style) {
    const headLength = 20;
    const angle = Math.atan2(endY - startY, endX - startX);
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = style.color;
    this.ctx.lineWidth = style.size;
    
    // Draw line
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    
    // Draw arrow head
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    
    this.ctx.stroke();
  }

  drawLine(startX, startY, endX, endY, style) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = style.color;
    this.ctx.lineWidth = style.size;
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }

  drawShape(shape, startX, startY, endX, endY, style) {
    if (this.shapes[shape]) {
      this.shapes[shape](startX, startY, endX, endY, style);
    }
  }
}