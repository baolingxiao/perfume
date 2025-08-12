#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 恢复到今天下午3点的"已选择的香料"样式...');

// 恢复到提交29f02fb的样式
const targetCommit = '29f02fb';

// 恢复CSS文件
const cssFile = 'css/ingredients_15-30.css';
if (fs.existsSync(cssFile)) {
    try {
        // 获取目标提交的CSS内容
        const { execSync } = require('child_process');
        const targetCSS = execSync(`git show ${targetCommit}:css/ingredients_15-30.css`, { encoding: 'utf8' });
        
        // 写入当前文件
        fs.writeFileSync(cssFile, targetCSS);
        console.log('✅ 已恢复CSS文件到下午3点版本');
        
        // 恢复HTML文件中的"已选择的香料"部分
        const htmlFile = 'ingredients_15-30.html';
        if (fs.existsSync(htmlFile)) {
            const currentHTML = fs.readFileSync(htmlFile, 'utf8');
            const targetHTML = execSync(`git show ${targetCommit}:ingredients_15-30.html`, { encoding: 'utf8' });
            
            // 提取目标HTML中的"已选择的香料"部分
            const selectedIngredientsPattern = /<!-- 已选香料展示区 -->[\s\S]*?<\/div>\s*<\/main>/;
            const targetMatch = targetHTML.match(selectedIngredientsPattern);
            
            if (targetMatch) {
                const targetSelectedIngredients = targetMatch[0];
                
                // 替换当前HTML中的"已选择的香料"部分
                const updatedHTML = currentHTML.replace(selectedIngredientsPattern, targetSelectedIngredients);
                fs.writeFileSync(htmlFile, updatedHTML);
                console.log('✅ 已恢复HTML中的"已选择的香料"部分');
            } else {
                console.log('❌ 在目标版本中未找到"已选择的香料"部分');
            }
        }
        
    } catch (error) {
        console.log('❌ 恢复失败:', error.message);
        
        // 如果git命令失败，手动恢复关键样式
        console.log('🔄 尝试手动恢复样式...');
        
        const currentCSS = fs.readFileSync(cssFile, 'utf8');
        let updatedCSS = currentCSS;
        
        // 恢复.selected-ingredients样式
        const selectedIngredientsPattern = /\.selected-ingredients\s*\{[\s\S]*?\}/g;
        const correctSelectedIngredients = `.selected-ingredients {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: var(--spacing);
    margin-top: var(--spacing);
}`;
        
        updatedCSS = updatedCSS.replace(selectedIngredientsPattern, correctSelectedIngredients);
        
        // 恢复.note-section样式
        const noteSectionPattern = /\.note-section\s*\{[\s\S]*?\}/g;
        const correctNoteSection = `.note-section {
    margin-bottom: 20px;
}`;
        
        updatedCSS = updatedCSS.replace(noteSectionPattern, correctNoteSection);
        
        // 恢复.slot-item样式
        const slotItemPattern = /\.slot-item\s*\{[\s\S]*?width: 50px;[\s\S]*?height: 50px;[\s\S]*?\}/g;
        const correctSlotItem = `.slot-item {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #ddd;
    background: #f8f9fa;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}`;
        
        updatedCSS = updatedCSS.replace(slotItemPattern, correctSlotItem);
        
        fs.writeFileSync(cssFile, updatedCSS);
        console.log('✅ 手动恢复样式完成');
    }
} else {
    console.log('❌ CSS文件不存在');
}

console.log('🎉 恢复到下午3点样式完成！');
