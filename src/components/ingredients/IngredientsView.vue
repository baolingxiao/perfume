<template>
  <v-container fluid>
    <v-row>
      <!-- 香料选择区域 -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>选择香料</v-card-title>
          <v-card-text>
            <!-- 调性选择标签 -->
            <v-tabs v-model="activeTab" color="primary">
              <v-tab value="top">前调</v-tab>
              <v-tab value="middle">中调</v-tab>
              <v-tab value="base">尾调</v-tab>
            </v-tabs>

            <!-- 香料网格 -->
            <v-window v-model="activeTab">
              <v-window-item value="top">
                <v-row>
                  <v-col v-for="ingredient in topNotes" :key="ingredient.id" cols="6" sm="4" md="3">
                    <v-card 
                      @click="addIngredient('topNotes', ingredient)"
                      class="ingredient-card"
                      :class="{ 'selected': isSelected('topNotes', ingredient) }"
                    >
                      <v-img :src="ingredient.image" height="120" cover></v-img>
                      <v-card-title class="text-subtitle-2">{{ ingredient.name }}</v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="middle">
                <v-row>
                  <v-col v-for="ingredient in middleNotes" :key="ingredient.id" cols="6" sm="4" md="3">
                    <v-card 
                      @click="addIngredient('middleNotes', ingredient)"
                      class="ingredient-card"
                      :class="{ 'selected': isSelected('middleNotes', ingredient) }"
                    >
                      <v-img :src="ingredient.image" height="120" cover></v-img>
                      <v-card-title class="text-subtitle-2">{{ ingredient.name }}</v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="base">
                <v-row>
                  <v-col v-for="ingredient in baseNotes" :key="ingredient.id" cols="6" sm="4" md="3">
                    <v-card 
                      @click="addIngredient('baseNotes', ingredient)"
                      class="ingredient-card"
                      :class="{ 'selected': isSelected('baseNotes', ingredient) }"
                    >
                      <v-img :src="ingredient.image" height="120" cover></v-img>
                      <v-card-title class="text-subtitle-2">{{ ingredient.name }}</v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 已选香料显示区域 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>已选择的香料</v-card-title>
          <v-card-text>
            <!-- 前调 -->
            <div v-if="selectedTopNotes.length > 0" class="mb-4">
              <h3 class="text-h6 mb-2">前调</h3>
              <v-chip-group>
                <v-chip
                  v-for="ingredient in selectedTopNotes"
                  :key="ingredient.id"
                  closable
                  @click:close="removeIngredient('topNotes', ingredient)"
                  color="primary"
                  variant="outlined"
                >
                  {{ ingredient.name }}
                </v-chip>
              </v-chip-group>
            </div>

            <!-- 中调 -->
            <div v-if="selectedMiddleNotes.length > 0" class="mb-4">
              <h3 class="text-h6 mb-2">中调</h3>
              <v-chip-group>
                <v-chip
                  v-for="ingredient in selectedMiddleNotes"
                  :key="ingredient.id"
                  closable
                  @click:close="removeIngredient('middleNotes', ingredient)"
                  color="secondary"
                  variant="outlined"
                >
                  {{ ingredient.name }}
                </v-chip>
              </v-chip-group>
            </div>

            <!-- 尾调 -->
            <div v-if="selectedBaseNotes.length > 0" class="mb-4">
              <h3 class="text-h6 mb-2">尾调</h3>
              <v-chip-group>
                <v-chip
                  v-for="ingredient in selectedBaseNotes"
                  :key="ingredient.id"
                  closable
                  @click:close="removeIngredient('baseNotes', ingredient)"
                  color="accent"
                  variant="outlined"
                >
                  {{ ingredient.name }}
                </v-chip>
              </v-chip-group>
            </div>

            <!-- 空状态 -->
            <div v-if="!hasSelectedIngredients" class="text-center pa-4">
              <v-icon size="48" color="grey">mdi-flower</v-icon>
              <p class="text-grey mt-2">还没有选择任何香料</p>
            </div>

            <!-- 操作按钮 -->
            <div v-if="hasSelectedIngredients" class="mt-4">
              <v-btn 
                block 
                color="primary" 
                @click="generateStory"
                :loading="generating"
              >
                生成香水故事
              </v-btn>
              <v-btn 
                block 
                variant="outlined" 
                @click="clearSelections"
                class="mt-2"
              >
                清空选择
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'IngredientsView',
  data() {
    return {
      activeTab: 'top',
      generating: false,
      // 香料数据
      topNotes: [
        { id: 1, name: '柑橘', image: '/images/ingredients/柑橘.jpeg' },
        { id: 2, name: '柠檬', image: '/images/ingredients/香柠檬.jpeg' },
        { id: 3, name: '青柠', image: '/images/ingredients/青柠.jpeg' },
        { id: 4, name: '血橙', image: '/images/ingredients/血橙.jpeg' },
        { id: 5, name: '柚子', image: '/images/ingredients/柚子.jpeg' },
        { id: 6, name: '橙子', image: '/images/ingredients/橙子.jpeg' },
        { id: 7, name: '橙花', image: '/images/ingredients/橙花.jpeg' },
        { id: 8, name: '青苹果', image: '/images/ingredients/青苹果.jpeg' }
      ],
      middleNotes: [
        { id: 9, name: '玫瑰', image: '/images/ingredients/大马士革玫瑰.jpeg' },
        { id: 10, name: '茉莉', image: '/images/ingredients/茉莉.jpeg' },
        { id: 11, name: '栀子花', image: '/images/ingredients/栀子花.jpeg' },
        { id: 12, name: '小苍兰', image: '/images/ingredients/小苍兰.jpeg' },
        { id: 13, name: '铃兰', image: '/images/ingredients/铃兰.jpeg' },
        { id: 14, name: '风信子', image: '/images/ingredients/风信子.jpeg' },
        { id: 15, name: '紫罗兰', image: '/images/ingredients/紫罗兰.jpeg' },
        { id: 16, name: '夜来香', image: '/images/ingredients/夜来香.jpeg' }
      ],
      baseNotes: [
        { id: 17, name: '檀香', image: '/images/ingredients/檀香.jpeg' },
        { id: 18, name: '雪松', image: '/images/ingredients/雪松.jpeg' },
        { id: 19, name: '广藿香', image: '/images/ingredients/广藿香.jpeg' },
        { id: 20, name: '岩兰草', image: '/images/ingredients/岩兰草.jpeg' },
        { id: 21, name: '乌木', image: '/images/ingredients/乌木.jpeg' },
        { id: 22, name: '橡木苔', image: '/images/ingredients/橡木苔.jpeg' },
        { id: 23, name: '杉木', image: '/images/ingredients/杉木.jpeg' },
        { id: 24, name: '柏木', image: '/images/ingredients/柏木.jpeg' }
      ]
    }
  },
  computed: {
    ...mapState(['selectedIngredients']),
    ...mapGetters(['hasSelectedIngredients']),
    selectedTopNotes() {
      return this.selectedIngredients.topNotes
    },
    selectedMiddleNotes() {
      return this.selectedIngredients.middleNotes
    },
    selectedBaseNotes() {
      return this.selectedIngredients.baseNotes
    }
  },
  methods: {
    ...mapMutations(['addIngredient', 'removeIngredient', 'clearSelections']),
    ...mapActions(['generatePerfumeStory']),
    
    isSelected(noteType, ingredient) {
      return this.selectedIngredients[noteType].some(item => item.id === ingredient.id)
    },
    
    async generateStory() {
      this.generating = true
      try {
        await this.generatePerfumeStory()
        this.$router.push('/story')
      } catch (error) {
        console.error('生成故事失败:', error)
        // 这里可以添加错误提示
      } finally {
        this.generating = false
      }
    }
  }
}
</script>

<style scoped>
.ingredient-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.ingredient-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.ingredient-card.selected {
  border: 2px solid #1976D2;
  background-color: #E3F2FD;
}

.v-chip-group {
  flex-wrap: wrap;
}
</style> 