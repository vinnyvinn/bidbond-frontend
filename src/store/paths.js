export const Parts = {
    state: {
        path_to: ''
    },
    getters: {
        getPath(state) {
         return state.path_to;
        }
    },
    mutations: {
        setPath(state, data) {
        state.path_to = data;
        }
    },
    actions: {
        setPath({ commit }, data) {
            commit('setPath', data);
        }
    }
};


