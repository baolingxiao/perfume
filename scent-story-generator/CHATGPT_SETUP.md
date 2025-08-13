# ChatGPT AI故事生成器配置指南

## 概述
本指南将帮助您配置香水工坊的AI故事生成器，支持ChatGPT和DeepSeek两种AI提供商。

## 步骤1：获取OpenAI API密钥

1. 访问 [OpenAI官网](https://platform.openai.com/)
2. 注册或登录您的账户
3. 进入 "API Keys" 页面
4. 点击 "Create new secret key"
5. 复制生成的API密钥（格式：sk-xxxxxxxxxxxxxxxxxxxxxxxx）

## 步骤2：配置环境变量

### 方法1：使用.env文件（推荐）
1. 复制 `env_example.txt` 为 `.env`
2. 编辑 `.env` 文件，填入您的API密钥：
```bash
OPENAI_API_KEY=sk-your_actual_api_key_here
```

### 方法2：直接设置环境变量
```bash
# Linux/Mac
export OPENAI_API_KEY="sk-your_actual_api_key_here"

# Windows
set OPENAI_API_KEY=sk-your_actual_api_key_here
```

## 步骤3：安装依赖

```bash
pip install -r requirements.txt
```

## 步骤4：启动服务

```bash
python scent_story_api.py
```

## 步骤5：测试ChatGPT功能

1. 打开浏览器访问 `http://localhost:8080`
2. 在AI提供商选择区域选择 "ChatGPT"
3. 选择香调组合
4. 点击 "生成香气故事" 按钮
5. 验证故事是否成功生成

## 配置选项

### ChatGPT模型选择
在 `scent_story_api.py` 中可以修改使用的模型：

```python
# 当前配置
"model": "gpt-3.5-turbo"

# 可选模型
"model": "gpt-4"  # 更高质量，但成本更高
"model": "gpt-3.5-turbo-16k"  # 支持更长对话
```

### 生成参数调整
可以调整以下参数来优化生成效果：

```python
"temperature": 0.7,  # 创造性（0-1，越高越有创意）
"max_tokens": 300,   # 最大生成长度
"top_p": 0.9,        # 核采样参数
```

## 故障排除

### 常见错误

1. **API密钥错误**
   - 确保API密钥格式正确（以sk-开头）
   - 检查API密钥是否有效

2. **网络连接问题**
   - 确保能够访问 `api.openai.com`
   - 检查防火墙设置

3. **配额限制**
   - 检查OpenAI账户余额
   - 查看API使用配额

### 调试模式
在代码中添加调试信息：

```python
print(f"OpenAI API Key: {OPENAI_API_KEY[:10]}...")  # 只显示前10个字符
```

## 成本估算

- **GPT-3.5-turbo**: 约 $0.002 / 1K tokens
- **GPT-4**: 约 $0.03 / 1K tokens

每次故事生成约消耗 200-300 tokens，成本很低。

## 安全注意事项

1. **不要将API密钥提交到代码仓库**
2. **使用环境变量或配置文件存储密钥**
3. **定期轮换API密钥**
4. **监控API使用情况**

## 支持

如遇到问题，请检查：
1. API密钥是否正确配置
2. 网络连接是否正常
3. 依赖是否正确安装
4. 服务是否正常启动
