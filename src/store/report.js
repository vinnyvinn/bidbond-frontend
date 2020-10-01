export const Report = {
    state: {
        bidbond_summary: [],
        bidbond_expiry: [],
        company_summary: {},
    },

    getters: {
        getBidbondSummary(state) {
            return state.bidbond_summary;
        },
        getbidbondExpiry(state) {
            return state.bidbond_expiry;
        },
        getCompanySummary(state) {
            return state.company_summary;
        },
    },

    mutations: {
        bidbondSummary(state, data) {
            state.bidbond_summary = data;
        },
        bidbondExpiry(state, data) {
            state.bidbond_expiry = data;
        },
        companySummary(state, data) {
            state.company_summary = data;
        },
    },
    actions: {
        fetchBidBondSummary({commit}, payload) {
            axios.get('/api/v1/reports/bidbonds/summary', {
                params: {
                    start: moment(payload.start).format("YYYY-MM-DD"),
                    end: moment(payload.end).format("YYYY-MM-DD"),
                }
            }).then(response => {
                commit('bidbondSummary', response.data);
            });
        },
        fetchBidBondExpiry({commit}, payload) {
            axios.get('/api/v1/reports/bidbonds/expiry', {
                params: {
                    start: moment(payload.start).format("YYYY-MM-DD"),
                    end: moment(payload.end).format("YYYY-MM-DD"),
                }
            }).then(response => {
                commit('bidbondExpiry', response.data);
            });
        },
        fetchCompanySummary({commit}, payload) {
            axios.get('/api/v1/reports/bidbonds/company-summary', {
                params: {
                    start: moment(payload.start).format("YYYY-MM-DD"),
                    end: moment(payload.end).format("YYYY-MM-DD"),
                }
            }).then(response => {
                commit('companySummary', response.data);
            });
        }
    }
};


