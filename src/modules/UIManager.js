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
    this.toolbar.className = 'web-canvas-toolbar collapsed';
    
    // 创建展开按钮（同时作为折叠按钮）
    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-button';
    toggleButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
      <circle cx="11" cy="11" r="2"></circle>
    </svg>`;
    
    const toolbarContent = document.createElement('div');
    toolbarContent.className = 'toolbar-content';
    toolbarContent.innerHTML = this.getToolbarHTML();
    
    this.toolbar.appendChild(toggleButton);
    this.toolbar.appendChild(toolbarContent);
    document.body.appendChild(this.toolbar);
    
    // 添加拖动功能
    this.setupDraggable(this.toolbar);
    
    // 添加展开/折叠功能
    let isExpanded = false;
    const toggleToolbar = (e) => {
      if (this.isDragging) return;
      isExpanded = !isExpanded;
      this.toolbar.classList.toggle('collapsed', !isExpanded);
      
      // 更新按钮图标
      if (isExpanded) {
        toggleButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>`;
        toggleButton.style.color = '#666'; // 展开时使用深色图标
      } else {
        toggleButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>`;
        toggleButton.style.color = 'white'; // 折叠时使用白色图标
      }
      e.stopPropagation(); // 阻止事件冒泡
    };

    // 为按钮添加点击事件
    toggleButton.addEventListener('click', toggleToolbar);
    
    // 为折叠状态下的工具栏添加点击事件
    this.toolbar.addEventListener('click', (e) => {
      if (!isExpanded && e.target === this.toolbar) {
        toggleToolbar(e);
      }
    });
  }

  setupDraggable(element) {
    let startX = 0, startY = 0;
    let lastX = 0, lastY = 0;
    this.isDragging = false;
    const moveThreshold = 1; // 降低移动阈值，使拖动更灵敏
    
    const dragMouseDown = (e) => {
      if (e.button !== 0) return; // 只响应左键
      e.preventDefault();
      e.stopPropagation();
      
      // 记录初始位置
      startX = e.clientX;
      startY = e.clientY;
      lastX = element.offsetLeft;
      lastY = element.offsetTop;
      
      this.isDragging = false;
      
      document.addEventListener('mousemove', elementDrag, { passive: false });
      document.addEventListener('mouseup', closeDragElement);
    };

    const elementDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      requestAnimationFrame(() => {
        // 计算移动距离
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // 如果移动距离大于阈值，设置拖动状态
        if (Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold) {
          this.isDragging = true;
          element.style.left = (lastX + dx) + 'px';
          element.style.top = (lastY + dy) + 'px';
        }
      });
    };

    const closeDragElement = () => {
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDragElement);
      
      // 短暂延时后重置拖动状态
      setTimeout(() => {
        this.isDragging = false;
      }, 10);
    };

    element.addEventListener('mousedown', dragMouseDown);
  }

  getToolbarHTML() {
    return `
      <div class="tool-group">
        <a href="http://192.168.6.89" target="_blank" class="tool-button link-button" title="访问服务器">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 5h14M5 12h14M5 19h14"/>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </a>
        <button class="tool-button active" data-tool="brush">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          </svg>
        </button>
        <button class="tool-button" data-tool="eraser">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 20H7L3 16c-1.5-1.5-1.5-3.5 0-5L14 0l7 7-11 11 3 3-1-1h8v-1"/>
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