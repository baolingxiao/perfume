# GitHub 部署指南

## 🚀 将项目推送到GitHub

### 步骤1: 在GitHub上创建新仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `perfume-workshop` (或您喜欢的名字)
   - **Description**: `香水工坊 - 优雅的香水香料展示网站`
   - **Visibility**: 选择 Public 或 Private
   - **⚠️ 重要**: 不要勾选 "Add a README file"、"Add .gitignore" 或 "Choose a license"
4. 点击 "Create repository"

### 步骤2: 连接本地仓库到GitHub

复制GitHub给出的仓库URL，然后在终端中运行：

```bash
# 添加远程仓库 (替换YOUR_USERNAME为您的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/perfume-workshop.git

# 推送代码到GitHub
git push -u origin main
```

### 步骤3: 验证推送成功

1. 刷新GitHub仓库页面
2. 您应该看到所有文件已经上传
3. README.md 会自动显示项目介绍

## 🌐 启用GitHub Pages (可选)

如果您想让网站在线可访问：

1. 在GitHub仓库中，点击 "Settings" 标签
2. 滚动到 "Pages" 部分
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 点击 "Save"
6. 几分钟后，您的网站将在以下地址可访问：
   `https://YOUR_USERNAME.github.io/perfume-workshop/index_15-30.html`

## 🔧 如果遇到问题

### 问题1: 推送被拒绝
```bash
# 强制推送 (仅在确定的情况下使用)
git push -f origin main
```

### 问题2: 需要身份验证
- 使用GitHub用户名和Personal Access Token
- 或者设置SSH密钥

### 问题3: 文件太大
GitHub有100MB的单文件限制。如果图片文件太大：
```bash
# 检查大文件
find . -size +50M -type f

# 压缩图片或使用Git LFS
```

## 📱 后续管理

### 更新代码
```bash
# 修改文件后
git add .
git commit -m "描述您的更改"
git push origin main
```

### 克隆到其他地方
```bash
git clone https://github.com/YOUR_USERNAME/perfume-workshop.git
```

## 🎯 完成后的下一步

1. ✅ 代码已备份到GitHub
2. ✅ 可以与他人分享项目
3. ✅ 启用GitHub Pages后可在线访问
4. 🔄 继续开发和改进网站

---
**恭喜！** 您的香水工坊项目现在已经安全地存储在GitHub上了！🎉 