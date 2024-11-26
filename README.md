# Web Canvas 网页画板

一个专业的Chrome浏览器网页标注和绘画工具扩展。

## 功能特点

- 流畅的自由绘画功能
- 橡皮擦工具
- 自适应窗口大小的画布
- 可在任何网页上使用
- 使用 perfect-freehand 库实现专业的绘画体验

## 安装方法

1. 克隆此仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建扩展：
   ```bash
   npm run build
   ```
4. 在Chrome中加载扩展：
   - 打开Chrome浏览器，访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `dist` 文件夹

## 开发说明

- 运行开发模式（支持实时更新）：
  ```bash
  npm run dev
  ```

## 使用方法

1. 点击Chrome工具栏中的Web Canvas图标
2. 使用绘画工具在任何网页上进行标注
3. 从工具栏选择不同的工具和颜色
4. 自由绘画和标注

## 技术栈

- Chrome扩展 Manifest V3
- perfect-freehand 库实现流畅绘画
- Webpack 构建工具
- 现代JavaScript (ES6+)

## 开源协议

MIT
