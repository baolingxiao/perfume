#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔧 恢复"已选择的香料"部分样式...');

const cssFile = 'css/ingredients_15-30.css';
if (fs.existsSync(cssFile)) {
    let content = fs.readFileSync(cssFile, 'utf8');
    let hasChanges = false;

    // 恢复主要的.selected-ingredients样式
    const mainSelectedIngredientsPattern = /\.selected-ingredients\s*\{[\s\S]*?background: var\(--card-bg\);[\s\S]*?\}/g;
    const correctMainStyle = `.selected-ingredients {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: var(--spacing);
    margin-top: var(--spacing);
}`;

    if (mainSelectedIngredientsPattern.test(content)) {
        content = content.replace(mainSelectedIngredientsPattern, correctMainStyle);
        console.log('✅ 恢复主要的.selected-ingredients样式');
        hasChanges = true;
    }

    // 恢复.selected-ingredients h2样式
    const h2Pattern = /\.selected-ingredients h2\s*\{[\s\S]*?color: var\(--text-color\);[\s\S]*?\}/g;
    const correctH2Style = `.selected-ingredients h2 {
    color: var(--text-color);
    font-weight: 600;
    margin-bottom: 1.5rem;
}`;

    if (h2Pattern.test(content)) {
        content = content.replace(h2Pattern, correctH2Style);
        console.log('✅ 恢复.selected-ingredients h2样式');
        hasChanges = true;
    }

    // 恢复.note-section样式
    const noteSectionPattern = /\.note-section\s*\{[\s\S]*?margin-bottom: 20px;[\s\S]*?\}/g;
    const correctNoteSectionStyle = `.note-section {
    margin-bottom: 20px;
}`;

    if (noteSectionPattern.test(content)) {
        content = content.replace(noteSectionPattern, correctNoteSectionStyle);
        console.log('✅ 恢复.note-section样式');
        hasChanges = true;
    }

    // 恢复.slot-item样式
    const slotItemPattern = /\.slot-item\s*\{[\s\S]*?width: 50px;[\s\S]*?height: 50px;[\s\S]*?\}/g;
    const correctSlotItemStyle = `.slot-item {
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

    if (slotItemPattern.test(content)) {
        content = content.replace(slotItemPattern, correctSlotItemStyle);
        console.log('✅ 恢复.slot-item样式');
        hasChanges = true;
    }

    // 确保响应式样式正确
    const responsive768Pattern = /@media \(max-width: 768px\)[\s\S]*?\.selected-ingredients\s*\{[\s\S]*?padding: 16px;[\s\S]*?\}/g;
    const correctResponsive768Style = `@media (max-width: 768px) {
    .ingredients-page {
        padding: 16px;
        padding-top: 80px;
    }
    .page-title {
        font-size: 1.3rem;
        text-align: center;
        margin-bottom: 20px;
    }
    
    .fragrance-types {
        gap: 8px;
        margin-bottom: 16px;
    }
    
    .type-btn {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
    }
    
    .note-selector {
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .note-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
    }
    
    .ingredients-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    .ingredient-item img {
        height: 100px;
    }
    
    .ingredient-item h3 {
        font-size: 1rem;
        padding: 12px 0 8px 0;
    }
    
    .ingredient-item h3 .en {
        font-size: 0.8rem;
    }
    
    .selected-ingredients {
        padding: 16px;
        margin-top: 16px;
    }
    
    .selected-ingredients h2 {
        font-size: 1.2rem;
        margin-bottom: 12px;
    }
    
    .ingredients-page .ingredient-item {
        border-bottom: 6px solid var(--card-bottom);
    }
}`;

    if (responsive768Pattern.test(content)) {
        content = content.replace(responsive768Pattern, correctResponsive768Style);
        console.log('✅ 恢复768px响应式样式');
        hasChanges = true;
    }

    if (hasChanges) {
        fs.writeFileSync(cssFile, content);
        console.log('✅ 样式恢复完成');
    } else {
        console.log('ℹ️ 无需恢复，样式已正确');
    }
} else {
    console.log('❌ CSS文件不存在');
}

console.log('🎉 样式恢复完成！');
