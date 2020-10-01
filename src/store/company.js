export const Company = {
    state: {
        company: [],
        tender:[],
        account_balance:0,
    },

    getters: {
        getCompany(state) {
            return state.company;
        },
        getTender(state) {
            return state.tender;
        },
        getAccountBalance(state){
         return state.account_balance;
        }
    },

    mutations: {
        setCompany(state, data) {
            state.company = data;
        },
        setTender(state, data) {
            state.tender = data;
        },
        setAccountBalance(state,data){
           state.account_balance = data;
        }
    },
    actions: {
        setCompany({commit }, data) {
            commit('setCompany', data);
        },
        setTender({ commit }, data) {
            commit('setTender', data);
        },
        setAccountBalance({commit,rootGetters}){
            setTimeout(()=>{
                if (rootGetters.getAuthUser !=undefined && (rootGetters.getAuthUser.role=='customer' || rootGetters.getAuthUser.role=='agent')){
                           console.log(rootGetters.getAuthUser)

                axios.get(`/api/v1/company/account-balance/${rootGetters.getAuthUser.id}/${rootGetters.getAuthUser.role}`)
                    .then(res => {
                        commit('setAccountBalance',res.data);
                    })
                }

            },2000)


        }
    }
};


