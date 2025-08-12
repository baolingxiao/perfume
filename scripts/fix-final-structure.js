#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 开始最终HTML结构修复...');

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

        // 1. 修复HTML结构：确保选择按钮在main标签内部
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

        // 2. 确保选择按钮有完整的HTML结构
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

        // 3. 确保body标签有正确的类名
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

        // 4. 确保间距设置正确
        const spacingPattern = /margin:\s*\d+px\s*0/g;
        if (spacingPattern.test(content)) {
            content = content.replace(spacingPattern, 'margin:8px 0');
            console.log(`✅ ${file}: 统一间距为8px`);
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

console.log('🎉 最终HTML结构修复完成！');
