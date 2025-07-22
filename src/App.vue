<template>
  <v-app>
    <!-- 导航栏 -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>香水工坊</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        text
        class="mx-2"
      >
        {{ item.name }}
      </v-btn>
    </v-app-bar>

    <!-- 主要内容区域 -->
    <v-main>
      <router-view />
    </v-main>

    <!-- 页脚 -->
    <v-footer app color="grey lighten-3">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <p class="text-caption text-grey">
              © 2024 香水工坊 - 探索香水的艺术与科学
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      menuItems: [
        { name: '首页', path: '/' },
        { name: '香料选择', path: '/ingredients' },
        { name: '香水笔记', path: '/notes' },
        { name: '香水故事', path: '/story' }
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
}

.v-main {
  background-color: #fafafa;
}
</style> 