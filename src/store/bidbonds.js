export const editBidbond = {
    state: {
      bidbond: [],
    },
    getters: {
        getBidbond(state) {
            return state.bidbond;
        },
    },

    mutations: {
        editBidbond(state, data) {
            state.bidbond = data;
        },
    },
    actions: {
        editBidbond({commit }, tender) {
            axios.post(`/api/v1/bid-bonds/tender`,{tender_no:tender})
                .then(res => {
                   commit('editBidbond',res.data);
                })
                .catch(err => {
                console.log(err)
                })

        }
    }
};


