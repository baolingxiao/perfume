const fs = require('fs');
const path = require('path');

// 获取所有香料详情页面
const ingredientFiles = [
    '椰子.html', '香蕉.html', '风信子.html', '金银花.html', '栀子花.html', 
    '金合欢.html', '红姜花.html', '夜来香.html', '鸳鸯茉莉.html', '檀香.html', 
    '橡苔.html', '桦木焦油.html', '雪松醇.html'
];

function fixHtmlStructure(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        // 1. 移除重复的HTML结构（在</main>标签后的重复内容）
        const mainEndIndex = content.indexOf('</main>');
        if (mainEndIndex !== -1) {
            const afterMain = content.substring(mainEndIndex + 7);
            // 检查是否有重复的按钮结构
            if (afterMain.includes('note-select-btn') || afterMain.includes('选择前调')) {
                content = content.substring(0, mainEndIndex + 7) + '\n\n    <script>';
                hasChanges = true;
                console.log(`✅ ${filePath}: 移除了重复的HTML结构`);
            }
        }
        
        // 2. 确保select-action的margin是8px 0
        content = content.replace(
            /<div class="select-action"[^>]*style="[^"]*margin:[^"]*"/g,
            '<div class="select-action" style="display: flex;justify-content:center;margin:8px 0;"'
        );
        
        // 3. 确保正确的HTML结构
        if (!content.includes('class="ingredient-detail"')) {
            content = content.replace(
                /<body[^>]*>/,
                '<body style="background: var(--background-color);" class="ingredient-detail">'
            );
            hasChanges = true;
        }
        
        // 4. 确保script标签在body内
        if (!content.includes('</body>')) {
            content = content.replace('</html>', '    </script>\n</body>\n</html>');
            hasChanges = true;
        }
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${filePath}: 修复完成`);
        } else {
            console.log(`✅ ${filePath}: 无需修复`);
        }
        
    } catch (error) {
        console.error(`❌ ${filePath}: 修复失败 - ${error.message}`);
    }
}

console.log('🔧 开始修复HTML结构问题...\n');

ingredientFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fixHtmlStructure(file);
    } else {
        console.log(`⚠️  ${file}: 文件不存在`);
    }
});

console.log('\n🎉 HTML结构修复完成！');
