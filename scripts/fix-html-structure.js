#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始修复HTML结构问题...');

// 需要修复的HTML文件列表（有问题的文件）
const problematicFiles = [
    '桦木焦油.html',
    '椰子.html',
    '夜来香.html',
    '血橙.html',
    '香槟白兰地.html',
    '红姜花.html',
    '香柠檬.html',
    '鸳鸯茉莉.html',
    '鸢尾花.html',
    '茉莉.html',
    '白兰花.html',
    '橡木苔.html',
    '青苹果.html',
    '紫罗兰.html',
    '雪松醇.html',
    '风信子.html',
    '土耳其玫瑰.html',
    '菠萝.html',
    '樱花.html',
    '雪松苔.html',
    '铃兰.html',
    '百香果.html',
    '黑加仑.html',
    '鸡蛋花.html',
    '松木.html',
    '覆盆子.html'
];

problematicFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let hasChanges = false;

        // 使用正则表达式来精确修复HTML结构
        // 1. 移除错误的HTML结构
        const wrongPattern = /(\s*)<!-- 选择按钮 -->\s*<div class="select-action"[^>]*>[\s\S]*?<\/div>\s*<\/main>/g;
        const match = wrongPattern.exec(content);
        
        if (match) {
            // 2. 提取选择按钮的HTML内容
            const fullMatch = match[0];
            const selectActionMatch = /<div class="select-action"[^>]*>[\s\S]*?<\/div>/s.exec(fullMatch);
            
            if (selectActionMatch) {
                const selectActionHTML = selectActionMatch[0];
                
                // 3. 替换错误的结构为正确的结构
                const correctStructure = `        ${selectActionHTML}
    </main>`;
                
                content = content.replace(wrongPattern, correctStructure);
                
                console.log(`✅ ${file}: 修复HTML结构`);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            fs.writeFileSync(file, content);
            console.log(`✅ ${file}: 修复完成`);
        } else {
            console.log(`ℹ️ ${file}: 无需修复`);
        }
    } else {
        console.log(`⚠️ 文件不存在: ${file}`);
    }
});

console.log('🎉 HTML结构修复完成！');
