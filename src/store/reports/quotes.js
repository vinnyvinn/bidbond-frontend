export const Quotes = {
    state: {
        quotes: [],
        static_quotes: [],
    },

    getters: {
        getQuotess(state) {
            return state.quotes;
        },
        getQuotessFormatted(state) {
            return state.quotes.map(quote => {
                return {
                    'ID': quote.id,
                    'EMAIL': quote.email,
                    'PHONE': quote.phone,
                    'AMOUNT': quote.amount,
                    'TENURE': quote.tenure,
                    'CHARGE': quote.charge,
                    'LAST REQUESTED': quote.last_requested
                }
            });
        },
    },

    mutations: {
        allQuotes(state, data) {
            state.quotes = data;
        },
        staticQuotes(state, data) {
            state.static_quotes = data;
        },
        setQuotes(state, payload) {
            state.quotes = state.static_quotes.filter(b => moment(b.last_requested, "DD/MM/YYYY").isBetween(moment(payload.from, "DD/MM/YYYY").subtract(1, 'days'), moment(payload.to, "DD/MM/YYYY")));
        },
    },
    actions: {
        allQuotes({commit}) {
            axios.get('/api/v1/reports/quotes')
                .then(res => {
                    commit('allQuotes', res.data);
                    commit('staticQuotes', res.data);
                })
        },
        setQuotes({commit}, payload) {
            commit('setQuotes', payload)
        },
    }
};


