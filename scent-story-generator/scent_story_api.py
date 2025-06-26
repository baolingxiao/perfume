from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
import os
import time
import threading

app = Flask(__name__, static_folder='static')

# 配置Hugging Face客户端
HF_API_KEY = os.environ.get('HF_API_KEY')
client = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    token=HF_API_KEY
)

# 内存缓存（带过期机制）
story_cache = {}
cache_expire = {}
CACHE_DURATION = 86400  # 24小时

# 频率限制（每用户每10分钟1次）
user_requests = {}
REQUEST_LIMIT = 1
REQUEST_WINDOW = 600  # 10分钟

# 预生成内容池（启动时加载）
PRE_GENERATED_POOL = {}

# 敏感词过滤列表
BANNED_TERMS = ["暴力", "色情", "政治", "敏感词", "违禁"]

@app.route('/')
def index():
    return app.send_static_file('scent_story_generator.html')

@app.route('/api/generate', methods=['POST'])
def generate_story():
    try:
        # 获取请求IP作为用户标识（生产环境建议用session或token）
        user_ip = request.remote_addr
        
        # 频率限制检查
        current_time = time.time()
        if user_ip in user_requests:
            requests = [t for t in user_requests[user_ip] if current_time - t < REQUEST_WINDOW]
            if len(requests) >= REQUEST_LIMIT:
                remaining_time = REQUEST_WINDOW - (current_time - min(requests))
                return jsonify({
                    "error": f"请求频率过快，请等待{int(remaining_time/60)}分钟后再试"
                }), 429
            user_requests[user_ip] = requests
        else:
            user_requests[user_ip] = []
        
        user_requests[user_ip].append(current_time)
        
        # 解析请求数据
        data = request.json
        main_scent = data.get('mainScent')
        accents = data.get('accents', [])
        
        if not main_scent:
            return jsonify({"error": "请选择主香调"}), 400
        
        # 构建缓存键
        combo_key = f"{main_scent}_{'_'.join(sorted(accents))}"
        
        # 检查预生成内容池
        if combo_key in PRE_GENERATED_POOL:
            return jsonify(PRE_GENERATED_POOL[combo_key])
        
        # 检查缓存
        if combo_key in story_cache and current_time - cache_expire[combo_key] < CACHE_DURATION:
            return jsonify(story_cache[combo_key])
        
        # 构建提示词
        prompt = build_prompt(main_scent, accents)
        
        # 调用Hugging Face API
        response = client.text_generation(
            prompt,
            max_new_tokens=300,
            temperature=0.7,
            top_p=0.9,
            wait_for_model=True
        )
        
        # 处理响应
        story = response.strip()
        
        # 内容过滤
        filtered_story = filter_content(story)
        
        # 提取标题（取前15个字符）
        title = filtered_story[:15].strip()
        if len(filtered_story) > 15 and not filtered_story[15].isspace():
            title += "..."
        
        # 构建响应数据
        story_data = {
            "title": title,
            "content": filtered_story,
            "scent": main_scent,
            "accents": accents,
            "generated_at": int(current_time)
        }
        
        # 存储到缓存
        story_cache[combo_key] = story_data
        cache_expire[combo_key] = current_time
        
        # 异步保存到预生成池（实际项目建议使用数据库）
        threading.Thread(target=save_to_pre_generated, args=(combo_key, story_data)).start()
        
        return jsonify(story_data)
    
    except Exception as e:
        print(f"Error generating story: {str(e)}")
        return jsonify({
            "error": "生成故事失败，请稍后再试",
            "details": str(e)
        }), 500

def build_prompt(main_scent, accents):
    # 映射主香调到守护者角色
    guardian_map = {
        "floral": "花之精灵",
        "woody": "森林长老",
        "fruity": "果园信使",
        "oriental": "沙漠旅者"
    }
    
    # 映射主香调到精神象征
    spirit_map = {
        "floral": "温柔与优雅",
        "woody": "沉稳与力量",
        "fruity": "活力与喜悦",
        "oriental": "神秘与诱惑"
    }
    
    # 映射辅料到情感标签
    emotion_map = {
        "rose": "浪漫",
        "jasmine": "优雅",
        "lavender": "平静",
        "cedar": "沉稳",
        "sandalwood": "温暖",
        "vanilla": "舒适",
        "bergamot": "清新",
        "lemon": "活力",
        "patchouli": "神秘",
        "musk": "性感",
        "amber": "温暖",
        "oud": "奢华",
        "cinnamon": "热情",
        "clove": "深邃",
        "pepper": "刺激",
        "violet": "温柔",
        "lily": "纯洁",
        "mint": "清凉",
        "apple": "青春",
        "peach": "甜美",
        "tonka": "醇厚"
    }
    
    guardian = guardian_map.get(main_scent, "自然守护者")
    spirit = spirit_map.get(main_scent, "生命能量")
    emotions = ",".join([emotion_map.get(accent, "未知") for accent in accents])
    
    # 压缩提示词（减少token用量）
    return f"[SCENT]{main_scent}|{','.join(accents)}#ROLES#{guardian}|{spirit}#EMOTIONS#{emotions}#FORMAT#TITLE:{{title}}\n{{content}}\n用150-200字描述一个关于这种香调的奇幻故事，展现其独特氛围和情感。避免敏感内容，语言优美有诗意。"

def filter_content(content):
    for term in BANNED_TERMS:
        if term in content:
            return "抱歉，生成的内容包含敏感信息，无法展示。"
    return content

def save_to_pre_generated(key, data):
    # 实际项目中应保存到数据库或文件系统
    # 这里简化为内存存储
    if len(PRE_GENERATED_POOL) < 100:  # 限制预生成池大小为100
        PRE_GENERATED_POOL[key] = data

def load_pre_generated_content():
    # 启动时加载预生成内容（实际项目应从文件或数据库加载）
    pass

if __name__ == '__main__':
    # 启动时加载预生成内容（实际项目应从文件或数据库加载）
    load_pre_generated_content()
    app.run(host='0.0.0.0', port=8080) 