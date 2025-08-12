#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始修复香料详情页面的body类...');

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

        // 1. 确保body标签有正确的类名
        const bodyPattern = /<body([^>]*)>/g;
        const bodyMatch = bodyPattern.exec(content);
        
        if (bodyMatch) {
            const bodyAttributes = bodyMatch[1];
            
            // 检查是否已经有ingredient-detail类
            if (!bodyAttributes.includes('ingredient-detail')) {
                // 添加ingredient-detail类
                const newBodyTag = `<body${bodyAttributes} class="ingredient-detail">`;
                content = content.replace(bodyPattern, newBodyTag);
                console.log(`✅ ${file}: 添加ingredient-detail类`);
                hasChanges = true;
            }
        }

        // 2. 确保选择按钮的样式正确
        const selectActionPattern = /<div class="select-action"[^>]*>/g;
        if (selectActionPattern.test(content)) {
            // 确保margin设置正确
            content = content.replace(
                /margin:\s*\d+px\s*0/g,
                'margin: 8px 0'
            );
            console.log(`✅ ${file}: 确保间距设置正确`);
            hasChanges = true;
        }

        // 3. 移除任何可能影响显示的CSS
        const displayNonePattern = /display:\s*none/g;
        if (displayNonePattern.test(content)) {
            content = content.replace(displayNonePattern, 'display: flex');
            console.log(`✅ ${file}: 修复display属性`);
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

console.log('🎉 body类修复完成！');
