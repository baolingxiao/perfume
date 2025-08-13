const fs = require('fs');

// 之前修复脚本影响过的页面列表
const affectedPages = [
    '椰子.html', '香蕉.html', '风信子.html', '金银花.html', '栀子花.html', 
    '金合欢.html', '红姜花.html', '夜来香.html', '鸳鸯茉莉.html', '檀香.html', 
    '橡苔.html', '桦木焦油.html', '雪松醇.html'
];

function checkPage(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        const hasSelectAction = content.includes('select-action');
        const hasScript = content.includes('<script>');
        const hasJavaScriptLogic = content.includes('selectIngredientToNote') || content.includes('showSuccessToast');
        const hasBodyClose = content.includes('</body>');
        const hasHtmlClose = content.includes('</html>');
        
        console.log(`\n📄 ${filePath}:`);
        console.log(`  ✅ select-action HTML: ${hasSelectAction ? '存在' : '❌ 缺失'}`);
        console.log(`  ✅ script标签: ${hasScript ? '存在' : '❌ 缺失'}`);
        console.log(`  ✅ JavaScript逻辑: ${hasJavaScriptLogic ? '存在' : '❌ 缺失'}`);
        console.log(`  ✅ body闭合: ${hasBodyClose ? '存在' : '❌ 缺失'}`);
        console.log(`  ✅ html闭合: ${hasHtmlClose ? '存在' : '❌ 缺失'}`);
        
        if (!hasSelectAction) {
            console.log(`  🔴 需要恢复select-action HTML`);
        }
        if (!hasJavaScriptLogic) {
            console.log(`  🔴 需要恢复JavaScript逻辑`);
        }
        if (!hasBodyClose || !hasHtmlClose) {
            console.log(`  🔴 需要修复HTML结构`);
        }
        
        return {
            filePath,
            hasSelectAction,
            hasScript,
            hasJavaScriptLogic,
            hasBodyClose,
            hasHtmlClose,
            needsFix: !hasSelectAction || !hasJavaScriptLogic || !hasBodyClose || !hasHtmlClose
        };
        
    } catch (error) {
        console.error(`❌ ${filePath}: 读取失败 - ${error.message}`);
        return { filePath, needsFix: true };
    }
}

console.log('🔍 检查被影响的页面状态...\n');

const results = [];
affectedPages.forEach(file => {
    if (fs.existsSync(file)) {
        const result = checkPage(file);
        results.push(result);
    } else {
        console.log(`⚠️  ${file}: 文件不存在`);
    }
});

console.log('\n📊 检查结果汇总:');
const needsFix = results.filter(r => r.needsFix);
const ok = results.filter(r => !r.needsFix);

console.log(`✅ 正常页面: ${ok.length}个`);
console.log(`🔴 需要修复: ${needsFix.length}个`);

if (needsFix.length > 0) {
    console.log('\n🔴 需要修复的页面:');
    needsFix.forEach(r => {
        console.log(`  - ${r.filePath}`);
    });
}

console.log('\n🎉 检查完成！');
