import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/home/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/ingredients',
    name: 'ingredients',
    component: () => import('../components/ingredients/IngredientsView.vue')
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../components/notes/NotesView.vue')
  },
  {
    path: '/story',
    name: 'story',
    component: () => import('../components/story/StoryView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 