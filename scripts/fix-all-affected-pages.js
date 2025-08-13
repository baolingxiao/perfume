const fs = require('fs');

// 需要修复的页面和对应的香料数据
const pagesToFix = [
    { file: '椰子.html', name: '椰子', image: 'images/ingredients/椰子.jpeg' },
    { file: '风信子.html', name: '风信子', image: 'images/ingredients/风信子.jpeg' },
    { file: '栀子花.html', name: '栀子花', image: 'images/ingredients/栀子花.jpeg' },
    { file: '金合欢.html', name: '金合欢', image: 'images/ingredients/金合欢.jpeg' },
    { file: '红姜花.html', name: '红姜花', image: 'images/ingredients/红姜花.jpeg' },
    { file: '夜来香.html', name: '夜来香', image: 'images/ingredients/夜来香.jpeg' },
    { file: '鸳鸯茉莉.html', name: '鸳鸯茉莉', image: 'images/ingredients/鸳鸯茉莉.jpeg' },
    { file: '檀香.html', name: '檀香', image: 'images/ingredients/檀香.jpeg' },
    { file: '橡苔.html', name: '橡苔', image: 'images/ingredients/橡苔.jpeg' },
    { file: '桦木焦油.html', name: '桦木焦油', image: 'images/ingredients/桦木焦油.jpeg' },
    { file: '雪松醇.html', name: '雪松醇', image: 'images/ingredients/雪松醇.jpeg' }
];

function generateJavaScript(ingredientName, ingredientImage) {
    return `
        // 显示成功提示
        function showSuccessToast(message) {
            // 移除已存在的提示
            const existingToast = document.querySelector('.success-toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            const toast = document.createElement('div');
            toast.className = 'success-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // 显示动画
            setTimeout(() => toast.classList.add('show'), 10);
            
            // 3秒后隐藏
            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // 获取已选择的香料数据
        function getSelectedIngredients() {
            try {
                const data = JSON.parse(localStorage.getItem('selectedIngredientsByNote') || '{}');
                return {
                    top: data.top || [],
                    heart: data.heart || [],
                    base: data.base || []
                };
            } catch(e) {
                return { top: [], heart: [], base: [] };
            }
        }
        
        // 保存已选择的香料数据
        function saveSelectedIngredients(data) {
            localStorage.setItem('selectedIngredientsByNote', JSON.stringify(data));
        }

        // 选择香料到指定香调（三选一模式）
        function selectIngredientToNote(noteType) {
            const ingredientName = '${ingredientName}';
            const ingredientImage = '${ingredientImage}';
            
            const ingredient = {
                name: ingredientName,
                image: ingredientImage
            };
            
            const selected = getSelectedIngredients();
            
            // 检查是否已经在其他香调中选择了这个香料
            const currentNote = getCurrentSelectedNote();
            if (currentNote && currentNote !== noteType) {
                // 从当前香调中移除
                const currentIngredients = selected[currentNote];
                const index = currentIngredients.findIndex(item => item.name === ingredient.name);
                if (index > -1) {
                    currentIngredients.splice(index, 1);
                }
            }
            
            const noteIngredients = selected[noteType];
            
            // 检查是否已存在于该香调
            const exists = noteIngredients.some(item => item.name === ingredient.name);
            if (exists) {
                // 如果已存在，则移除（取消选择）
                const index = noteIngredients.findIndex(item => item.name === ingredient.name);
                noteIngredients.splice(index, 1);
                saveSelectedIngredients(selected);
                
                const noteNames = { top: '前调', heart: '中调', base: '尾调' };
                showSuccessToast(\`已从\${noteNames[noteType]}中移除 \${ingredient.name}\`);
                
                updateButtonStates();
                
                // 通知主页面数据已更新
                try {
                    if (window.opener && window.opener.renderSelectedIngredients) {
                        window.opener.renderSelectedIngredients();
                    }
                    // 尝试通过localStorage事件通知
                    localStorage.setItem('selectedIngredientsByNote_trigger', Date.now().toString());
                } catch(e) {
                    console.log('无法通知主页面更新');
                }
                return;
            }
            
            // 检查是否已满
            if (noteIngredients.length >= 5) {
                showSuccessToast('该香调已满，最多只能选择5种香料');
                return;
            }
            
            // 添加香料
            noteIngredients.push(ingredient);
            saveSelectedIngredients(selected);
            
            const noteNames = { top: '前调', heart: '中调', base: '尾调' };
            showSuccessToast(\`已将 \${ingredient.name} 添加到\${noteNames[noteType]} (\${noteIngredients.length}/5)\`);
            
            updateButtonStates();
            
            // 通知主页面数据已更新
            try {
                if (window.opener && window.opener.renderSelectedIngredients) {
                    window.opener.renderSelectedIngredients();
                }
                // 尝试通过localStorage事件通知
                localStorage.setItem('selectedIngredientsByNote_trigger', Date.now().toString());
            } catch(e) {
                console.log('无法通知主页面更新');
            }
        }
        
        // 获取当前香料选择在哪个香调中
        function getCurrentSelectedNote() {
            const ingredientName = '${ingredientName}';
            const selected = getSelectedIngredients();
            
            for (const [noteType, ingredients] of Object.entries(selected)) {
                if (ingredients.some(item => item.name === ingredientName)) {
                    return noteType;
                }
            }
            return null;
        }
        
        // 更新按钮状态
        function updateButtonStates() {
            const ingredientName = '${ingredientName}';
            const selected = getSelectedIngredients();
            const currentNote = getCurrentSelectedNote();
            const currentSelectionDiv = document.getElementById('current-selection');
            
            document.querySelectorAll('.note-select-btn').forEach(btn => {
                const noteType = btn.dataset.note;
                const noteIngredients = selected[noteType];
                
                // 检查是否已在该香调中
                const exists = noteIngredients.some(item => item.name === ingredientName);
                
                if (exists) {
                    btn.textContent = btn.dataset.note === 'top' ? '已选前调 ✓' : 
                                     btn.dataset.note === 'heart' ? '已选中调 ✓' : '已选尾调 ✓';
                    btn.style.background = '#28a745';
                    btn.style.color = 'white';
                    btn.style.border = '2px solid #28a745';
                } else {
                    btn.textContent = btn.dataset.note === 'top' ? '选择前调' : 
                                     btn.dataset.note === 'heart' ? '选择中调' : '选择尾调';
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.border = '';
                }
            });
            
            // 更新当前选择状态显示
            if (currentNote) {
                const noteNames = { top: '前调', heart: '中调', base: '尾调' };
                currentSelectionDiv.textContent = \`当前选择：\${noteNames[currentNote]}\`;
                currentSelectionDiv.style.display = 'block';
            } else {
                currentSelectionDiv.style.display = 'none';
            }
        }
        
        // 页面加载时初始化
        document.addEventListener('DOMContentLoaded', function() {
            // 绑定按钮事件
            document.querySelectorAll('.note-select-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    selectIngredientToNote(btn.dataset.note);
                });
            });
            
            // 更新按钮状态
            updateButtonStates();
        });`;
}

