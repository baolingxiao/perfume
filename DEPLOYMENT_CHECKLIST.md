# 🚀 部署检查清单

## 部署前检查

### 1. 代码质量检查
- [ ] 运行 `npm run check-cache` 检查版本一致性
- [ ] 检查所有HTML文件的CSS引用是否正确
- [ ] 确认所有图片路径有效

### 2. 功能测试
- [ ] 香料选择页面布局正常
- [ ] AI故事生成器功能正常
- [ ] 幻界卡系统显示正确
- [ ] 响应式设计在不同设备上正常

### 3. 版本管理
- [ ] 更新 `package.json` 中的 `cacheVersion`
- [ ] 运行 `npm run version:update` 更新所有文件版本号
- [ ] 确认版本号在所有文件中一致

### 4. Git操作
- [ ] `git add .` 添加所有更改
- [ ] `git commit -m "描述性提交信息"`
- [ ] `git push` 推送到GitHub

### 5. 部署后验证
- [ ] 等待2-5分钟让GitHub Pages部署
- [ ] 访问网站验证更改生效
- [ ] 清除浏览器缓存测试（Ctrl+F5 / Cmd+Shift+R）

## 常见问题解决

### 浏览器缓存问题
```bash
# 更新版本号
npm run version:update

# 检查版本一致性
npm run check-cache
```

### 快速部署
```bash
# 一键部署（包含版本更新）
npm run deploy
```

## 文件结构说明

```
香水工坊/
├── css/                    # CSS样式文件
│   ├── base_15-30.css     # 基础样式
│   ├── ingredients_15-30.css  # 香料页面样式
│   └── home_15-30.css     # 首页样式
├── ingredients_15-30.html # 香料选择页面
├── index_15-30.html       # 首页
├── package.json           # 项目配置和脚本
├── scripts/               # 自动化脚本
│   ├── update-version.js  # 版本更新脚本
│   └── check-cache.js     # 缓存检查脚本
└── DEPLOYMENT_CHECKLIST.md # 本文件
```
