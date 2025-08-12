#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始修复香料详情页面...');

// 需要修复的图片路径映射
const imagePathFixes = {
    '金桔.jpg': '金桔.jpeg'
};

// 需要修复的HTML文件列表
const ingredientFiles = [
    '金桔.html'
    // 可以添加更多需要修复的文件
];

ingredientFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let hasChanges = false;
        
        // 修复图片路径
        Object.entries(imagePathFixes).forEach(([oldPath, newPath]) => {
            if (content.includes(oldPath)) {
                content = content.replace(new RegExp(oldPath, 'g'), newPath);
                console.log(`✅ ${file}: 修复图片路径 ${oldPath} → ${newPath}`);
                hasChanges = true;
            }
        });
        
        // 修复间距
        if (content.includes('margin:24px 0')) {
            content = content.replace(/margin:24px 0/g, 'margin:12px 0');
            console.log(`✅ ${file}: 修复间距 24px → 12px`);
            hasChanges = true;
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

console.log('🎉 香料详情页面修复完成！');