function fixPage(pageData) {
    try {
        const { file, name, image } = pageData;
        let content = fs.readFileSync(file, 'utf8');
        
        // 检查是否需要添加select-action
        if (!content.includes('select-action')) {
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
            const mainEndIndex = content.indexOf('</main>');
            if (mainEndIndex !== -1) {
                const beforeMain = content.substring(0, mainEndIndex);
                const afterMain = content.substring(mainEndIndex);
                content = beforeMain + selectActionHTML + afterMain;
            }
        }
        
        // 检查是否需要添加JavaScript逻辑
        if (!content.includes('selectIngredientToNote')) {
            const scriptIndex = content.indexOf('<script>');
            if (scriptIndex !== -1) {
                const scriptEndIndex = content.indexOf('</script>', scriptIndex);
                if (scriptEndIndex !== -1) {
                    // 替换空的script标签
                    const beforeScript = content.substring(0, scriptIndex);
                    const afterScript = content.substring(scriptEndIndex + 8);
                    const newScript = '<script>' + generateJavaScript(name, image) + '</script>';
                    content = beforeScript + newScript + afterScript;
                }
            }
        }
        
        // 确保有正确的HTML结构
        if (!content.includes('</body>')) {
            content = content.replace('</html>', '</body>\n</html>');
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ ${file}: 修复完成`);
        
    } catch (error) {
        console.error(`❌ ${file}: 修复失败 - ${error.message}`);
    }
}

console.log('🔧 开始安全地修复所有被影响的页面...\n');

pagesToFix.forEach(pageData => {
    if (fs.existsSync(pageData.file)) {
        fixPage(pageData);
    } else {
        console.log(`⚠️  ${pageData.file}: 文件不存在`);
    }
});

console.log('\n🎉 所有页面修复完成！');
