#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始全面修复HTML问题...');

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

        // 1. 修复HTML结构问题：将选择按钮移到main标签内部
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

        // 2. 修复缩进问题
        const wrongIndentPattern = /^(\s{8,})<div class="select-action"/gm;
        if (wrongIndentPattern.test(content)) {
            content = content.replace(wrongIndentPattern, '        <div class="select-action"');
            console.log(`✅ ${file}: 修复缩进`);
            hasChanges = true;
        }

        // 3. 修复多余的空行
        const extraNewlinesPattern = /\n\s*\n\s*\n/g;
        if (extraNewlinesPattern.test(content)) {
            content = content.replace(extraNewlinesPattern, '\n\n');
            console.log(`✅ ${file}: 修复多余空行`);
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

console.log('🎉 HTML问题全面修复完成！');
