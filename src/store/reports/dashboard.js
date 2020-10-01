export const Dashboard = {
    state: {
        dashboard_summary: [],
        static_dashboard_data: [],
        bidbonds_summary: [],
        static_bidbonds_summary: [],
        company_summary: [],
        static_company_summary: [],
        work_days: [],
        static_work_days: [],
        bid_expiry: [],
    },

    getters: {
        getDashboardSummary(state) {
            return state.dashboard_summary;
        },
        getDashboardSummaryFormatted(state) {
            let i = 1;
            return state.dashboard_summary.map(d => {
                return {
                    'No': i++,
                    'Month': d.date,
                    'Number of Bid Bonds': d.bidbonds_no,
                    'BID Exposure': d.bid_exposure,
                    'Total Commissions': d.commissions,
                    'Excise Duty': d.excise_duty,
                    'Total Collections': d.collections,
                    'Kingdom Bank': d.jbb,
                    'MPF': d.mpf
                };
            });
        },
        getBidbondsSummary(state) {
            return state.bidbonds_summary;
        },
        getcompanySummary(state) {
            return state.company_summary;
        },
        getcompanySummaryFormatted(state) {
            return state.company_summary.map(co => {
                return {
                    'RM': co.full_name,
                    'Companies': co.companies_count,
                    'No of Bid Bonds': co.bidbond_count,
                    'Bid Bond Value': co.bidbond_value,
                    'Commission': co.commissions_value
                }
            });
        },
        getWorkDays(state) {
            return state.work_days;
        },
        getBidExpiry(state) {
            return state.bid_expiry;
        },
    },

    mutations: {
        dashboardSummary(state, data) {
            state.dashboard_summary = data;
        },
        staticDashboardData(state, data) {
            state.static_dashboard_data = data;
        },
        staticBidbondsSummary(state, data) {
            state.static_bidbonds_summary = data;
        },
        setDashboardSummary(state, payload) {
            state.dashboard_summary = state.static_dashboard_data.filter(b => moment(b.date, "DD/MM/YYYY").isBetween(moment(payload.from, "DD/MM/YYYY").subtract(1, 'days'), moment(payload.to, "DD/MM/YYYY")));
        },
        bidbondsSummary(state, data) {
            state.bidbonds_summary = data;
        },
        companySummary(state, data) {
            state.company_summary = data;
        },
        staticCompanySummary(state, data) {
            state.static_company_summary = data;
        },
        setCompanySummary(state, payload) {
            state.company_summary = state.static_company_summary.filter(b => moment(b.date_created, "DD/MM/YYYY").isBetween(moment(payload.from, "DD/MM/YYYY").subtract(1, 'days'), moment(payload.to, "DD/MM/YYYY")));
        },
        workDays(state, data) {
            state.work_days = data;
        },
        staticWorkDays(state, data) {
            state.static_work_days = data;
        },
        setWorkDays(state, payload) {
            state.work_days = state.static_work_days.filter(b => moment(b.date, "DD/MM/YYYY").isBetween(moment(payload.from, "DD/MM/YYYY").subtract(1, 'days'), moment(payload.to, "DD/MM/YYYY")));
        },
        setBidExpiry(state, data) {
            state.bid_expiry = data;
        },
    },
    actions: {
        dashboardSummary({commit}) {
            axios.get('/api/v1/reports/dashboard')
                .then(res => {
                    commit('dashboardSummary', res.data.dashboard);
                    commit('staticDashboardData', res.data.dashboard);
                    commit('bidbondsSummary', res.data.bid_summary);
                    commit('staticBidbondsSummary', res.data.bid_summary);
                    commit('companySummary', res.data.company_analysis);
                    commit('staticCompanySummary', res.data.company_analysis);
                    commit('workDays', res.data.days_worked);
                    commit('staticWorkDays', res.data.days_worked);
                })
        },
        setDashboardSummary({commit}, payload) {
            commit('setDashboardSummary', payload)
        },
        setBidExpiry({commit}, payload) {
            commit('setBidExpiry', payload)
        },
        setCompanySummary({commit}, payload) {
            commit('setCompanySummary', payload)
        },
        setWorkDays({commit}, payload) {
            commit('setWorkDays', payload)
        },
        fetchBidBondSummary({commit}, payload) {
            axios.get('/api/v1/reports/bidbonds/summary', {
                params: {
                    start: moment(payload.start).format("YYYY-MM-DD"),
                    end: moment(payload.end).format("YYYY-MM-DD"),
                }
            }).then(response => {
                commit('bidbondsSummary', response.data);
            });
        },
        fetchBidBondExpiry({commit}, payload) {
            axios.get('/api/v1/reports/bidbonds/expiry', {
                params: {
                    start: moment(payload.start).format("YYYY-MM-DD"),
                    end: moment(payload.end).format("YYYY-MM-DD"),
                }
            }).then(response => {
                commit('setBidExpiry', response.data);
            });
        }
    }
};


