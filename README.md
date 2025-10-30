# 学生信息管理系统

## 项目简介

学生信息管理系统是一个基于React+TypeScript的前端应用，用于管理学生基本信息和成绩数据。系统支持教师角色登录，提供学生信息的查询、新增、修改功能，以及成绩的录入、查询和统计分析功能。

## 技术栈

- React 18
- TypeScript
- Ant Design 5.x
- React Router v6
- Formik + Yup (表单处理与验证)
- Context API (状态管理)
- Less (样式预处理器)
- Vite (构建工具)

## 功能模块

1. **登录系统**：支持教师角色登录，登录接口为/login（mock实现）
2. **基本信息管理**：学生信息列表展示，支持多条件筛选（学号、姓名、年级、班级、性别），提供新增和修改功能
3. **成绩管理**：成绩列表展示，支持筛选（学号、姓名、年级班级），可按科目成绩排序，提供录入和修改功能

## 项目结构

```
/src
  /assets         # 静态资源
  /components     # 通用组件
    /Common       # 公共组件
    /Layout       # 布局组件
    /Forms        # 表单组件
  /context        # Context API
  /hooks          # 自定义Hooks
  /pages          # 页面组件
    /Login        # 登录页
    /Dashboard    # 仪表盘
    /StudentInfo  # 学生基本信息管理
    /ScoreManage  # 成绩管理
  /services       # API服务
  /utils          # 工具函数
  /types          # TypeScript类型定义
  /styles         # 全局样式
  App.tsx         # 应用入口
  main.tsx        # 渲染入口
```

## 安装与运行

### 前提条件

- Node.js (v14.0.0 或更高版本)
- npm (v6.0.0 或更高版本)

### 安装步骤

1. 克隆项目到本地

```bash
git clone https://github.com/yourusername/student-info-system.git
cd student-info-system
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 在浏览器中访问

```
http://localhost:3000
```

## 页面说明

### 登录页面

- 路径: `/login`
- 功能: 用户登录，支持教师角色登录
- 测试账号: 任意用户名和密码均可登录（mock实现）

### 仪表盘页面

- 路径: `/dashboard`
- 功能: 系统概览，展示学生总数、成绩记录数、平均成绩和及格率等统计信息

### 学生基本信息管理页面

- 路径: `/student-info`
- 功能: 展示学生列表，支持多条件筛选，提供新增和修改学生信息功能

### 成绩管理页面

- 路径: `/score-manage`
- 功能: 展示学生成绩列表，支持筛选和按科目成绩排序，提供录入和修改成绩功能

## 常见问题

### 页面空白问题

如果遇到页面空白问题，请检查以下几点：

1. 确保所有依赖已正确安装：`npm install`
2. 检查控制台是否有错误信息
3. 确保路径导入正确，特别是页面组件的导入路径

### 登录问题

系统使用mock登录，任意用户名和密码均可登录。登录成功后，系统会在localStorage中存储token和用户信息。

## 后续优化方向

1. 添加数据可视化功能，展示学生成绩分布和趋势
2. 实现批量导入导出功能
3. 添加用户权限管理
4. 优化移动端适配
5. 添加数据缓存机制，提高性能

## 许可证

MIT
