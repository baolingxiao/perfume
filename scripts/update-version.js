#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// 读取package.json中的版本号
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const newVersion = packageJson.cacheVersion;

console.log(`🔄 更新CSS版本号到: ${newVersion}`);

// 需要更新版本号的文件列表
const filesToUpdate = [
  'ingredients_15-30.html',
  'index_15-30.html',
  'scent-story-generator/static/scent_story_generator.html'
];

// CSS文件列表
const cssFiles = [
  'css/base_15-30.css',
  'css/ingredients_15-30.css',
  'css/home_15-30.css'
];

// JavaScript文件列表
const jsFiles = [
  'scent_story_interaction.js'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 更新CSS文件版本号
    cssFiles.forEach(cssFile => {
      const cssName = path.basename(cssFile);
      // 处理已有版本号的情况
      const regexWithVersion = new RegExp(`href="css/${cssName}\\?v=\\d+"`, 'g');
      content = content.replace(regexWithVersion, `href="css/${cssName}?v=${newVersion.replace('v', '')}"`);
      
      // 处理没有版本号的情况
      const regexWithoutVersion = new RegExp(`href="css/${cssName}"`, 'g');
      content = content.replace(regexWithoutVersion, `href="css/${cssName}?v=${newVersion.replace('v', '')}"`);
    });
    
    // 更新JavaScript文件版本号
    jsFiles.forEach(jsFile => {
      const jsName = path.basename(jsFile);
      // 处理已有版本号的情况
      const regexWithVersion = new RegExp(`src="${jsName}\\?v=\\d+"`, 'g');
      content = content.replace(regexWithVersion, `src="${jsName}?v=${newVersion.replace('v', '')}"`);
      
      // 处理没有版本号的情况
      const regexWithoutVersion = new RegExp(`src="${jsName}"`, 'g');
      content = content.replace(regexWithoutVersion, `src="${jsName}?v=${newVersion.replace('v', '')}"`);
    });
    
    fs.writeFileSync(file, content);
    console.log(`✅ 已更新: ${file}`);
  } else {
    console.log(`⚠️  文件不存在: ${file}`);
  }
});

console.log('🎉 版本号更新完成！');
