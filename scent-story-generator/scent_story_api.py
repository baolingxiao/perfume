from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
import os
import time
import threading
import requests
import json

app = Flask(__name__, static_folder='static')

# 配置API密钥
HF_API_KEY = os.environ.get('HF_API_KEY')
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')

# 初始化Hugging Face客户端
hf_client = None
if HF_API_KEY:
    try:
        hf_client = InferenceClient(
            model="mistralai/Mistral-7B-Instruct-v0.2",
            token=HF_API_KEY
        )
    except Exception as e:
        print(f"Hugging Face客户端初始化失败: {e}")

# DeepSeek API配置
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

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

# 果香类感官特征数据
FRUITY_INGREDIENTS = {
    "bergamot": {
        "name": "香柠檬",
        "english": "Bergamot",
        "olfactory": "明亮柑橘皮酸涩感",
        "tail_note": "回甘般的清甜果肉",
        "visual": "穿透晨雾的金色光幕",
        "impression": ["清新", "活力", "提神"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "lemon": {
        "name": "西西里柠檬",
        "english": "Lemon",
        "olfactory": "汁水迸溅的尖锐酸爽",
        "tail_note": "阳光烘焙后的果皮暖意",
        "visual": "折射水滴的棱镜",
        "impression": ["清爽", "明快", "鲜活"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "lime": {
        "name": "青柠",
        "english": "Lime",
        "olfactory": "未熟青果的尖锐绿感",
        "tail_note": "碳酸气泡般的清凉尾韵",
        "visual": "玻璃杯壁凝结的水珠",
        "impression": ["青涩", "自然", "清冽"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "orange": {
        "name": "橙子",
        "english": "Orange",
        "olfactory": "饱满多汁的甜橙果肉",
        "tail_note": "白色经络的微苦平衡",
        "visual": "剥橙时飞溅的汁液",
        "impression": ["甜美", "温暖", "治愈"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "blood_orange": {
        "name": "血橙",
        "english": "Blood Orange",
        "olfactory": "深红果肉的浆果酸甜",
        "tail_note": "金属般的血色腥甜",
        "visual": "滴入红酒的橙汁漩涡",
        "impression": ["浓郁", "热情", "神秘"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "grapefruit": {
        "name": "柚子",
        "english": "Grapefruit",
        "olfactory": "微苦的粉红果瓣",
        "tail_note": "清凉的薄荷感尾调",
        "visual": "冰沙上的糖霜",
        "impression": ["微苦", "清新", "提振"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "mandarin": {
        "name": "柑橘",
        "english": "Mandarin Orange",
        "olfactory": "孩童掌心的小甜橘",
        "tail_note": "果皮油脂的温和暖意",
        "visual": "竹篮里的橙红灯笼",
        "impression": ["甜糯", "温暖", "童趣"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "apple": {
        "name": "苹果",
        "english": "Apple",
        "olfactory": "脆甜多汁的果肉",
        "tail_note": "果核微涩的杏仁感",
        "visual": "抛光后的红漆果盘",
        "impression": ["脆爽", "清甜", "明快"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "pear": {
        "name": "梨",
        "english": "Pear",
        "olfactory": "水润半透明的果肉",
        "tail_note": "微带酒香的发酵感",
        "visual": "晨露中的白玉切片",
        "impression": ["水润", "轻柔", "微醺"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "peach": {
        "name": "桃子",
        "english": "Peach",
        "olfactory": "天鹅绒表皮的绒感",
        "tail_note": "熟透果肉的蜜酿甜香",
        "visual": "少女脸颊的柔焦滤镜",
        "impression": ["柔润", "甜蜜", "浪漫"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "apricot": {
        "name": "杏子",
        "english": "Apricot",
        "olfactory": "阳光晒过的果脯甜香",
        "tail_note": "杏仁核的微苦底蕴",
        "visual": "蜜蜡封存的干花",
        "impression": ["温暖", "甘甜", "怀旧"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "cherry": {
        "name": "樱桃",
        "english": "Cherry",
        "olfactory": "糖渍红果的甜腻",
        "tail_note": "黑樱桃酒的醇厚",
        "visual": "珐琅罐中的糖渍果子",
        "impression": ["甜腻", "醇厚", "甜美"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "plum": {
        "name": "李子",
        "english": "Plum",
        "olfactory": "熟透紫果的发酵蜜香",
        "tail_note": "果皮单宁的涩感",
        "visual": "天鹅绒上的深紫露珠",
        "impression": ["浓郁", "发酵", "深邃"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "grape": {
        "name": "葡萄",
        "english": "Grape",
        "olfactory": "水晶葡萄的透明甜香",
        "tail_note": "葡萄酒桶的木质感",
        "visual": "欧式雕花玻璃碗",
        "impression": ["清透", "甜润", "典雅"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "fig": {
        "name": "无花果",
        "english": "Fig",
        "olfactory": "乳白色汁液的奶香",
        "tail_note": "干燥树叶的绿意",
        "visual": "地中海石墙裂缝的果实",
        "impression": ["奶香", "温润", "自然"],
        "volatility": "后调",
        "duration": "4-8小时+"
    },
    "pomegranate": {
        "name": "石榴",
        "english": "Pomegranate",
        "olfactory": "红宝石籽粒的酸甜爆裂",
        "tail_note": "石榴皮的单宁涩感",
        "visual": "波斯地毯上的裂果",
        "impression": ["酸甜", "爆裂", "活力"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "kumquat": {
        "name": "金桔",
        "english": "Kumquat",
        "olfactory": "连皮咀嚼的酸甜刺激",
        "tail_note": "柑橘精油的辛辣感",
        "visual": "金箔包裹的蜜饯",
        "impression": ["刺激", "辛辣", "鲜活"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "green_apple": {
        "name": "青苹果",
        "english": "Green Apple",
        "olfactory": "未熟果实的青绿酸爽",
        "tail_note": "果皮蜡质的清脆感",
        "visual": "咬痕处的半透明果肉",
        "impression": ["青涩", "酸爽", "清新"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "mango": {
        "name": "芒果",
        "english": "Mango",
        "olfactory": "热带阳光的熟甜果肉",
        "tail_note": "纤维感的木质尾调",
        "visual": "金色油画颜料厚涂",
        "impression": ["热带", "甜熟", "丰腴"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "strawberry": {
        "name": "草莓",
        "english": "Strawberry",
        "olfactory": "糖霜覆盖的鲜红莓果",
        "tail_note": "叶茎折断的青草气",
        "visual": "草莓蛋糕顶部的糖渍装饰",
        "impression": ["甜美", "清新", "活泼"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "raspberry": {
        "name": "覆盆子",
        "english": "Raspberry",
        "olfactory": "酸甜交错的莓果丛",
        "tail_note": "微带粉尘的干燥感",
        "visual": "荆棘丛中的红宝石",
        "impression": ["酸甜", "野性", "清新"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "blueberry": {
        "name": "蓝莓",
        "english": "Blueberry",
        "olfactory": "深紫色果实的粉糯甜香",
        "tail_note": "蓝莓叶的草本苦韵",
        "visual": "晨雾中的蓝紫色浆果",
        "impression": ["粉糯", "清甜", "静谧"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "blackberry": {
        "name": "黑加仑",
        "english": "Blackberry",
        "olfactory": "黑紫色浆果的浓郁果酱感",
        "tail_note": "荆棘的木质刺鼻感",
        "visual": "中世纪羊皮纸上的果渍",
        "impression": ["浓郁", "厚重", "野性"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "champagne_cognac": {
        "name": "香槟白兰地",
        "english": "Champagne Cognac",
        "olfactory": "气泡酒的金色酒香",
        "tail_note": "橡木桶陈酿的烟熏感",
        "visual": "水晶杯中的香槟塔",
        "impression": ["奢华", "微醺", "欢快"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "cherry_wine": {
        "name": "樱桃酒",
        "english": "Cherry Wine",
        "olfactory": "发酵黑樱桃的醇厚酒香",
        "tail_note": "单宁包裹的酸涩",
        "visual": "勃艮第酒杯挂壁的酒泪",
        "impression": ["醇厚", "浓郁", "典雅"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "coconut": {
        "name": "椰子",
        "english": "Coconut",
        "olfactory": "椰肉乳脂的奶甜",
        "tail_note": "晒干椰壳的木质暖意",
        "visual": "白色沙滩上的裂壳椰子",
        "impression": ["奶甜", "温暖", "度假"],
        "volatility": "后调",
        "duration": "4-8小时+"
    },
    "passion_fruit": {
        "name": "百香果",
        "english": "Passion Fruit",
        "olfactory": "热带果汁的爆炸酸甜",
        "tail_note": "籽粒咀嚼的清脆感",
        "visual": "彩虹色鸡尾酒上的装饰",
        "impression": ["活力", "热情", "欢快"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "papaya": {
        "name": "木瓜",
        "english": "Papaya",
        "olfactory": "熟透橙肉的蜜糖感",
        "tail_note": "白色籽囊的轻微腥气",
        "visual": "热带集市上的对半切果",
        "impression": ["甜暖", "热带", "微腥"],
        "volatility": "中调",
        "duration": "2-4小时"
    },
    "banana": {
        "name": "香蕉",
        "english": "Banana",
        "olfactory": "熟透果肉的甜糯感",
        "tail_note": "热带植物汁液的青涩",
        "visual": "蕉叶包裹的奶冻",
        "impression": ["甜糯", "热带", "青涩"],
        "volatility": "中调",
        "duration": "2-4小时"
    }
}

# 花香类感官特征数据
FLORAL_INGREDIENTS = {
    "jasmine": {
        "name": "茉莉",
        "english": "Jasmine",
        "olfactory": "星夜绽放的吲哚腥甜",
        "tail_note": "茶汤浸泡后的清雅",
        "visual": "月光下的瓷白花簪",
        "impression": ["浪漫", "优雅", "神秘"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "tuberose": {
        "name": "夜来香",
        "english": "Tuberose",
        "olfactory": "乳脂般的丰腴白花",
        "tail_note": "近乎腐败的浓郁甜腻",
        "visual": "融化的奶油烛泪",
        "impression": ["丰腴", "浓郁", "性感"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "orange_blossom": {
        "name": "橙花",
        "english": "Orange Blossom",
        "olfactory": "苦橙叶的洁净皂感",
        "tail_note": "新娘捧花的幸福微甜",
        "visual": "蕾丝婚纱的织纹",
        "impression": ["洁净", "清新", "温柔"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "magnolia": {
        "name": "白兰花",
        "english": "Magnolia",
        "olfactory": "古典梳妆台的脂粉花香",
        "tail_note": "青柠檬皮的清爽中和",
        "visual": "民国月份牌上的手绘花卉",
        "impression": ["古典", "脂粉", "雅致"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "gardenia": {
        "name": "栀子花",
        "english": "Gardenia",
        "olfactory": "热带夏夜的奶油馥郁",
        "tail_note": "绿叶掐断的汁液青涩",
        "visual": "别在耳后的鹅黄油滴",
        "impression": ["馥郁", "奶油", "夏夜"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "iris": {
        "name": "鸢尾花",
        "english": "Iris",
        "olfactory": "紫根研磨的粉质感",
        "tail_note": "天鹅绒幕布般的奢华",
        "visual": "覆霜的紫罗兰矿石",
        "impression": ["粉感", "奢华", "神秘"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "damask_rose": {
        "name": "大马士革玫瑰",
        "english": "Damask Rose",
        "olfactory": "蜂蜜腌渍的深红花瓣",
        "tail_note": "葡萄酒窖的微醺感",
        "visual": "波斯细密画中的重瓣玫瑰",
        "impression": ["甜蜜", "浓郁", "浪漫"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "turkish_rose": {
        "name": "土耳其玫瑰",
        "english": "Turkish Rose",
        "olfactory": "干燥花苞的辛香粉感",
        "tail_note": "玫瑰果茶的酸甜尾韵",
        "visual": "奥斯曼宫殿的彩釉瓷砖",
        "impression": ["辛香", "粉感", "温暖"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "bulgarian_rose": {
        "name": "保加利亚玫瑰",
        "english": "Bulgarian Rose",
        "olfactory": "晨露中的新鲜玫瑰",
        "tail_note": "青茎折断的汁液绿意",
        "visual": "水晶瓶中的露水玫瑰",
        "impression": ["新鲜", "清新", "纯净"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "lily_of_valley": {
        "name": "铃兰",
        "english": "Lily of the Valley",
        "olfactory": "初雪覆盖的铃铛小花",
        "tail_note": "茎叶汁液的青绿锐利",
        "visual": "新娘头纱上的珍珠串",
        "impression": ["清冽", "纯净", "雅致"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "violet": {
        "name": "紫罗兰",
        "english": "Violet",
        "olfactory": "糖霜包裹的复古粉香",
        "tail_note": "鸢尾根的尘土粉感",
        "visual": "老式香粉盒里的干花",
        "impression": ["粉香", "复古", "温婉"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "freesia": {
        "name": "小苍兰",
        "english": "Freesia",
        "olfactory": "雨后花园的透明花香",
        "tail_note": "梨汁般的清甜水润",
        "visual": "玻璃花瓶中的水光折射",
        "impression": ["清透", "水润", "清新"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "hyacinth": {
        "name": "风信子",
        "english": "Hyacinth",
        "olfactory": "浓烈到刺鼻的蓝紫色花香",
        "tail_note": "根茎汁液的腥绿感",
        "visual": "拜占庭马赛克拼花",
        "impression": ["浓烈", "馥郁", "神秘"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "mimosa": {
        "name": "金合欢",
        "english": "Mimosa",
        "olfactory": "阳光晒过的金色花粉香",
        "tail_note": "杏仁奶油的绵密包裹",
        "visual": "普罗旺斯集市上的干花束",
        "impression": ["温暖", "绵密", "阳光"],
        "volatility": "后调",
        "duration": "6-10小时+"
    },
    "honeysuckle": {
        "name": "金银花",
        "english": "Honeysuckle",
        "olfactory": "藤蔓缠绕的蜜糖花香",
        "tail_note": "茶汤回甘的轻微涩感",
        "visual": "江南白墙垂落的绿蔓",
        "impression": ["甜蜜", "清新", "温婉"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "sunflower": {
        "name": "向日葵",
        "english": "Sunflower",
        "olfactory": "阳光烘焙的干燥花粉",
        "tail_note": "葵花籽油的坚果暖香",
        "visual": "梵高油画笔触的厚涂",
        "impression": ["干燥", "温暖", "明媚"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "ylang_ylang": {
        "name": "鸳鸯茉莉",
        "english": "Ylang-Ylang",
        "olfactory": "热带夜晚的甜腻白花",
        "tail_note": "香蕉熟透的发酵酒香",
        "visual": "巴厘岛神庙的花供",
        "impression": ["甜腻", "热带", "魅惑"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "frangipani": {
        "name": "鸡蛋花",
        "english": "Frangipani",
        "olfactory": "椰奶浸泡的温润花香",
        "tail_note": "热带树叶的青绿汁液",
        "visual": "少女鬓角的白色花朵",
        "impression": ["温润", "清新", "热带"],
        "volatility": "中调",
        "duration": "2-6小时"
    },
    "ginger_lily": {
        "name": "红姜花",
        "english": "Ginger Lily",
        "olfactory": "辛辣与甜美的奇异平衡",
        "tail_note": "姜汁撞奶的温热感",
        "visual": "东南亚祭坛上的鲜红花束",
        "impression": ["辛辣", "甜美", "温暖"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    },
    "sakura": {
        "name": "樱花",
        "english": "Sakura",
        "olfactory": "盐渍花瓣的淡咸",
        "tail_note": "落英缤纷的脆弱感",
        "visual": "和纸透出的粉晕",
        "impression": ["淡雅", "脆弱", "诗意"],
        "volatility": "前调",
        "duration": "0.5-2小时"
    }
}

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
            requests_list = [t for t in user_requests[user_ip] if current_time - t < REQUEST_WINDOW]
            if len(requests_list) >= REQUEST_LIMIT:
                remaining_time = REQUEST_WINDOW - (current_time - min(requests_list))
                return jsonify({
                    "error": f"请求频率过快，请等待{int(remaining_time/60)}分钟后再试"
                }), 429
            user_requests[user_ip] = requests_list
        else:
            user_requests[user_ip] = []
        
        user_requests[user_ip].append(current_time)
        
        # 解析请求数据
        data = request.json
        main_scent = data.get('mainScent')
        accents = data.get('accents', [])
        ai_provider = data.get('aiProvider', 'huggingface')  # 默认使用Hugging Face
        
        if not main_scent:
            return jsonify({"error": "请选择主香调"}), 400
        
        # 构建缓存键
        combo_key = f"{ai_provider}_{main_scent}_{'_'.join(sorted(accents))}"
        
        # 检查预生成内容池
        if combo_key in PRE_GENERATED_POOL:
            return jsonify(PRE_GENERATED_POOL[combo_key])
        
        # 检查缓存
        if combo_key in story_cache and current_time - cache_expire[combo_key] < CACHE_DURATION:
            return jsonify(story_cache[combo_key])
        
        # 构建提示词
        prompt = build_prompt(main_scent, accents)
        
        # 根据选择的AI提供商生成故事
        if ai_provider == 'deepseek':
            story = generate_with_deepseek(prompt)
        else:
            story = generate_with_huggingface(prompt)
        
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
            "ai_provider": ai_provider,
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

def generate_with_huggingface(prompt):
    """使用Hugging Face API生成故事"""
    if not hf_client:
        raise Exception("Hugging Face API未配置或初始化失败")
    
    response = hf_client.text_generation(
        prompt,
        max_new_tokens=300,
        temperature=0.7,
        top_p=0.9,
        wait_for_model=True
    )
    return response.strip()

def generate_with_deepseek(prompt):
    """使用DeepSeek API生成故事"""
    if not DEEPSEEK_API_KEY:
        raise Exception("DeepSeek API密钥未配置")
    
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 300
    }
    
    response = requests.post(DEEPSEEK_API_URL, headers=headers, json=data)
    
    if response.status_code != 200:
        raise Exception(f"DeepSeek API请求失败: {response.status_code} - {response.text}")
    
    result = response.json()
    return result['choices'][0]['message']['content'].strip()

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
    
    # 获取辅料的详细感官特征
    accent_details = []
    for accent in accents:
        if accent in FRUITY_INGREDIENTS:
            detail = FRUITY_INGREDIENTS[accent]
            accent_details.append({
                "name": detail["name"],
                "olfactory": detail["olfactory"],
                "tail_note": detail["tail_note"],
                "visual": detail["visual"],
                "impression": detail["impression"]
            })
    
    guardian = guardian_map.get(main_scent, "自然守护者")
    spirit = spirit_map.get(main_scent, "生命能量")
    
    # 构建详细的提示词
    prompt_parts = [
        f"主香调: {main_scent}",
        f"守护者: {guardian}",
        f"精神象征: {spirit}"
    ]
    
    if accent_details:
        prompt_parts.append("辅料特征:")
        for detail in accent_details:
            prompt_parts.append(f"- {detail['name']}: {detail['olfactory']}, 尾韵{detail['tail_note']}, 视觉{detail['visual']}, 印象{', '.join(detail['impression'])}")
    
    prompt_parts.append("请用150-200字描述一个关于这种香调的奇幻故事，展现其独特氛围和情感。避免敏感内容，语言优美有诗意。")
    
    return "\n".join(prompt_parts)

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