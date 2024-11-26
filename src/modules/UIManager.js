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
    // 创建主工具栏
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'web-canvas-toolbar';
    this.toolbar.style.display = 'none';
    document.body.appendChild(this.toolbar);

    // 创建右侧工具栏
    this.rightToolbar = document.createElement('div');
    this.rightToolbar.className = 'web-canvas-right-toolbar';
    this.rightToolbar.style.display = 'none';
    
    this.rightToolbar.innerHTML = this.getRightToolbarHTML();
    document.body.appendChild(this.rightToolbar);
    
    this.toolbar.innerHTML = this.getToolbarHTML();
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

  getRightToolbarHTML() {
    return `
      <div class="right-toolbar-group">
        <button class="tool-button" data-tool="select" title="选择工具">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
          </svg>
        </button>
        
        <button class="tool-button" data-tool="shape" title="形状工具">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          </svg>
        </button>
        
        <button class="tool-button" data-tool="text" title="文本工具">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7V4h16v3"></path>
            <path d="M12 4v16"></path>
            <path d="M7 20h10"></path>
          </svg>
        </button>
        
        <button class="tool-button" data-tool="undo" title="撤销">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v6h6"></path>
            <path d="M3 13c0-4.97 4.03-9 9-9a9 9 0 0 1 9 9 9 9 0 0 1-9 9"></path>
          </svg>
        </button>
        
        <button class="tool-button" data-tool="redo" title="重做">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7v6h-6"></path>
            <path d="M21 13c0-4.97-4.03-9-9-9a9 9 0 0 0-9 9 9 9 0 0 0 9 9"></path>
          </svg>
        </button>
        
        <button class="tool-button" data-tool="save" title="保存">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </button>
      </div>
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
    const shapes = [
      {
        name: 'rectangle',
        svg: '<rect x="4" y="4" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"/>'
      },
      {
        name: 'circle',
        svg: '<circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2"/>'
      },
      {
        name: 'triangle',
        svg: '<path d="M16 4 L28 28 L4 28 Z" fill="none" stroke="currentColor" stroke-width="2"/>'
      },
      {
        name: 'arrow',
        svg: '<path d="M4 16 L24 16 M18 8 L24 16 L18 24" fill="none" stroke="currentColor" stroke-width="2"/>'
      },
      {
        name: 'line',
        svg: '<line x1="4" y1="4" x2="28" y2="28" stroke="currentColor" stroke-width="2"/>'
      },
      {
        name: 'text',
        svg: '<text x="8" y="24" font-size="24" fill="currentColor">T</text>'
      }
    ];

    return `
      <div class="shape-grid">
        ${shapes.map(shape => `
          <div class="shape-item" data-shape="${shape.name}">
            <svg width="32" height="32" viewBox="0 0 32 32">
              ${shape.svg}
            </svg>
          </div>
        `).join('')}
      </div>
    `;
  }

  setupEventListeners() {
    this.toggleButton.addEventListener('click', () => this.toggleCanvas());
    
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
    
    this.rightToolbar.addEventListener('click', (e) => {
      const button = e.target.closest('.tool-button');
      if (!button) return;
      
      const tool = button.dataset.tool;
      
      switch(tool) {
        case 'select':
          this.toolManager.setCurrentTool('select');
          break;
        case 'shape':
          this.toggleShapeLibrary();
          break;
        case 'text':
          this.toolManager.setCurrentTool('text');
          break;
        case 'undo':
          this.canvasManager.undo();
          break;
        case 'redo':
          this.canvasManager.redo();
          break;
        case 'save':
          this.canvasManager.saveCanvas();
          break;
      }
      
      this.updateToolbarState();
    });
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

  toggleCanvas() {
    this.isEnabled = !this.isEnabled;
    this.toggleButton.classList.toggle('active');
    this.toolbar.style.display = this.isEnabled ? 'flex' : 'none';
    this.rightToolbar.style.display = this.isEnabled ? 'flex' : 'none';
    this.canvasManager.toggleCanvas(this.isEnabled);
  }

  updateToolbarState() {
    const settings = this.toolManager.getToolSettings();
    
    // 更新所有工具按钮状态
    const toolButtons = document.querySelectorAll('.tool-button');
    toolButtons.forEach(button => {
      const buttonTool = button.dataset.tool;
      button.classList.toggle('active', buttonTool === settings.tool);
    });
  }

  toggleShapeLibrary() {
    if (this.shapeLibrary.style.display === 'none') {
      this.shapeLibrary.style.display = 'block';
      this.toolManager.setCurrentTool('shape');
    } else {
      this.shapeLibrary.style.display = 'none';
    }
  }
}