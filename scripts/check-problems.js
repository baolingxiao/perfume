#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔍 开始检测所有问题...');

// 获取所有香料HTML文件
const ingredientFiles = fs.readdirSync('.').filter(file => 
    file.endsWith('.html') && 
    !file.startsWith('index') && 
    !file.startsWith('ingredients') &&
    !file.includes('scent-story-generator')
);

let problemFiles = [];

ingredientFiles.forEach(file => {
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
        const spacingPattern = /margin:\s*24px\s*0/g;
        if (spacingPattern.test(content)) {
            problems.push('间距不是8px');
        }

        // 检查body类名
        const bodyPattern = /<body([^>]*)>/g;
        const bodyMatch = bodyPattern.exec(content);
        if (bodyMatch && !bodyMatch[1].includes('ingredient-detail')) {
            problems.push('缺少ingredient-detail类');
        }

        if (problems.length > 0) {
            problemFiles.push({ file, problems });
            console.log(`❌ ${file}: ${problems.join(', ')}`);
        } else {
            console.log(`✅ ${file}: 无问题`);
        }
    }
});

console.log('\n📊 问题统计:');
console.log(`总文件数: ${ingredientFiles.length}`);
console.log(`有问题文件数: ${problemFiles.length}`);
console.log(`正常文件数: ${ingredientFiles.length - problemFiles.length}`);

if (problemFiles.length > 0) {
    console.log('\n🔧 需要修复的文件:');
    problemFiles.forEach(({ file, problems }) => {
        console.log(`  - ${file}: ${problems.join(', ')}`);
    });
} else {
    console.log('\n🎉 所有文件都正常！');
}
