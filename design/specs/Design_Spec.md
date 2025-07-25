# CRM管理后台系统设计规范

## 1. 设计概述

### 1.1 项目背景

本文档为医疗CRM管理后台系统的设计规范，旨在为系统提供一致、专业、易用的用户界面设计指南。该系统主要面向医疗机构的管理人员、前台接待、财务人员和医疗人员，用于管理用户、就诊人和订单信息。

### 1.2 设计目标

- 提供清晰、直观的用户界面，降低用户学习成本
- 确保系统各模块视觉风格统一，提升品牌识别度
- 优化用户操作流程，提高工作效率
- 符合Web端应用的设计规范和用户习惯
- 确保界面在不同设备和分辨率下的适配性

### 1.3 目标平台

- **主要平台**：Web端（Chrome浏览器）
- **设计分辨率**：1920 × 1080（桌面端）
- **兼容分辨率**：1366 × 768及以上

## 2. 视觉设计规范

### 2.1 色彩系统

#### 2.1.1 主色调

- **主色**：#1890FF（蓝色）
  - 用于主要按钮、链接、重点强调元素
- **辅助色**：#52C41A（绿色）
  - 用于成功状态、积极反馈
- **警示色**：#FAAD14（黄色）
  - 用于警告状态、需要注意的信息
- **错误色**：#F5222D（红色）
  - 用于错误状态、危险操作

#### 2.1.2 中性色

- **文本主色**：#262626（深灰）
  - 用于主要文本内容
- **文本次色**：#595959（中灰）
  - 用于次要文本、说明文字
- **文本辅助色**：#8C8C8C（浅灰）
  - 用于辅助文本、占位符
- **边框颜色**：#D9D9D9（淡灰）
  - 用于边框、分割线
- **背景色**：#F5F5F5（浅灰背景）
  - 用于页面背景、卡片背景
- **表格斑马纹**：#FAFAFA（极浅灰）
  - 用于表格奇数行背景

### 2.2 字体规范

#### 2.2.1 字体家族

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

#### 2.2.2 字号规范

- **页面标题**：20px，加粗
- **一级标题**：18px，加粗
- **二级标题**：16px，加粗
- **三级标题**：14px，加粗
- **正文**：14px，常规
- **辅助文本**：12px，常规
- **小型文本**：12px，常规

#### 2.2.3 行高规范

- **标题行高**：1.4
- **正文行高**：1.5
- **表单行高**：1.5

### 2.3 图标规范

- 使用FontAwesome图标库
- 主要操作图标大小：16px
- 功能区图标大小：20px
- 导航图标大小：24px
- 图标颜色与文本颜色保持一致

### 2.4 间距规范

- **基础间距单位**：8px
- **内容区内边距**：24px
- **卡片内边距**：16px
- **表单项间距**：24px
- **按钮内边距**：水平12px，垂直4px
- **图标与文本间距**：8px

### 2.5 阴影规范

- **卡片阴影**：`0 2px 8px rgba(0, 0, 0, 0.09)`
- **下拉菜单阴影**：`0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`
- **模态框阴影**：`0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`

### 2.6 圆角规范

- **小圆角**：2px（用于标签、小型按钮）
- **中圆角**：4px（用于按钮、输入框、卡片）
- **大圆角**：8px（用于模态框、大型卡片）

## 3. 组件设计规范

### 3.1 导航组件

#### 3.1.1 顶部导航栏

- 高度：64px
- 背景色：白色（#FFFFFF）
- 包含：系统Logo、用户信息、通知图标、帮助图标
- 阴影：`0 2px 8px rgba(0, 0, 0, 0.09)`

#### 3.1.2 侧边导航菜单

- 宽度：200px（展开状态）、80px（折叠状态）
- 背景色：深色（#001529）
- 文字颜色：浅色（#FFFFFF）
- 选中项背景：主色（#1890FF）
- 包含：一级菜单、二级菜单、折叠按钮

### 3.2 表单组件

#### 3.2.1 输入框

- 高度：32px
- 内边距：水平12px
- 边框：1px solid #D9D9D9
- 圆角：4px
- 聚焦状态：边框颜色为主色，带阴影

#### 3.2.2 下拉选择器

- 高度：32px
- 内边距：水平12px
- 边框：1px solid #D9D9D9
- 圆角：4px
- 下拉箭头颜色：#8C8C8C

#### 3.2.3 单选框/复选框

- 大小：16px
- 选中颜色：主色（#1890FF）
- 文字与选项间距：8px

#### 3.2.4 开关

- 大小：22px（高）× 44px（宽）
- 开启颜色：主色（#1890FF）
- 关闭颜色：#BFBFBF

### 3.3 按钮组件

#### 3.3.1 主要按钮

- 背景色：主色（#1890FF）
- 文字颜色：白色（#FFFFFF）
- 边框：无
- 内边距：水平16px，垂直8px
- 圆角：4px
- 悬停状态：加深10%

#### 3.3.2 次要按钮

- 背景色：白色（#FFFFFF）
- 文字颜色：主色（#1890FF）
- 边框：1px solid #1890FF
- 内边距：水平16px，垂直8px
- 圆角：4px
- 悬停状态：背景色变为浅蓝（#E6F7FF）

#### 3.3.3 文本按钮

