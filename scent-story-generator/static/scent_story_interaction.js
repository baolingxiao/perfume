document.addEventListener('DOMContentLoaded', () => {
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
  
  // 状态变量
  let selectedMainScent = null;
  const selectedAccents = new Set();
  let lastGeneratedTime = 0;
  const GENERATION_COOLDOWN = 600000; // 10分钟
  
  // 生成辅料按钮
  accentOptions.forEach(accent => {
    const button = document.createElement('button');
    button.className = `scent-btn bg-accent/10 hover:bg-accent/30 border border-accent/30 flex items-center justify-center`;
    button.style.color = accent.color;
    button.dataset.accent = accent.id;
    
    button.innerHTML = `
      <i class="fa ${accent.icon} mr-1"></i> ${accent.name}
    `;
    
    button.addEventListener('click', () => {
      button.classList.toggle('scent-btn-active');
      
      if (button.classList.contains('scent-btn-active')) {
        selectedAccents.add(accent.id);
      } else {
        selectedAccents.delete(accent.id);
      }
    });
    
    accentButtonsContainer.appendChild(button);
  });
  
  // 主香调按钮事件
  document.querySelectorAll('[data-scent]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-scent]').forEach(b => b.classList.remove('scent-btn-active'));
      btn.classList.add('scent-btn-active');
      selectedMainScent = btn.dataset.scent;
    });
  });
  
  // 生成按钮事件
  generateBtn.addEventListener('click', async () => {
    // 检查是否选择了主香调
    if (!selectedMainScent) {
      showToast('请先选择一种主香调', 'error');
      return;
    }
    
    // 频率限制检查
    const now = Date.now();
    if (now - lastGeneratedTime < GENERATION_COOLDOWN) {
      const remainingTime = Math.ceil((GENERATION_COOLDOWN - (now - lastGeneratedTime)) / 60000);
      showToast(`请求频率过快，请等待${remainingTime}分钟后再试`, 'warning');
      return;
    }
    
    // 显示加载状态
    showLoadingStory();
    
    try {
      // 发送请求到后端
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mainScent: selectedMainScent,
          accents: Array.from(selectedAccents)
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const storyData = await response.json();
      
      // 检查是否有错误
      if (storyData.error) {
        throw new Error(storyData.error);
      }
      
      // 显示生成的故事
      displayStory(storyData);
      
      // 更新最后生成时间
      lastGeneratedTime = now;
      
      showToast('故事生成成功！', 'success');
      
    } catch (error) {
      console.error('Error generating story:', error);
      showErrorStory(error.message);
      showToast('故事生成失败，请重试', 'error');
    }
  });
  
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
  
  // 显示生成的故事
  function displayStory(storyData) {
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
          <button id="regenerate-btn" class="text-primary hover:text-primary/80 transition-colors duration-300 flex items-center">
            <i class="fa fa-refresh mr-1"></i> 换一个故事
          </button>
          
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
      "citrus": "柑橘调",
      "spicy": "辛辣调",
      "oriental": "东方调",
      "fresh": "清新调",
      "aquatic": "水香调"
    };
    return scentMap[scentId] || scentId;
  }
}); 