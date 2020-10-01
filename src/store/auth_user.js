export const AuthUser = {
	state: {
		auth_user: {}
	},

	getters: {
		getAuthUser(state) {
			return state.auth_user;
		}
	},

	mutations: {
		setAuthUser(state, data) {
			state.auth_user = data;
		}
	},

	actions: {
		setAuthUser({ commit }, data) {
			commit('setAuthUser', data);
		},
		initialize({commit}) {
			axios.post('/api/v1/initialize').then(response => {
				commit('setAuthUser', response.data);
			});
		}
	}
};

