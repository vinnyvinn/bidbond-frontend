export const PostalCodes = {
    state: {
        postal_codes: [],
        name:''
    },

    getters: {
        getPostalCodes(state) {
            return state.postal_codes;
        },
        getCounty(state) {
            return state.name;
        }
    },
    mutations: {
        setPostalCodes(state, data) {
            state.postal_codes = data;
        },
        setCounty(state, id) {
            state.name = state.postal_codes.filter(x => x.id === id)[0].name;
        }
    },

    actions: {
        fetchPostalCodes({commit}) {
            axios.get('/api/v1/postalcodes').then(response => {
                commit('setPostalCodes', response.data);
            });
        },
        setCounty({ commit }, data) {
            commit('setCounty', data);
        },
    }
};
