//
// 🌸 香水工坊 - AI香气故事生成器交互脚本
// Last updated: 2025-07-01 15:27
// Author: Perfume Workshop Team
// Description: AI香气故事生成器的前端交互逻辑
//

// 幻界卡系统配置
const FANTASY_CARDS = {
  // 花香调幻界卡
  witch: {
    name: '女巫卡',
    description: '花香调≥70%，神秘而强大的女巫力量',
    color: '#9C27B0',
    bgColor: 'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 100%)',
    icon: 'fa-magic',
    borderColor: '#7B1FA2',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center'
  },
  dream: {
    name: '梦界卡',
    description: '花香调50%-70%，如梦似幻的梦境世界',
    color: '#E91E63',
    bgColor: 'linear-gradient(135deg, #F8BBD9 0%, #F48FB1 100%)',
    icon: 'fa-cloud',
    borderColor: '#C2185B'
  },
  flower: {
    name: '花卡',
    description: '花香调<50%，温柔绽放的花之精灵',
    color: '#FF5722',
    bgColor: 'linear-gradient(135deg, #FFCCBC 0%, #FFAB91 100%)',
    icon: 'fa-heart',
    borderColor: '#E64A19'
  },
  
  // 果香调幻界卡
  child: {
    name: '童子卡',
    description: '果香调≥70%，天真烂漫的精灵童子',
    color: '#4CAF50',
    bgColor: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
    icon: 'fa-child',
    borderColor: '#388E3C'
  },
  fox: {
    name: '狐狸卡',
    description: '果香调50%-70%，狡黠聪慧的九尾狐',
    color: '#FF9800',
    bgColor: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
    icon: 'fa-paw',
    borderColor: '#F57C00'
  },
  fruit: {
    name: '果卡',
    description: '果香调<50%，甜美诱人的果实精灵',
    color: '#FF5722',
    bgColor: 'linear-gradient(135deg, #FFCDD2 0%, #EF9A9A 100%)',
    icon: 'fa-apple',
    borderColor: '#D32F2F'
  },
  
  // 木香调幻界卡
  bard: {
    name: '咏者卡',
    description: '木香调≥70%，古老智慧的森林咏者',
    color: '#795548',
    bgColor: 'linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%)',
    icon: 'fa-music',
    borderColor: '#5D4037'
  },
  deer: {
    name: '岩鹿卡',
    description: '木香调50%-70%，优雅高贵的岩鹿',
    color: '#8D6E63',
    bgColor: 'linear-gradient(135deg, #D7CCC8 0%, #A1887F 100%)',
    icon: 'fa-leaf',
    borderColor: '#6D4C41'
  },
  smoke: {
    name: '烟卡',
    description: '木香调<50%，缥缈神秘的烟雾精灵',
    color: '#607D8B',
    bgColor: 'linear-gradient(135deg, #CFD8DC 0%, #B0BEC5 100%)',
    icon: 'fa-smoke',
    borderColor: '#455A64'
  }
};

// 香调分类规则
const SCENT_CATEGORIES = {
  floral: ['玫瑰', '茉莉', '薰衣草', '紫罗兰', '百合', '栀子花', '小苍兰', '铃兰', '风信子', '夜来香', '橙花', '鸳鸯茉莉', '金合欢', '金银花', '鸡蛋花', '鸢尾花', '白兰花', '红姜花'],
  fruity: ['苹果', '桃子', '柠檬', '青柠', '血橙', '柚子', '橙子', '柑橘', '金桔', '青苹果', '香柠檬', '草莓', '蓝莓', '覆盆子', '樱桃', '梨', '杏子', '李子', '芒果', '香蕉', '菠萝', '百香果', '椰子', '木瓜'],
  woody: ['檀香', '雪松', '广藿香', '岩兰草', '乌木', '橡木苔', '杉木', '柏木', '松木', '桦木焦油', '古巴香脂木', '橡苔', '雪松苔', '雪松醇']
};

