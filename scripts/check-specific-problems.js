#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔍 开始检测特定问题页面...');

// 用户提到的有问题的页面
const problemPages = [
    '椰子.html', '香蕉.html', '风信子.html', '金银花.html', '栀子花.html', 
    '金合欢.html', '红姜花.html', '夜来香.html', '鸳鸯茉莉.html', '檀香.html', 
    '橡苔.html', '桦木焦油.html', '雪松醇.html'
];

problemPages.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        let problems = [];

        // 检查重复的选择按钮结构
        const duplicateSelectActionPattern = /<div class="select-action"[^>]*>[\s\S]*?<\/div>\s*<\/main>\s*<div class="select-action"[^>]*>[\s\S]*?<\/div>/g;
        if (duplicateSelectActionPattern.test(content)) {
            problems.push('重复的选择按钮结构');
        }

        // 检查HTML结构错误
        const wrongStructurePattern = /(\s*)<\/section>(\s*)<div class="select-action"[^>]*>[\s\S]*?<\/div>\s*<\/main>/g;
        if (wrongStructurePattern.test(content)) {
            problems.push('HTML结构错误');
        }

        // 检查main标签外的select-action
        const outsideMainPattern = /<\/main>\s*<div class="select-action"[^>]*>[\s\S]*?<\/div>/g;
        if (outsideMainPattern.test(content)) {
            problems.push('main标签外的select-action');
        }

        // 检查间距问题
        const spacingPattern24 = /margin:\s*24px\s*0/g;
        if (spacingPattern24.test(content)) {
            problems.push('间距是24px而不是8px');
        }

        // 检查body类名
        const bodyPattern = /<body([^>]*)>/g;
        const bodyMatch = bodyPattern.exec(content);
        if (bodyMatch && !bodyMatch[1].includes('ingredient-detail')) {
            problems.push('缺少ingredient-detail类');
        }

        if (problems.length > 0) {
            console.log(`❌ ${file}: ${problems.join(', ')}`);
        } else {
            console.log(`✅ ${file}: 无问题`);
        }
    } else {
        console.log(`❌ ${file}: 文件不存在`);
    }
});

console.log('\n🎉 检测完成！');
