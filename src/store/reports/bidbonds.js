export const BibondsReport = {
    state: {
        bidbonds: [],
        static_bidbonds: [],
    },
    getters: {
        getBidbondsReport(state) {
            return state.bidbonds;
        },
        getBidbondsReportFormatted(state) {
          return  state.bidbonds.map(bid => {
              return {
                  'REPORT DATE':bid.date_created,
                  'COMPANY': bid.crp,
                  'ACCOUNT': bid.account,
                  'CUSTOMERID': bid.customerid,
                  'CUSTOMER': bid.name,
                  'CURRENCY': bid.currency,
                  'AMOUNT': bid.amount,
                  'VALUEDATE': bid.value_date,
                  'MATURITYDATE': bid.maturity_date,
                  'CATEGORY': bid.category,
                  'CATEGORY NAME': bid.category_name,
                  'REFERENCE': bid.counter_party
              }
            });
        },
    },
    mutations: {
        allBidbondsReport(state, data) {
            state.bidbonds = data;
        },
        staticBidbondsReport(state, data) {
            state.static_bidbonds = data;
        },
        setBidbondsReport(state, payload) {
            state.bidbonds = state.static_bidbonds.filter(b => moment(b.date_created, "DD/MM/YYYY").isBetween(moment(payload.from, "DD/MM/YYYY").subtract(1,'days'), moment(payload.to, "DD/MM/YYYY")));
        },
    },
    actions: {
        allBidbondsReport({commit}) {
            axios.get('/api/v1/reports/bidbonds')
                .then(res => {
                    commit('allBidbondsReport', res.data);
                    commit('staticBidbondsReport', res.data);
                })
        },
        setBidbondsReport({commit}, payload) {
            commit('setBidbondsReport', payload)
        },
    }
};


