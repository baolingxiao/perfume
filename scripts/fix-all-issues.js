#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始全面修复所有问题...');

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

        // 1. 移除所有重复的选择按钮结构
        const duplicateSelectActionPattern = /<div class="select-action"[^>]*>[\s\S]*?<\/div>\s*<\/main>\s*<div class="select-action"[^>]*>[\s\S]*?<\/div>/g;
        if (duplicateSelectActionPattern.test(content)) {
            // 保留第一个select-action，移除后面的重复
            content = content.replace(duplicateSelectActionPattern, (match) => {
                const firstMatch = /<div class="select-action"[^>]*>[\s\S]*?<\/div>\s*<\/main>/s.exec(match);
                return firstMatch ? firstMatch[0] : match;
            });
            console.log(`✅ ${file}: 移除重复的选择按钮结构`);
            hasChanges = true;
        }

        // 2. 修复HTML结构：确保选择按钮在main标签内部
        const wrongStructurePattern = /(\s*)<\/section>(\s*)<div class="select-action"[^>]*>[\s\S]*?<\/div>\s*<\/main>/g;
        const match = wrongStructurePattern.exec(content);
        
        if (match) {
            // 提取选择按钮的HTML内容
            const fullMatch = match[0];
            const selectActionMatch = /<div class="select-action"[^>]*>[\s\S]*?<\/div>/s.exec(fullMatch);
            
            if (selectActionMatch) {
                const selectActionHTML = selectActionMatch[0];
                
                // 替换错误的结构为正确的结构
                const correctStructure = `            </section>
        </div>
        ${selectActionHTML}
    </main>`;
                
                content = content.replace(wrongStructurePattern, correctStructure);
                console.log(`✅ ${file}: 修复HTML结构`);
                hasChanges = true;
            }
        }

        // 3. 确保选择按钮有完整的HTML结构
        const incompleteSelectActionPattern = /<div class="select-action"[^>]*>[\s\S]*?<div style="font-size:14px;color:#666;margin-bottom:4px;">选择香调（三选一）：<\/div>\s*<\/main>/g;
        if (incompleteSelectActionPattern.test(content)) {
            // 添加缺失的按钮和结构
            const completeSelectAction = `<div class="select-action" style="display:flex;justify-content:center;margin:8px 0;">
            <div class="note-selection" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                <div style="font-size:14px;color:#666;margin-bottom:4px;">选择香调（三选一）：</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                    <button class="note-select-btn exclusive" data-note="top">选择前调</button>
                    <button class="note-select-btn exclusive" data-note="heart">选择中调</button>
                    <button class="note-select-btn exclusive" data-note="base">选择尾调</button>
                </div>
                <div id="current-selection" style="font-size:12px;color:#28a745;margin-top:4px;display:none;">
                    <!-- 当前选择状态 -->
                </div>
            </div>
        </div>`;
            
            content = content.replace(incompleteSelectActionPattern, completeSelectAction + '\n    </main>');
            console.log(`✅ ${file}: 补全选择按钮结构`);
            hasChanges = true;
        }

        // 4. 移除main标签外的所有select-action
        const outsideMainPattern = /<\/main>\s*<div class="select-action"[^>]*>[\s\S]*?<\/div>/g;
        if (outsideMainPattern.test(content)) {
            content = content.replace(outsideMainPattern, '</main>');
            console.log(`✅ ${file}: 移除main标签外的select-action`);
            hasChanges = true;
        }

        // 5. 确保body标签有正确的类名
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

        // 6. 统一间距设置
        const spacingPattern = /margin:\s*\d+px\s*0/g;
        if (spacingPattern.test(content)) {
            content = content.replace(spacingPattern, 'margin:8px 0');
            console.log(`✅ ${file}: 统一间距为8px`);
            hasChanges = true;
        }

        // 7. 修复display属性
        const displayFlexPattern = /display:\s*flex/g;
        if (displayFlexPattern.test(content)) {
            content = content.replace(displayFlexPattern, 'display: flex');
            console.log(`✅ ${file}: 修复display属性`);
            hasChanges = true;
        }

        // 8. 移除多余的空行和缩进
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        content = content.replace(/\t/g, '    ');

        if (hasChanges) {
            fs.writeFileSync(file, content);
            console.log(`✅ ${file}: 修复完成`);
        } else {
            console.log(`ℹ️ ${file}: 无需修复`);
        }
    }
});

console.log('🎉 全面修复完成！');
