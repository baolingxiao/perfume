# 香气故事生成器

基于AI的香气故事生成器，为香水工坊网站提供智能故事创作功能。

## 功能特点

- 🎨 8种主香调选择（花香、木香、果香、柑橘、辛辣、东方、清新、水香）
- 🌸 21种辅料选择（玫瑰、茉莉、薰衣草等）
- 🤖 基于Mistral-7B-Instruct-v0.2模型的故事生成
- ⚡ 智能缓存和频率限制
- 🎯 内容过滤和敏感词检测
- 📱 响应式设计，支持移动端

## 部署指南

### 1. Replit部署

1. 在Replit中创建新的Python项目
2. 上传所有文件到项目根目录
3. 在Secrets中添加环境变量：
   - `HF_API_KEY`: 你的Hugging Face API密钥
4. 点击运行按钮启动服务

### 2. 本地部署

1. 安装依赖：
```bash
pip install -r requirements.txt
```

2. 设置环境变量：
```bash
export HF_API_KEY="your_huggingface_api_key"
```

3. 运行服务：
```bash
python scent_story_api.py
```

### 3. 集成到主网站

在香水工坊主页面添加导航链接：
```html
<a href="/scent-story-generator/" class="nav-link">香气故事</a>
```

## 文件结构

```
scent-story-generator/
├── scent_story_api.py           # Flask后端API
├── static/
│   ├── scent_story_generator.html  # 前端页面
│   └── scent_story_interaction.js  # 前端交互逻辑
├── requirements.txt             # Python依赖
├── .replit                      # Replit配置
└── README.md                    # 说明文档
```

## API接口

### POST /api/generate

生成香气故事

**请求体：**
```json
{
  "mainScent": "floral",
  "accents": ["rose", "jasmine"]
}
```

**响应：**
```json
{
  "title": "花之精灵的祝福",
  "content": "故事内容...",
  "scent": "floral",
  "accents": ["rose", "jasmine"],
  "generated_at": 1640995200
}
```

## 配置说明

- `CACHE_DURATION`: 缓存持续时间（秒）
- `REQUEST_LIMIT`: 用户请求限制次数
- `REQUEST_WINDOW`: 请求时间窗口（秒）
- `BANNED_TERMS`: 敏感词过滤列表

## 注意事项

1. 需要有效的Hugging Face API密钥
2. 建议在生产环境中使用数据库存储缓存
3. 可以根据需要调整频率限制参数
4. 定期更新敏感词过滤列表

## 技术支持

如有问题，请检查：
1. API密钥是否正确设置
2. 网络连接是否正常
3. 依赖包是否正确安装 