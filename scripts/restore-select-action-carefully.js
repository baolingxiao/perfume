const fs = require('fs');

// 需要恢复的页面列表
const pagesToRestore = [
    '金银花.html', '栀子花.html', '金合欢.html', '檀香.html'
];

// 每个页面对应的香料名称和图片
const ingredientData = {
    '金银花.html': { name: '金银花', image: 'images/ingredients/金银花.jpeg' },
    '栀子花.html': { name: '栀子花', image: 'images/ingredients/栀子花.jpeg' },
    '金合欢.html': { name: '金合欢', image: 'images/ingredients/金合欢.jpeg' },
    '檀香.html': { name: '檀香', image: 'images/ingredients/檀香.jpeg' }
};

function restoreSelectAction(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否已经有select-action部分
        if (content.includes('select-action')) {
            console.log(`✅ ${filePath}: 已有select-action部分，跳过`);
            return;
        }
        
        // 检查是否缺少script部分
        if (!content.includes('<script>')) {
            console.log(`❌ ${filePath}: 缺少script部分，需要手动修复`);
            return;
        }
        
        // 在</main>标签后添加select-action部分
        const mainEndIndex = content.indexOf('</main>');
        if (mainEndIndex === -1) {
            console.log(`❌ ${filePath}: 找不到</main>标签`);
            return;
        }
        
        const ingredient = ingredientData[filePath];
        if (!ingredient) {
            console.log(`❌ ${filePath}: 找不到香料数据`);
            return;
        }
        
        // 构建select-action HTML
        const selectActionHTML = `
        <div class="select-action" style="display: flex;justify-content:center;margin:8px 0;">
            <div class="note-selection" style="display: flex;flex-direction:column;align-items:center;gap:12px;">
                <div style="font-size:14px;color:#666;margin-bottom:4px;">选择香调（三选一）：</div>
                <div style="display: flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                    <button class="note-select-btn exclusive" data-note="top">选择前调</button>
                    <button class="note-select-btn exclusive" data-note="heart">选择中调</button>
                    <button class="note-select-btn exclusive" data-note="base">选择尾调</button>
                </div>
                <div id="current-selection" style="font-size:12px;color:#28a745;margin-top:4px;display:none;">
                    <!-- 当前选择状态 -->
                </div>
            </div>
        </div>`;
        
        // 在</main>标签前插入select-action
        const beforeMain = content.substring(0, mainEndIndex);
        const afterMain = content.substring(mainEndIndex);
        
        // 检查script部分是否在main内
        const scriptIndex = content.indexOf('<script>');
        if (scriptIndex > mainEndIndex) {
            // script在main外，需要移到main内
            const scriptContent = content.substring(scriptIndex);
            const newContent = beforeMain + selectActionHTML + afterMain + scriptContent;
            fs.writeFileSync(filePath, newContent, 'utf8');
        } else {
            // script在main内，直接插入select-action
            const newContent = beforeMain + selectActionHTML + afterMain;
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
        
        console.log(`✅ ${filePath}: 已恢复select-action部分`);
        
    } catch (error) {
        console.error(`❌ ${filePath}: 修复失败 - ${error.message}`);
    }
}

console.log('🔧 开始小心地恢复select-action部分...\n');

pagesToRestore.forEach(file => {
    if (fs.existsSync(file)) {
        restoreSelectAction(file);
    } else {
        console.log(`⚠️  ${file}: 文件不存在`);
    }
});

console.log('\n🎉 select-action部分恢复完成！');
