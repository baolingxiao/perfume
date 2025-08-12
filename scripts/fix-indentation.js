#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始统一HTML缩进...');

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

        // 修复选择按钮区域的缩进
        // 查找并替换错误的缩进
        const wrongIndentPattern = /^(\s{8,})<div class="select-action"/gm;
        const match = wrongIndentPattern.exec(content);
        
        if (match) {
            // 替换为正确的8个空格缩进
            content = content.replace(wrongIndentPattern, '        <div class="select-action"');
            console.log(`✅ ${file}: 修复缩进`);
            hasChanges = true;
        }

        if (hasChanges) {
            fs.writeFileSync(file, content);
            console.log(`✅ ${file}: 缩进修复完成`);
        } else {
            console.log(`ℹ️ ${file}: 缩进已正确`);
        }
    }
});

console.log('🎉 HTML缩进统一完成！');
