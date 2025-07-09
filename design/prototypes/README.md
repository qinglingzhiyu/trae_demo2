# 医疗CRM管理后台系统 - 高保真HTML原型

## 项目概述

本项目是医疗CRM管理后台系统的高保真HTML原型，基于产品需求文档(PRD)和用户故事地图开发。原型采用Web浏览器界面风格，模拟Chrome浏览器的视觉规范，为开发团队提供直观、可交互的界面参考。

## 技术栈

- **HTML5**: 提供基础结构
- **Tailwind CSS**: 用于样式设计，通过CDN引入
- **FontAwesome**: 提供图标资源，通过CDN引入
- **Chart.js**: 用于数据可视化图表，通过CDN引入
- **Unsplash**: 提供高质量真实图片资源

## 颜色系统

- **主色**: #1890FF (蓝色)
- **成功色**: #52C41A (绿色)
- **警告色**: #FAAD14 (黄色)
- **错误色**: #F5222D (红色)
- **文本主色**: #262626
- **文本次色**: #595959
- **文本辅助色**: #8C8C8C
- **边框色**: #D9D9D9
- **背景浅色**: #F5F5F5
- **背景更浅色**: #FAFAFA
- **菜单深色**: #001529

## 字体系统

使用系统默认字体栈：
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

## 文件结构

- `index.html` - 主入口页面，展示所有界面原型
- `login.html` - 登录页面
- `dashboard.html` - 工作台/仪表盘页面
- `user-list.html` - 用户列表页面
- `user-detail.html` - 用户详情页面
- `user-create.html` - 创建用户页面
- `patient-list.html` - 就诊人列表页面
- `patient-detail.html` - 就诊人详情页面
- `order-list.html` - 订单列表页面
- `order-detail.html` - 订单详情页面
- `analytics-overview.html` - 数据分析概览页面
- `settings-permissions.html` - 权限设置页面
- `settings-parameters.html` - 系统参数设置页面
- `settings-personal.html` - 个人设置页面

## 使用说明

1. 打开 `index.html` 可查看所有界面的平铺展示
2. 点击各个界面中的导航菜单可以在不同页面间跳转
3. 部分交互功能已实现，如选项卡切换、表单提交等
4. 所有表单提交按钮点击后会模拟跳转到相应页面

## 设计规范

详细的设计规范请参考 `/design/specs/Design_Spec.md`，包含完整的颜色、字体、组件和布局规范。

## 用户流程

用户操作流程图请参考 `/design/Flowchart.md`，其中详细描述了系统的主要用户流程。

## 图片来源

原型中使用的所有图片均来自 Unsplash，是免费可商用的高质量图片。每个图片的来源URL已在HTML代码中以注释形式标注。

## 浏览器兼容性

原型设计主要针对现代浏览器优化，特别是Chrome浏览器，以符合PRD中指定的目标平台要求。