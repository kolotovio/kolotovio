import { createStore } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import axios from 'axios'


export const store = createStore({
    state: () => ({
        object: {},
        objectFreezed: {},
    }),
    getters: {
        getObject: (state) => state.object,
        isModified: (state) => {
            if (JSON.stringify(state.object) !== JSON.stringify(state.objectFreezed)) return true
            return false
        }
    },
    actions: {
        fetchObject: ({ commit }) => {
            const { data } = axios.get('object')
            commit('setObject', data)
        },
        updateObject: ({ commit }, changedObject) => {
            const { data } = axios.put(`object/${changedObject.id}`, { changedObject })
            commit('setObject', data)
        }
    },
    mutations: {
        setObject: (state, data) => {
            state.object = data
            state.objectFreezed = cloneDeep(data)
        },
        assignObject: (state, data) => Object.assign(state.object, data)
    }
})