- 背景色：透明
- 文字颜色：主色（#1890FF）
- 边框：无
- 内边距：水平4px，垂直0
- 悬停状态：文字颜色加深

#### 3.3.4 危险按钮

- 背景色：错误色（#F5222D）
- 文字颜色：白色（#FFFFFF）
- 边框：无
- 内边距：水平16px，垂直8px
- 圆角：4px
- 悬停状态：加深10%

### 3.4 表格组件

- 表头背景色：#FAFAFA
- 表头文字颜色：#262626
- 表头字重：加粗
- 表格边框：1px solid #F0F0F0
- 行高：54px
- 单元格内边距：水平16px，垂直12px
- 斑马纹：奇数行背景色为#FAFAFA
- 悬停行背景色：#E6F7FF

### 3.5 卡片组件

- 背景色：白色（#FFFFFF）
- 边框：无
- 圆角：4px
- 内边距：24px
- 阴影：`0 2px 8px rgba(0, 0, 0, 0.09)`
- 标题字号：16px，加粗
- 标题与内容间距：16px

### 3.6 标签组件

- 内边距：水平8px，垂直2px
- 圆角：2px
- 字号：12px
- 颜色：根据标签类型使用不同背景色和文字色

### 3.7 分页组件

- 按钮大小：32px × 32px
- 文字颜色：#8C8C8C
- 选中项背景色：主色（#1890FF）
- 选中项文字颜色：白色（#FFFFFF）
- 边框：1px solid #D9D9D9
- 圆角：4px

### 3.8 弹窗组件

- 背景色：白色（#FFFFFF）
- 标题字号：16px，加粗
- 内边距：24px
- 圆角：8px
- 阴影：`0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`
- 遮罩背景色：rgba(0, 0, 0, 0.45)

## 4. 页面布局规范

### 4.1 整体布局

- 采用左侧导航 + 顶部导航 + 内容区的三段式布局
- 左侧导航固定宽度，可折叠
- 内容区自适应宽度，居中布局
- 内容区最大宽度：1200px
- 内容区内边距：24px

### 4.2 内容区布局

- 采用卡片式布局，内容包裹在卡片中
- 卡片间距：24px
- 使用栅格系统，12列栅格
- 栅格间距：24px

### 4.3 表单布局

- 标签对齐方式：右对齐
- 标签与输入框间距：8px
- 表单项间距：24px
- 操作按钮区域与表单间距：32px
- 操作按钮靠右对齐

### 4.4 列表页布局

- 顶部包含：页面标题、搜索区域、操作按钮
- 中部为数据表格
- 底部为分页组件
- 搜索区域与表格间距：16px
- 表格与分页间距：16px

### 4.5 详情页布局

- 顶部包含：页面标题、返回按钮、操作按钮
- 内容区采用分组展示，每组使用卡片包裹
- 卡片间距：24px
- 分组标题字号：16px，加粗
- 分组标题与内容间距：16px

## 5. 交互设计规范

### 5.1 响应反馈

- 按钮点击后显示加载状态
- 表单提交后显示成功/失败提示
- 操作成功后显示成功提示，1.5秒后自动消失
- 操作失败后显示错误提示，需用户手动关闭
- 重要操作需二次确认

### 5.2 表单交互

- 输入框获得焦点时显示蓝色边框
- 必填项标记为红色星号
- 输入错误时显示红色边框和错误提示
- 表单验证实时进行，失去焦点时显示错误
- 提交按钮在表单验证通过前禁用

### 5.3 列表交互

- 表格行悬停时背景色变化
- 表格支持点击表头排序
- 表格支持多选操作
- 分页组件支持跳转到指定页
- 表格空数据状态显示友好提示

### 5.4 导航交互

- 当前页面在导航中高亮显示
- 侧边导航支持折叠/展开
- 面包屑导航支持点击返回上级
- 导航项悬停时显示提示文本

### 5.5 加载状态

- 页面加载时显示骨架屏
- 局部加载时显示加载动画
- 按钮加载时显示加载图标
- 表格加载时显示加载动画

## 6. 响应式设计规范

### 6.1 断点设置

- 超小屏幕：< 576px
- 小屏幕：≥ 576px
- 中等屏幕：≥ 768px
- 大屏幕：≥ 992px
- 超大屏幕：≥ 1200px

### 6.2 响应式调整

- 大屏幕：完整显示所有内容
- 中等屏幕：侧边导航可折叠，表格横向滚动
- 小屏幕：侧边导航默认折叠，表单标签上置

## 7. 无障碍设计规范

- 所有可交互元素支持键盘操作
- 图片提供alt文本
- 表单错误提示清晰明确
- 颜色对比度符合WCAG 2.0 AA标准
- 重要操作提供充分的提示和确认

## 8. 设计资源

### 8.1 图标资源

- 使用FontAwesome图标库
- 图标颜色与文本颜色保持一致

### 8.2 图片资源

- 使用Unsplash提供的高质量图片
- 图片分辨率适配2x屏幕
- 图片格式优先使用WebP，兼容PNG/JPG

## 9. 设计实现指南

### 9.1 技术栈

- HTML5
- Tailwind CSS
- FontAwesome图标库

### 9.2 浏览器兼容性

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

### 9.3 性能优化

- 图片懒加载
- CSS压缩
- 组件按需加载
- 避免不必要的重绘和回流