#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔍 开始检查整体逻辑...');

// 检查主要文件
const mainFiles = [
    'ingredients_15-30.html',
    'index_15-30.html',
    'css/ingredients_15-30.css',
    'css/base_15-30.css'
];

console.log('\n📁 检查主要文件:');
mainFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}: 存在`);
    } else {
        console.log(`❌ ${file}: 不存在`);
    }
});

// 检查ingredients_15-30.html的关键功能
console.log('\n🔧 检查ingredients_15-30.html关键功能:');
if (fs.existsSync('ingredients_15-30.html')) {
    const content = fs.readFileSync('ingredients_15-30.html', 'utf8');
    
    // 检查关键函数
    const functions = [
        'renderSelectedIngredients',
        'getSelectedIngredients',
        'saveSelectedIngredients',
        'selectIngredientToNote'
    ];
    
    functions.forEach(func => {
        if (content.includes(func)) {
            console.log(`✅ ${func}: 存在`);
        } else {
            console.log(`❌ ${func}: 缺失`);
        }
    });
    
    // 检查关键HTML结构
    const structures = [
        '已选择的香料',
        'selected-ingredients',
        'note-slots',
        'slot-item'
    ];
    
    structures.forEach(structure => {
        if (content.includes(structure)) {
            console.log(`✅ ${structure}: 存在`);
        } else {
            console.log(`❌ ${structure}: 缺失`);
        }
    });
    
    // 检查localStorage键名
    const localStorageKeys = [
        'selectedIngredientsByNote'
    ];
    
    localStorageKeys.forEach(key => {
        if (content.includes(key)) {
            console.log(`✅ localStorage键 ${key}: 存在`);
        } else {
            console.log(`❌ localStorage键 ${key}: 缺失`);
        }
    });
}

// 检查香料详情页面的关键功能
console.log('\n🔧 检查香料详情页面关键功能:');
const ingredientFiles = fs.readdirSync('.').filter(file => 
    file.endsWith('.html') && 
    !file.startsWith('index') && 
    !file.startsWith('ingredients') &&
    !file.includes('scent-story-generator')
);

// 随机检查几个文件
const sampleFiles = ingredientFiles.slice(0, 5);
sampleFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // 检查关键函数
        const hasSelectFunction = content.includes('selectIngredientToNote');
        const hasLocalStorage = content.includes('selectedIngredientsByNote');
        const hasMainTag = content.includes('<main');
        const hasSelectAction = content.includes('select-action');
        
        console.log(`${file}:`);
        console.log(`  - selectIngredientToNote: ${hasSelectFunction ? '✅' : '❌'}`);
        console.log(`  - localStorage: ${hasLocalStorage ? '✅' : '❌'}`);
        console.log(`  - main标签: ${hasMainTag ? '✅' : '❌'}`);
        console.log(`  - select-action: ${hasSelectAction ? '✅' : '❌'}`);
    }
});

console.log('\n🎉 整体逻辑检查完成！');
