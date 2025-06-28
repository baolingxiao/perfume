# 香气故事生成器

基于AI的香气故事生成器，为香水工坊网站提供智能故事创作功能。

## 功能特点

- 🎨 4种主香调选择（花香、木香、果香、东方）
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

## 技术架构

### 后端 (Flask)
- **框架**: Flask 2.3.3
- **AI集成**: 
  - Hugging Face Inference API
  - DeepSeek Chat API
- **缓存**: 内存缓存 + 预生成内容池
- **安全**: 频率限制 + 内容过滤

### 前端 (HTML/CSS/JS)
- **样式**: Tailwind CSS
- **交互**: 原生JavaScript
- **图标**: Font Awesome
- **响应式**: 移动端适配

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone <your-repo>
cd scent-story-generator

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

### 2. API密钥配置

#### Hugging Face API (美国AI)
1. 访问 [Hugging Face](https://huggingface.co/settings/tokens)
2. 创建新的API Token
3. 设置环境变量：
```bash
export HF_API_KEY="your_huggingface_token"
```

#### DeepSeek API (中国AI)
1. 访问 [DeepSeek](https://platform.deepseek.com/)
2. 注册账号并获取API密钥
3. 设置环境变量：
```bash
export DEEPSEEK_API_KEY="your_deepseek_api_key"
```

### 3. 启动服务

```bash
python scent_story_api.py
```

服务将在 `http://localhost:8080` 启动

## 部署指南

### Replit部署

1. 在Replit中导入项目
2. 在Secrets中添加环境变量：
   - `HF_API_KEY`: Hugging Face API密钥
   - `DEEPSEEK_API_KEY`: DeepSeek API密钥
3. 运行项目

### Hugging Face Spaces部署

1. 创建新的Space
2. 上传项目文件
3. 在Settings中配置环境变量
4. 选择Python运行时

### 本地部署

```bash
# 使用gunicorn (推荐)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8080 scent_story_api:app

# 或使用Flask内置服务器 (开发环境)
python scent_story_api.py
```

## API文档

### 生成故事

**POST** `/api/generate`

**请求体**:
```json
{
  "mainScent": "floral",
  "accents": ["rose", "jasmine"],
  "aiProvider": "huggingface"
}
```

**响应**:
```json
{
  "title": "花之精灵的祝福",
  "content": "在遥远的魔法森林深处...",
  "scent": "floral",
  "accents": ["rose", "jasmine"],
  "ai_provider": "huggingface",
  "generated_at": 1703123456
}
```

## 香调映射

### 主香调
- `floral` - 花香调
- `woody` - 木质调  
- `fruity` - 果香调
- `oriental` - 东方调

### 辅料
- `rose` - 玫瑰
- `jasmine` - 茉莉
- `lavender` - 薰衣草
- `cedar` - 雪松
- `sandalwood` - 檀香
- `vanilla` - 香草
- `bergamot` - 佛手柑
- `lemon` - 柠檬
- `patchouli` - 广藿香
- `musk` - 麝香
- `amber` - 琥珀
- `oud` - 乌木
- `cinnamon` - 肉桂
- `clove` - 丁香
- `pepper` - 胡椒
- `violet` - 紫罗兰
- `lily` - 百合
- `mint` - 薄荷
- `apple` - 苹果
- `peach` - 桃子
- `tonka` - 零陵香豆

## 安全特性

- **频率限制**: 每用户每10分钟限制1次请求
- **内容过滤**: 自动过滤敏感内容
- **错误处理**: 完善的异常处理机制
- **缓存机制**: 减少API调用，提高响应速度

## 性能优化

- **智能缓存**: 24小时缓存机制
- **预生成池**: 启动时加载常用组合
- **异步处理**: 非阻塞的内容保存
- **压缩提示词**: 减少token使用量

## 故障排除

### 常见问题

1. **API密钥错误**
   - 检查环境变量是否正确设置
   - 确认API密钥有效且有足够配额

2. **网络连接问题**
   - 检查网络连接
   - 确认API服务可用

3. **生成失败**
   - 查看控制台错误信息
   - 检查API配额是否用完

### 日志查看

```bash
# 查看Flask日志
tail -f app.log

# 查看系统日志
journalctl -u your-service-name
```

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 许可证

MIT License

## 更新日志

### v2.0.0
- ✨ 新增DeepSeek API支持
- 🎨 添加AI提供商选择器
- 🔧 优化错误处理
- 📱 改进移动端体验

### v1.0.0
- 🎉 初始版本发布
- 🌸 支持四大香调
- ⭐ 21种辅料选择
- 📖 AI故事生成 