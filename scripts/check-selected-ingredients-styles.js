#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔍 检查"已选择的香料"部分样式...');

// 检查CSS文件中的关键样式
const cssFile = 'css/ingredients_15-30.css';
if (fs.existsSync(cssFile)) {
    const content = fs.readFileSync(cssFile, 'utf8');
    
    console.log('\n📊 关键样式检查:');
    
    // 检查.selected-ingredients的样式
    const selectedIngredientsMatch = content.match(/\.selected-ingredients\s*\{[\s\S]*?\}/g);
    if (selectedIngredientsMatch) {
        console.log(`✅ .selected-ingredients 样式: ${selectedIngredientsMatch.length} 个定义`);
        selectedIngredientsMatch.forEach((style, index) => {
            console.log(`  定义 ${index + 1}: ${style.replace(/\s+/g, ' ').trim()}`);
        });
    } else {
        console.log('❌ .selected-ingredients 样式: 未找到');
    }
    
    // 检查.note-section的样式
    const noteSectionMatch = content.match(/\.note-section\s*\{[\s\S]*?\}/g);
    if (noteSectionMatch) {
        console.log(`✅ .note-section 样式: ${noteSectionMatch.length} 个定义`);
        noteSectionMatch.forEach((style, index) => {
            console.log(`  定义 ${index + 1}: ${style.replace(/\s+/g, ' ').trim()}`);
        });
    } else {
        console.log('❌ .note-section 样式: 未找到');
    }
    
    // 检查.slot-item的样式
    const slotItemMatch = content.match(/\.slot-item\s*\{[\s\S]*?\}/g);
    if (slotItemMatch) {
        console.log(`✅ .slot-item 样式: ${slotItemMatch.length} 个定义`);
        slotItemMatch.forEach((style, index) => {
            console.log(`  定义 ${index + 1}: ${style.replace(/\s+/g, ' ').trim()}`);
        });
    } else {
        console.log('❌ .slot-item 样式: 未找到');
    }
    
    // 检查响应式样式
    const responsiveMatches = content.match(/@media[^}]*\{[\s\S]*?\}/g);
    if (responsiveMatches) {
        console.log(`✅ 响应式样式: ${responsiveMatches.length} 个定义`);
        responsiveMatches.forEach((style, index) => {
            const mediaQuery = style.match(/@media[^{]*/)[0];
            console.log(`  媒体查询 ${index + 1}: ${mediaQuery.trim()}`);
        });
    } else {
        console.log('❌ 响应式样式: 未找到');
    }
}

// 检查HTML结构
const htmlFile = 'ingredients_15-30.html';
if (fs.existsSync(htmlFile)) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    console.log('\n📄 HTML结构检查:');
    
    // 检查selected-ingredients容器
    if (content.includes('selected-ingredients')) {
        console.log('✅ selected-ingredients 容器: 存在');
    } else {
        console.log('❌ selected-ingredients 容器: 不存在');
    }
    
    // 检查note-section
    if (content.includes('note-section')) {
        console.log('✅ note-section: 存在');
    } else {
        console.log('❌ note-section: 不存在');
    }
    
    // 检查slot-item
    if (content.includes('slot-item')) {
        console.log('✅ slot-item: 存在');
    } else {
        console.log('❌ slot-item: 不存在');
    }
    
    // 检查前调、中调、尾调
    const noteTypes = ['前调', '中调', '尾调'];
    noteTypes.forEach(noteType => {
        if (content.includes(noteType)) {
            console.log(`✅ ${noteType}: 存在`);
        } else {
            console.log(`❌ ${noteType}: 不存在`);
        }
    });
}

console.log('\n🎉 样式检查完成！');
