import { CanvasManager } from '../modules/CanvasManager';
import { UIManager } from '../modules/UIManager';
import { ToolManager } from '../modules/ToolManager';
import '../assets/styles/content.css';

class WebCanvasApp {
  constructor() {
    this.canvasManager = new CanvasManager();
    this.toolManager = new ToolManager();
    this.uiManager = new UIManager(this.canvasManager, this.toolManager);
    
    this.init();
  }

  init() {
    this.uiManager.createUI();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('webcanvas:toolchange', (e) => {
      this.toolManager.setCurrentTool(e.detail.tool);
    });
  }
}

// Initialize the application
new WebCanvasApp();