export const CompaniesReport = {
    state: {
        companies: [],
        static_companies: [],
    },
    getters: {
        getCompanies(state) {
            return state.companies;
        },
        getCompaniesFormatted(state) {
            return state.companies.map(com => {
                return {
                    'ID': com.id,
                    'Name': com.name,
                    'CRP': com.crp,
                    'Email': com.email,
                    'Phone Number': com.phone_number,
                    'Physical Address': com.physical_address,
                    'Postal Code': com.postal,
                    'Approval Status': com.approval_status,
                    'Date Created': com.date_created
                }
            });
        },
    },
    mutations: {
        allCompanies(state, data) {
            state.companies = data;
        },
        staticCompanies(state, data) {
            state.static_companies = data;
        },
        setCompanies(state, payload) {
            state.companies = state.static_companies.filter(b => moment(b.date_created, "DD/MM/YYYY").isBetween(moment(payload.from, "DD/MM/YYYY").subtract(1,'days'), moment(payload.to, "DD/MM/YYYY")));
        },
    },
    actions: {
        allCompanies({commit}) {
            axios.get('/api/v1/reports/companies')
                .then(res => {
                    commit('allCompanies', res.data);
                    commit('staticCompanies', res.data);
                })
        },
        setCompanies({commit}, payload) {
          commit('setCompanies', payload)
        },
    }
};


