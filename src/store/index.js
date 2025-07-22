import { createStore } from 'vuex'

// 自动从localStorage读取并映射key
function mapLocalStorageToStore() {
  const raw = JSON.parse(localStorage.getItem('selectedIngredients'))
  if (!raw) return null
  return {
    topNotes: raw.top || [],
    middleNotes: raw.heart || [],
    baseNotes: raw.base || []
  }
}

const store = createStore({
  state: {
    selectedIngredients: {
      topNotes: [],
      middleNotes: [],
      baseNotes: []
    },
    currentPerfume: {
      name: '',
      story: '',
      similarPerfumes: []
    }
  },
  mutations: {
    addIngredient(state, { note, ingredient }) {
      state.selectedIngredients[note].push(ingredient)
    },
    removeIngredient(state, { note, ingredient }) {
      const index = state.selectedIngredients[note].indexOf(ingredient)
      if (index > -1) {
        state.selectedIngredients[note].splice(index, 1)
      }
    },
    setPerfumeDetails(state, perfume) {
      state.currentPerfume = perfume
    },
    clearSelections(state) {
      state.selectedIngredients = {
        topNotes: [],
        middleNotes: [],
        baseNotes: []
      }
      state.currentPerfume = {
        name: '',
        story: '',
        similarPerfumes: []
      }
    },
    setSelectedIngredients(state, payload) {
      state.selectedIngredients = payload
    }
  },
  actions: {
    async generatePerfumeStory({ commit, state }) {
      // TODO: Implement AI story generation
      const story = await generateStoryFromIngredients(state.selectedIngredients)
      commit('setPerfumeDetails', {
        ...state.currentPerfume,
        story
      })
    }
  },
  getters: {
    hasSelectedIngredients: state => {
      return Object.values(state.selectedIngredients).some(notes => notes.length > 0)
    },
    totalIngredientsCount: state => {
      return Object.values(state.selectedIngredients)
        .reduce((total, notes) => total + notes.length, 0)
    }
  }
})

const mapped = mapLocalStorageToStore()
if (mapped) {
  store.commit('setSelectedIngredients', mapped)
}

export default store 