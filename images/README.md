# 香水工坊图片资源文件夹

## 文件夹结构

```
images/
└── ingredients/
    ├── 香料图片文件 (.jpeg/.jpg/.png)
    └── placeholder.jpg (占位符图片)
```

## 使用说明

### 统一的图片路径格式
所有香料相关的图片都存储在 `images/ingredients/` 目录下，使用统一的路径格式：

```html
<img src="images/ingredients/香料名称.jpeg" alt="香料名称">
```

### 页面引用
- **香料选择页面** (`ingredients_15-30.html`)：使用 `images/ingredients/` 路径
- **香料介绍页面** (各个香料HTML文件)：使用 `images/ingredients/` 路径

### 支持的图片格式
- `.jpeg` - 主要格式
- `.jpg` - 兼容格式  
- `.png` - 透明背景图片

### 添加新图片
1. 将图片文件放入 `images/ingredients/` 目录
2. 确保文件名与香料名称一致
3. 在相应的HTML文件中使用统一的路径格式

## 更新历史
- 2025-01-XX: 创建统一的图片文件夹结构
- 2025-01-XX: 统一所有页面的图片路径引用 