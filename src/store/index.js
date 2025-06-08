import { createStore } from 'vuex'

export default createStore({
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