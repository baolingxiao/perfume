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

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 更新CSS文件版本号
    cssFiles.forEach(cssFile => {
      const cssName = path.basename(cssFile);
      const regex = new RegExp(`href="css/${cssName}\\?v=\\d+"`, 'g');
      content = content.replace(regex, `href="css/${cssName}?v=${newVersion.replace('v', '')}"`);
    });
    
    fs.writeFileSync(file, content);
    console.log(`✅ 已更新: ${file}`);
  } else {
    console.log(`⚠️  文件不存在: ${file}`);
  }
});

console.log('🎉 版本号更新完成！');