// 全局状态变量
let selectedMainScent = null;
let selectedAccents = [];
let selectedAIProvider = 'openai'; // 默认使用ChatGPT
let lastGeneratedTime = 0;
const GENERATION_COOLDOWN = 20000; // 20秒
let currentCardType = 'story'; // 'story' 或 'fantasy'

document.addEventListener('DOMContentLoaded', () => {
  console.log('=== 香料检测调试开始 ===');
  
  // --- 新增：香料滑块UI与数据流 ---
  // 首先尝试从sessionStorage获取香料数据
  let selectedIngredients = [];
  
  console.log('1. 尝试从sessionStorage获取香料数据');
  selectedIngredients = JSON.parse(sessionStorage.getItem('selectedIngredients') || '[]');
  console.log('从sessionStorage selectedIngredients获取:', selectedIngredients);
  
  // 如果没有找到，尝试从sessionStorage selectedIngredientsByNote获取
  if (selectedIngredients.length === 0) {
    const selectedByNote = sessionStorage.getItem('selectedIngredientsByNote');
    console.log('2. sessionStorage selectedIngredientsByNote原始数据:', selectedByNote);
    
    if (selectedByNote) {
      try {
        const noteData = JSON.parse(selectedByNote);
        console.log('3. 解析后的noteData:', noteData);
        
        // 合并所有香调的香料
        selectedIngredients = [
          ...(noteData.top || []),
          ...(noteData.heart || []),
          ...(noteData.base || [])
        ];
        console.log('4. 合并后的香料:', selectedIngredients);
      } catch (e) {
        console.error('解析sessionStorage selectedIngredientsByNote失败:', e);
      }
    }
  } else {
    console.log('从sessionStorage selectedIngredients获取到香料:', selectedIngredients);
    // 如果从selectedIngredients获取到数据，需要转换为标准格式
    if (selectedIngredients.length > 0 && selectedIngredients[0].id) {
      console.log('检测到selectedIngredients格式，转换为标准格式');
      selectedIngredients = selectedIngredients.map(ing => ({
        name: ing.name,
        image: ing.image
      }));
      console.log('转换后的香料:', selectedIngredients);
    }
  }
  
  // 如果sessionStorage没有数据，尝试从localStorage获取（备用方案）
  if (selectedIngredients.length === 0) {
    console.log('5. sessionStorage无数据，尝试localStorage');
    selectedIngredients = JSON.parse(localStorage.getItem('selectedIngredients') || '[]');
    console.log('从localStorage selectedIngredients获取:', selectedIngredients);
    
    if (selectedIngredients.length === 0) {
      const selectedByNote = localStorage.getItem('selectedIngredientsByNote');
      console.log('6. localStorage selectedIngredientsByNote原始数据:', selectedByNote);
      
      if (selectedByNote) {
        try {
          const noteData = JSON.parse(selectedByNote);
          console.log('7. 解析后的noteData:', noteData);
          
          // 合并所有香调的香料
          selectedIngredients = [
            ...(noteData.top || []),
            ...(noteData.heart || []),
            ...(noteData.base || [])
          ];
          console.log('8. 合并后的香料:', selectedIngredients);
        } catch (e) {
          console.error('解析localStorage selectedIngredientsByNote失败:', e);
        }
      }
    }
  }
  
  // 如果还是没有找到，尝试从香料选择页面的数据格式获取
  if (selectedIngredients.length === 0) {
    console.log('5. 尝试其他方式获取香料数据...');
    // 检查是否有其他格式的数据
    const allKeys = Object.keys(localStorage);
    console.log('6. localStorage中的所有键:', allKeys);
    
    // 查找包含ingredient的键
    const ingredientKeys = allKeys.filter(key => key.includes('ingredient') || key.includes('selected'));
    console.log('7. 包含ingredient的键:', ingredientKeys);
    
    ingredientKeys.forEach(key => {
      console.log(`8. ${key}:`, localStorage.getItem(key));
    });
  }
  
  const sliderForm = document.getElementById('slider-form');
  const totalWarning = document.getElementById('total-warning');
  
  console.log('5. sliderForm元素:', sliderForm);
  console.log('6. selectedIngredients长度:', selectedIngredients.length);
  
  // 检查是否有从香料选择页面传递过来的数据
  if (sliderForm && selectedIngredients.length > 0) {
    // 显示香料滑块界面
    sliderForm.innerHTML = `
      <h2 class="text-lg sm:text-xl font-bold text-dark mb-3 sm:mb-4 flex items-center">
        <i class="fa fa-sliders text-primary mr-2"></i>调整香料比例
      </h2>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-blue-800 text-sm mb-2">
          <i class="fa fa-info-circle mr-1"></i>
          检测到您从香料选择页面传递的香料，请调整各香料的比例（总和需为100%）
        </p>
        <p class="text-blue-700 text-xs">
          <i class="fa fa-lightbulb-o mr-1"></i>
          您可以使用滑块或直接输入数字来调整比例
        </p>
      </div>
      ${selectedIngredients.map(ing => `
        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <label class="block font-bold mb-2 flex items-center justify-between">
            <span class="flex items-center">
              <img src="${ing.image.startsWith('/') ? ing.image : '/' + ing.image}" alt="${ing.name}" class="w-6 h-6 rounded-full mr-2 object-cover">
              ${ing.name}
            </span>
            <div class="flex items-center space-x-2">
              <input type="number" 
                     min="0" 
                     max="100" 
                     step="0.1" 
                     value="0" 
                     data-input-id="${ing.id}" 
                     class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                     placeholder="0">
              <span class="text-primary font-mono text-sm">%</span>
            </div>
          </label>
          <div class="flex items-center space-x-3">
            <input type="range" 
                   min="0" 
                   max="100" 
                   value="0" 
                   step="0.1" 
                   data-id="${ing.id}" 
                   class="flex-1 accent-primary slider" />
            <span id="val-${ing.id}" class="text-primary font-mono text-sm min-w-[3rem] text-center">0%</span>
          </div>
        </div>
      `).join('')}
      <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-yellow-800 font-medium">总比例：</span>
          <span id="total-percentage" class="text-yellow-800 font-bold text-lg">0%</span>
        </div>
        <div class="mt-2">
          <button id="auto-distribute-btn" class="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded transition-colors">
            <i class="fa fa-magic mr-1"></i>平均分配
          </button>
          <button id="reset-btn" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded ml-2 transition-colors">
            <i class="fa fa-refresh mr-1"></i>重置
          </button>
        </div>
      </div>
    `;
    
    // 隐藏传统的香调选择器
    const scentSelector = document.querySelector('.scent-selector');
    if (scentSelector) {
      const traditionalSelectors = scentSelector.querySelectorAll('h2, .grid');
      traditionalSelectors.forEach(element => {
        if (!element.closest('#slider-form')) {
          element.style.display = 'none';
        }
      });
    }
  }
  function updateTotal() {
    let total = 0;
    selectedIngredients.forEach(ing => {
      const slider = document.querySelector(`input[data-id="${ing.id}"]`);
      const input = document.querySelector(`input[data-input-id="${ing.id}"]`);
      const val = parseFloat(slider.value);
      
      // 同步滑块和输入框的值
      if (input) {
        input.value = val.toFixed(1);
      }
      
      document.getElementById(`val-${ing.id}`).textContent = val.toFixed(1);
      ing.ratio = val;
      total += val;
    });
    
    // 更新总比例显示
    const totalElement = document.getElementById('total-percentage');
    if (totalElement) {
      totalElement.textContent = total.toFixed(1) + '%';
      if (Math.abs(total - 100) <= 0.01) {
        totalElement.className = 'text-green-600 font-bold text-lg';
      } else if (total > 100) {
        totalElement.className = 'text-red-600 font-bold text-lg';
      } else {
        totalElement.className = 'text-yellow-800 font-bold text-lg';
      }
    }
    
    if (totalWarning) totalWarning.style.display = (Math.abs(total-100)>0.01) ? 'block' : 'none';
    return total;
  }
  
  // 添加输入框事件监听
  function setupInputEvents() {
    selectedIngredients.forEach(ing => {
      const slider = document.querySelector(`input[data-id="${ing.id}"]`);
      const input = document.querySelector(`input[data-input-id="${ing.id}"]`);
      
      if (slider && input) {
        // 滑块变化时更新输入框
        slider.addEventListener('input', () => {
          input.value = parseFloat(slider.value).toFixed(1);
          updateTotal();
        });
        
        // 输入框变化时更新滑块
        input.addEventListener('input', () => {
          let val = parseFloat(input.value) || 0;
          val = Math.max(0, Math.min(100, val)); // 限制在0-100之间
          slider.value = val;
          updateTotal();
        });
        
        // 输入框失去焦点时格式化
        input.addEventListener('blur', () => {
          input.value = parseFloat(input.value || 0).toFixed(1);
        });
      }
    });
  }
  
  // 平均分配功能
  function setupAutoDistribute() {
    const autoDistributeBtn = document.getElementById('auto-distribute-btn');
    if (autoDistributeBtn) {
      autoDistributeBtn.addEventListener('click', () => {
        const equalRatio = (100 / selectedIngredients.length).toFixed(1);
        selectedIngredients.forEach(ing => {
          const slider = document.querySelector(`input[data-id="${ing.id}"]`);
          const input = document.querySelector(`input[data-input-id="${ing.id}"]`);
          if (slider && input) {
            slider.value = equalRatio;
            input.value = equalRatio;
          }
        });
        updateTotal();
      });
    }
  }
  
  // 重置功能
  function setupReset() {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selectedIngredients.forEach(ing => {
          const slider = document.querySelector(`input[data-id="${ing.id}"]`);
          const input = document.querySelector(`input[data-input-id="${ing.id}"]`);
          if (slider && input) {
            slider.value = 0;
            input.value = 0;
          }
        });
        updateTotal();
      });
    }
  }
  
  if (sliderForm && selectedIngredients.length > 0) {
    // 初始化事件监听
    setupInputEvents();
    setupAutoDistribute();
    setupReset();
    updateTotal();
  }
  // --- END 新增 ---

  // 香调数据
  const accentOptions = [
    { id: 'rose', name: '玫瑰', icon: 'fa-heart', color: '#FF6B8B' },
    { id: 'jasmine', name: '茉莉', icon: 'fa-star', color: '#FFF59D' },
    { id: 'lavender', name: '薰衣草', icon: 'fa-leaf', color: '#B39DDB' },
    { id: 'cedar', name: '雪松', icon: 'fa-tree', color: '#8D6E63' },
    { id: 'sandalwood', name: '檀香', icon: 'fa-fire', color: '#A1887F' },
    { id: 'vanilla', name: '香草', icon: 'fa-sun-o', color: '#FFE0B2' },
    { id: 'bergamot', name: '佛手柑', icon: 'fa-lemon-o', color: '#FFF176' },
    { id: 'lemon', name: '柠檬', icon: 'fa-lemon-o', color: '#FFF59D' },
    { id: 'patchouli', name: '广藿香', icon: 'fa-pagelines', color: '#689F38' },
    { id: 'musk', name: '麝香', icon: 'fa-moon-o', color: '#BDBDBD' },
    { id: 'amber', name: '琥珀', icon: 'fa-sun-o', color: '#FFCC80' },
    { id: 'oud', name: '沉香', icon: 'fa-smoke', color: '#5D4037' },
    { id: 'cinnamon', name: '肉桂', icon: 'fa-fire', color: '#E57373' },
    { id: 'clove', name: '丁香', icon: 'fa-tint', color: '#795548' },
    { id: 'pepper', name: '胡椒', icon: 'fa-bolt', color: '#5D4037' },
    { id: 'violet', name: '紫罗兰', icon: 'fa-heart', color: '#9C27B0' },
    { id: 'lily', name: '百合', icon: 'fa-star-o', color: '#F5F5F5' },
    { id: 'mint', name: '薄荷', icon: 'fa-leaf', color: '#A5D6A7' },
    { id: 'apple', name: '苹果', icon: 'fa-apple', color: '#EF5350' },
    { id: 'peach', name: '桃子', icon: 'fa-lemon-o', color: '#FFCCBC' },
    { id: 'tonka', name: '零陵香豆', icon: 'fa-coffee', color: '#8D6E63' }
  ];
  
  // DOM元素
  const generateBtn = document.getElementById('generate-btn');
  const storyOutput = document.getElementById('story-output');
  const accentButtonsContainer = document.getElementById('accent-buttons');
  
  // AI提供商设置（只使用ChatGPT）
  selectedAIProvider = 'openai';
  const openaiBtn = document.querySelector('[data-ai="openai"]');
  if (openaiBtn) openaiBtn.classList.add('ring-2', 'ring-primary');
  
  // 主香调按钮事件
  document.querySelectorAll('[data-scent]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-scent]').forEach(b => b.classList.remove('scent-btn-active'));
      btn.classList.add('scent-btn-active');
      selectedMainScent = btn.dataset.scent;
    });
  });
  
  // 生成辅料按钮
  if (accentButtonsContainer) {
    accentButtonsContainer.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('scent-btn-active');
        const accentId = button.dataset.accent;
        if (button.classList.contains('scent-btn-active')) {
          if (!selectedAccents.includes(accentId)) selectedAccents.push(accentId);
        } else {
          selectedAccents = selectedAccents.filter(id => id !== accentId);
        }
      });
    });
  }
  
  // 更新生成按钮文本
  if (generateBtn && selectedIngredients.length > 0) {
    generateBtn.innerHTML = '<i class="fa fa-magic mr-2"></i>根据您的香料生成故事';
  }
  
  // 生成按钮事件
  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      // --- 新增：ingredients优先提交 ---
      if (selectedIngredients.length > 0) {
        if (Math.abs(updateTotal()-100)>0.01) {
          alert('比例总和必须为100%');
          return;
        }
        showLoadingStory();
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ingredients: selectedIngredients,
              aiProvider: selectedAIProvider
            })
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const storyData = await response.json();
          if (storyData.error) throw new Error(storyData.error);
          displayStory(storyData);
          lastGeneratedTime = Date.now();
          showToast('故事生成成功！', 'success');
        } catch (error) {
          console.error('Error generating story:', error);
          showErrorStory(error.message);
          showToast('故事生成失败，请重试', 'error');
        }
        return;
      }
      // --- END 新增 ---
      // 原有主香调/辅料逻辑
      if (!selectedMainScent) {
        showToast('请先选择一种主香调', 'error');
        return;
      }
      const now = Date.now();
      if (now - lastGeneratedTime < GENERATION_COOLDOWN) {
        const remainingTime = Math.ceil((GENERATION_COOLDOWN - (now - lastGeneratedTime)) / 60000);
        showToast(`请求频率过快，请等待${remainingTime}分钟后再试`, 'warning');
        return;
      }
      showLoadingStory();
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mainScent: selectedMainScent,
            accents: selectedAccents,
            aiProvider: selectedAIProvider
          })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const storyData = await response.json();
        if (storyData.error) throw new Error(storyData.error);
        displayStory(storyData);
        lastGeneratedTime = now;
        showToast('故事生成成功！', 'success');
      } catch (error) {
        console.error('Error generating story:', error);
        showErrorStory(error.message);
        showToast('故事生成失败，请重试', 'error');
      }
    });
  }
  
  // 显示加载中的故事
  function showLoadingStory() {
    storyOutput.innerHTML = `
      <div class="story-card loading">
        <h3 class="text-xl font-bold mb-3 text-dark/70">正在创作您的香气故事...</h3>
        <div class="prose max-w-none">
          <p class="text-dark/50 mb-2">AI正在根据您选择的香调组合构思一个奇幻故事</p>
          <p class="text-dark/50">这可能需要几秒钟时间...</p>
        </div>
      </div>
    `;
  }
  
  // 幻界卡分类逻辑
  function calculateScentRatios(ingredients) {
    const ratios = { floral: 0, fruity: 0, woody: 0 };
    let totalRatio = 0;
    
    ingredients.forEach(ing => {
      const ratio = ing.ratio || 0;
      totalRatio += ratio;
      
      // 根据香料名称分类
      if (SCENT_CATEGORIES.floral.includes(ing.name)) {
        ratios.floral += ratio;
      } else if (SCENT_CATEGORIES.fruity.includes(ing.name)) {
        ratios.fruity += ratio;
      } else if (SCENT_CATEGORIES.woody.includes(ing.name)) {
        ratios.woody += ratio;
      }
    });
    
    // 转换为百分比
    if (totalRatio > 0) {
      ratios.floral = (ratios.floral / totalRatio) * 100;
      ratios.fruity = (ratios.fruity / totalRatio) * 100;
      ratios.woody = (ratios.woody / totalRatio) * 100;
    }
    
    return ratios;
  }
  
  function determineFantasyCard(ratios) {
    // 找出占比最高的香调
    const maxScent = Object.keys(ratios).reduce((a, b) => ratios[a] > ratios[b] ? a : b);
    const maxRatio = ratios[maxScent];
    
    // 根据占比确定幻界卡类型
    if (maxScent === 'floral') {
      if (maxRatio >= 70) return 'witch';
      else if (maxRatio >= 50) return 'dream';
      else return 'flower';
    } else if (maxScent === 'fruity') {
      if (maxRatio >= 70) return 'child';
      else if (maxRatio >= 50) return 'fox';
      else return 'fruit';
    } else if (maxScent === 'woody') {
      if (maxRatio >= 70) return 'bard';
      else if (maxRatio >= 50) return 'deer';
      else return 'smoke';
    }
    
    return 'flower'; // 默认返回花卡
  }
  
  function createFantasyCard(cardType, ratios, storyData) {
    const card = FANTASY_CARDS[cardType];
    const generatedAt = new Date(storyData.generated_at * 1000).toLocaleString();
    
    // 构建图片显示区域
    let imageSection = '';
    if (card.image) {
      imageSection = `
        <div class="px-6 mb-6">
          <div class="flex justify-center">
            <div class="relative">
              <img src="${card.image}" alt="${card.name}" class="w-48 h-64 object-cover rounded-lg shadow-lg" style="border: 2px solid ${card.borderColor};">
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="fantasy-card animate-fade-in" style="background: ${card.bgColor}; border: 3px solid ${card.borderColor};">
        <div class="relative overflow-hidden rounded-xl">
          <!-- 卡片头部 -->
          <div class="flex justify-between items-start mb-6 p-6" style="color: ${card.color};">
            <div class="flex items-center">
              <i class="fa ${card.icon} text-4xl mr-4"></i>
              <div>
                <h3 class="text-3xl font-bold mb-2">${card.name}</h3>
                <p class="text-lg opacity-90">${card.description}</p>
              </div>
            </div>
            <span class="text-sm opacity-70">生成于 ${generatedAt}</span>
          </div>
          
          ${imageSection}
          
          <!-- 香调占比展示 -->
          <div class="px-6 mb-6">
            <h4 class="text-xl font-bold mb-4" style="color: ${card.color};">香调占比分析</h4>
            <div class="space-y-4">
              <!-- 花香调 -->
              <div class="bg-white/20 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold" style="color: ${card.color};">花香调</span>
                  <span class="font-bold text-lg" style="color: ${card.color};">${ratios.floral.toFixed(1)}%</span>
                </div>
                <div class="scent-progress">
                  <div class="scent-progress-bar" style="width: ${ratios.floral}%; background: linear-gradient(90deg, #E91E63, #9C27B0);"></div>
                </div>
              </div>
              
              <!-- 果香调 -->
              <div class="bg-white/20 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold" style="color: ${card.color};">果香调</span>
                  <span class="font-bold text-lg" style="color: ${card.color};">${ratios.fruity.toFixed(1)}%</span>
                </div>
                <div class="scent-progress">
                  <div class="scent-progress-bar" style="width: ${ratios.fruity}%; background: linear-gradient(90deg, #FF9800, #4CAF50);"></div>
                </div>
              </div>
              
              <!-- 木香调 -->
              <div class="bg-white/20 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold" style="color: ${card.color};">木香调</span>
                  <span class="font-bold text-lg" style="color: ${card.color};">${ratios.woody.toFixed(1)}%</span>
                </div>
                <div class="scent-progress">
                  <div class="scent-progress-bar" style="width: ${ratios.woody}%; background: linear-gradient(90deg, #795548, #8D6E63);"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 故事内容 -->
          <div class="px-6 mb-6">
            <h4 class="text-xl font-bold mb-3" style="color: ${card.color};">香气故事</h4>
            <div class="bg-white/30 p-4 rounded-lg backdrop-blur-sm">
              <p class="text-gray-800 leading-relaxed">${storyData.content}</p>
            </div>
          </div>
          
          <!-- 卡片底部操作 -->
          <div class="px-6 pb-6 flex justify-between items-center">
            <button id="switch-to-story-btn" class="px-4 py-2 rounded-lg transition-all duration-300 flex items-center hover:scale-105" 
                    style="background: ${card.color}; color: white; box-shadow: 0 4px 12px ${card.color}40;">
              <i class="fa fa-book mr-2"></i> 查看故事卡
            </button>
            
            <div class="flex space-x-3">
              <button class="text-gray-700 hover:text-white transition-colors duration-300 hover:scale-110">
                <i class="fa fa-heart-o"></i>
              </button>
              <button class="text-gray-700 hover:text-white transition-colors duration-300 hover:scale-110">
                <i class="fa fa-share-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  function switchCardType() {
    if (currentCardType === 'story') {
      // 切换到幻界卡
      const ratios = calculateScentRatios(selectedIngredients);
      const cardType = determineFantasyCard(ratios);
      const fantasyCardHTML = createFantasyCard(cardType, ratios, window.lastStoryData);
      storyOutput.innerHTML = fantasyCardHTML;
      currentCardType = 'fantasy';
      
      // 添加切换回故事卡的事件
      document.getElementById('switch-to-story-btn').addEventListener('click', () => {
        switchCardType();
      });
    } else {
      // 切换回故事卡
      displayStory(window.lastStoryData);
      currentCardType = 'story';
    }
  }
  
  // 显示生成的故事
  function displayStory(storyData) {
    // 保存故事数据到全局变量，供幻界卡使用
    window.lastStoryData = storyData;
    
    // 构建香调标签
    let scentTags = `<span class="inline-block px-3 py-1 bg-${storyData.scent}/10 text-${storyData.scent} rounded-full text-sm mr-2 mb-2">${getScentName(storyData.scent)}</span>`;
    
    storyData.accents.forEach(accent => {
      const accentInfo = accentOptions.find(a => a.id === accent);
      if (accentInfo) {
        scentTags += `<span class="inline-block px-3 py-1 bg-accent/10 rounded-full text-sm mr-2 mb-2" style="color: ${accentInfo.color}">${accentInfo.name}</span>`;
      }
    });
    
    // 格式化生成时间
    const generatedAt = new Date(storyData.generated_at * 1000).toLocaleString();
    
    // 如果有香料数据，添加幻界卡切换按钮
    let fantasyCardButton = '';
    if (selectedIngredients && selectedIngredients.length > 0) {
      const ratios = calculateScentRatios(selectedIngredients);
      const cardType = determineFantasyCard(ratios);
      const card = FANTASY_CARDS[cardType];
      
      fantasyCardButton = `
        <button id="switch-to-fantasy-btn" class="px-4 py-2 rounded-lg transition-all duration-300 flex items-center" 
                style="background: ${card.color}; color: white;">
          <i class="fa ${card.icon} mr-2"></i> 查看${card.name}
        </button>
      `;
    }
    
    storyOutput.innerHTML = `
      <div class="story-card animate-fade-in">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-2xl font-bold text-dark">${storyData.title}</h3>
          <span class="text-xs text-dark/50">生成于 ${generatedAt}</span>
        </div>
        
        <div class="mb-4">
          ${scentTags}
        </div>
        
        <div class="prose max-w-none">
          <p>${storyData.content}</p>
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div class="flex space-x-3">
            <button id="regenerate-btn" class="text-primary hover:text-primary/80 transition-colors duration-300 flex items-center">
              <i class="fa fa-refresh mr-1"></i> 换一个故事
            </button>
            ${fantasyCardButton}
          </div>
          
          <div class="flex space-x-3">
            <button class="text-dark/50 hover:text-primary transition-colors duration-300">
              <i class="fa fa-heart-o"></i>
            </button>
            <button class="text-dark/50 hover:text-primary transition-colors duration-300">
              <i class="fa fa-share-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // 为"换一个故事"按钮添加事件
    document.getElementById('regenerate-btn').addEventListener('click', () => {
      generateBtn.click();
    });
    
    // 为幻界卡切换按钮添加事件
    const fantasyBtn = document.getElementById('switch-to-fantasy-btn');
    if (fantasyBtn) {
      fantasyBtn.addEventListener('click', () => {
        switchCardType();
      });
    }
    
    // 重置卡片类型状态
    currentCardType = 'story';
  }
  
  // 显示错误故事
  function showErrorStory(message) {
    storyOutput.innerHTML = `
      <div class="story-card bg-red-50 border border-red-100">
        <h3 class="text-xl font-bold mb-3 text-red-600">故事生成失败</h3>
        <div class="prose max-w-none">
          <p class="text-red-500 mb-2">${message}</p>
          <p class="text-dark/50">请检查您的网络连接或稍后再试</p>
        </div>
      </div>
    `;
  }
  
  // 显示提示消息
  function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-500 opacity-0 translate-y-4`;
    
    // 设置样式
    if (type === 'success') {
      toast.classList.add('bg-green-50', 'border-l-4', 'border-green-400', 'text-green-700');
      toast.innerHTML = `<i class="fa fa-check-circle mr-2"></i> ${message}`;
    } else if (type === 'error') {
      toast.classList.add('bg-red-50', 'border-l-4', 'border-red-400', 'text-red-700');
      toast.innerHTML = `<i class="fa fa-exclamation-circle mr-2"></i> ${message}`;
    } else if (type === 'warning') {
      toast.classList.add('bg-yellow-50', 'border-l-4', 'border-yellow-400', 'text-yellow-700');
      toast.innerHTML = `<i class="fa fa-exclamation-triangle mr-2"></i> ${message}`;
    } else {
      toast.classList.add('bg-blue-50', 'border-l-4', 'border-blue-400', 'text-blue-700');
      toast.innerHTML = `<i class="fa fa-info-circle mr-2"></i> ${message}`;
    }
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-y-4');
    }, 10);
    
    // 3秒后隐藏
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }
  
  // 获取香调名称
  function getScentName(scentId) {
    const scentMap = {
      "floral": "花香调",
      "woody": "木香调",
      "fruity": "果香调",
      "oriental": "东方调"
    };
    return scentMap[scentId] || scentId;
  }
});

// 自动集成全站锚点平滑滚动
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });
} 