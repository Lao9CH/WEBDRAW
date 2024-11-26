import { CanvasManager } from '../modules/CanvasManager';
import { UIManager } from '../modules/UIManager';
import { ToolManager } from '../modules/ToolManager';
import '../assets/styles/content.css';

/**
 * Web Canvas 应用主类
 * 负责协调画布管理器、工具管理器和界面管理器
 */
class WebCanvasApp {
  constructor() {
    this.canvasManager = new CanvasManager();
    this.toolManager = new ToolManager();
    this.uiManager = new UIManager(this.canvasManager, this.toolManager);
    
    this.init();
  }

  /**
   * 初始化应用
   */
  init() {
    this.uiManager.createUI();
    this.setupEventListeners();
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    document.addEventListener('webcanvas:toolchange', (e) => {
      this.toolManager.setCurrentTool(e.detail.tool);
    });
  }
}

// 初始化应用
new WebCanvasApp();