#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🔍 检查CSS缓存版本一致性...');

// 读取package.json中的版本号
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const expectedVersion = packageJson.cacheVersion;

// 需要检查的文件列表
const filesToCheck = [
  'ingredients_15-30.html',
  'index_15-30.html',
  'scent-story-generator/static/scent_story_generator.html'
];

let hasIssues = false;

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // 检查CSS文件版本号
    const cssFiles = ['base_15-30.css', 'ingredients_15-30.css', 'home_15-30.css'];
    
    cssFiles.forEach(cssFile => {
      const regex = new RegExp(`href="css/${cssFile}\\?v=(\\d+)"`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        matches.forEach(match => {
          const version = match.match(/v=(\d+)/)[1];
          const expected = expectedVersion.replace('v', '');
          
          if (version !== expected) {
            console.log(`❌ ${file}: ${cssFile} 版本不匹配 (当前: v${version}, 期望: ${expectedVersion})`);
            hasIssues = true;
          } else {
            console.log(`✅ ${file}: ${cssFile} 版本正确 (${expectedVersion})`);
          }
        });
      }
    });
  }
});

if (hasIssues) {
  console.log('\n🚨 发现版本不一致问题！请运行: npm run version:update');
  process.exit(1);
} else {
  console.log('\n🎉 所有文件版本一致！');
}
