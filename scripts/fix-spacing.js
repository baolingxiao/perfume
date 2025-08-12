#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始统一香料页面间距...');

// 获取所有香料HTML文件
const ingredientFiles = fs.readdirSync('.').filter(file => 
    file.endsWith('.html') && 
    !file.startsWith('index') && 
    !file.startsWith('ingredients') &&
    !file.includes('scent-story-generator')
);

ingredientFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let hasChanges = false;

        // 1. 修复HTML结构问题：确保选择按钮在main标签内部
        const wrongStructurePattern = /(\s*)<\/div>(\s*)<div class="select-action"[^>]*>[\s\S]*?<\/div>\s*<\/main>/g;
        const match = wrongStructurePattern.exec(content);
        
        if (match) {
            // 提取选择按钮的HTML内容
            const fullMatch = match[0];
            const selectActionMatch = /<div class="select-action"[^>]*>[\s\S]*?<\/div>/s.exec(fullMatch);
            
            if (selectActionMatch) {
                const selectActionHTML = selectActionMatch[0];
                
                // 替换错误的结构为正确的结构
                const correctStructure = `        ${selectActionHTML}
    </main>`;
                
                content = content.replace(wrongStructurePattern, correctStructure);
                console.log(`✅ ${file}: 修复HTML结构`);
                hasChanges = true;
            }
        }

        // 2. 统一间距设置：将margin改为8px
        const spacingPattern = /margin:(\s*)(\d+)px(\s*)0/g;
        if (spacingPattern.test(content)) {
            content = content.replace(spacingPattern, 'margin:$18px$30');
            console.log(`✅ ${file}: 统一间距为8px`);
            hasChanges = true;
        }

        // 3. 确保选择按钮在main标签内部
        const mainEndPattern = /<\/main>\s*<!-- 选择按钮 -->/g;
        if (mainEndPattern.test(content)) {
            content = content.replace(mainEndPattern, '');
            console.log(`✅ ${file}: 移除错误的注释`);
            hasChanges = true;
        }

        if (hasChanges) {
            fs.writeFileSync(file, content);
            console.log(`✅ ${file}: 修复完成`);
        } else {
            console.log(`ℹ️ ${file}: 无需修复`);
        }
    }
});

console.log('🎉 间距统一完成！');
