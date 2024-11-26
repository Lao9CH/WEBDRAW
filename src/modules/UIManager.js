export class UIManager {
  constructor(canvasManager, toolManager) {
    this.canvasManager = canvasManager;
    this.toolManager = toolManager;
    this.isEnabled = false;
  }

  createUI() {
    this.createToggleButton();
    this.createToolbar();
    this.createShapeLibrary();
    this.setupEventListeners();
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'web-canvas-toggle';
    button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
      <path d="M2 2l7.586 7.586"></path>
      <circle cx="11" cy="11" r="2"></circle>
    </svg>`;
    
    const container = document.createElement('div');
    container.className = 'web-canvas-container';
    container.appendChild(button);
    document.body.appendChild(container);
    
    this.toggleButton = button;
  }

  createToolbar() {
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'web-canvas-toolbar';
    this.toolbar.style.display = 'none';
    
    this.toolbar.innerHTML = this.getToolbarHTML();
    document.body.appendChild(this.toolbar);
  }

  getToolbarHTML() {
    return `
      <div class="tool-group">
        <button class="tool-button active" data-tool="brush">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          </svg>
        </button>
        <button class="tool-button" data-tool="eraser">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 20H7L3 16l8-8 8 8-4 4"></path>
          </svg>
        </button>
      </div>
      
      <div class="color-picker">
        <div class="color-option" style="background: #4F46E5" data-color="#4F46E5"></div>
        <div class="color-option" style="background: #DC2626" data-color="#DC2626"></div>
        <div class="color-option" style="background: #16A34A" data-color="#16A34A"></div>
        <div class="color-option" style="background: #000000" data-color="#000000"></div>
      </div>
      
      <div class="slider-control">
        <span>Size:</span>
        <input type="range" min="1" max="50" value="5" class="brush-size">
      </div>
      
      <div class="slider-control">
        <span>Smooth:</span>
        <input type="range" min="0" max="100" value="50" class="smoothness">
      </div>
      
      <button class="tool-button" data-action="clear">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    `;
  }

  createShapeLibrary() {
    const library = document.createElement('div');
    library.className = 'shape-library';
    library.style.display = 'none';
    library.innerHTML = this.getShapeLibraryHTML();
    document.body.appendChild(library);
    this.shapeLibrary = library;
  }

  getShapeLibraryHTML() {
    const shapes = ['rectangle', 'circle', 'triangle', 'star', 'arrow', 'line'];
    return `
      <div class="shape-grid">
        ${shapes.map(shape => `
          <div class="shape-item" data-shape="${shape}">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <!-- Shape SVG paths would go here -->
            </svg>
          </div>
        `).join('')}
      </div>
    `;
  }

  setupEventListeners() {
    this.toggleButton.addEventListener('click', () => this.toggleDrawingMode());
    
    this.canvasManager.canvas.addEventListener('mousedown', (e) => {
      this.canvasManager.startDrawing(e.clientX, e.clientY);
    });
    
    this.canvasManager.canvas.addEventListener('mousemove', (e) => {
      this.canvasManager.draw(e.clientX, e.clientY, this.toolManager.getToolSettings());
    });
    
    this.canvasManager.canvas.addEventListener('mouseup', () => {
      this.canvasManager.stopDrawing();
    });
    
    this.canvasManager.canvas.addEventListener('mouseout', () => {
      this.canvasManager.stopDrawing();
    });
    
    this.setupToolbarListeners();
  }

  setupToolbarListeners() {
    this.toolbar.addEventListener('click', (e) => {
      const toolButton = e.target.closest('.tool-button');
      if (toolButton) {
        const tool = toolButton.dataset.tool;
        if (tool) {
          this.toolManager.setCurrentTool(tool);
          this.toolbar.querySelectorAll('.tool-button').forEach(btn => 
            btn.classList.toggle('active', btn === toolButton)
          );
        }
        
        const action = toolButton.dataset.action;
        if (action === 'clear') {
          this.canvasManager.clear();
        }
      }
    });
    
    this.toolbar.querySelectorAll('.color-option').forEach(option => {
      option.addEventListener('click', () => {
        const color = option.dataset.color;
        this.toolManager.setColor(color);
        this.toolbar.querySelectorAll('.color-option').forEach(opt => 
          opt.style.border = opt === option ? '2px solid #4F46E5' : '2px solid white'
        );
      });
    });
    
    const brushSizeSlider = this.toolbar.querySelector('.brush-size');
    brushSizeSlider.addEventListener('input', (e) => {
      this.toolManager.setBrushSize(parseInt(e.target.value));
    });
    
    const smoothnessSlider = this.toolbar.querySelector('.smoothness');
    smoothnessSlider.addEventListener('input', (e) => {
      this.toolManager.setSmoothness(parseInt(e.target.value) / 100);
    });
  }

  toggleDrawingMode() {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.canvasManager.show();
      this.toolbar.style.display = 'flex';
      this.shapeLibrary.style.display = 'block';
    } else {
      this.canvasManager.hide();
      this.toolbar.style.display = 'none';
      this.shapeLibrary.style.display = 'none';
    }
    this.toggleButton.classList.toggle('active');
  }
}