export const CounterParties = {
	state: {
		counter_parties: []
	},

	getters: {
		getCounterParties(state) {
			return state.counter_parties;
		}
	},

	mutations: {
		setCounterParties(state, data) {
			state.counter_parties = data;
		},
		setCounterParty(state, data) {
			const index = state.counter_parties.findIndex(d => d.id === data.id);
			if (index === -1)
				state.counter_parties.push(data);
			else
				state.counter_parties[index] = data;
		},
		deleteCounterParty(state,data){
			const i = state.counter_parties.map(item => item.id).indexOf(data.id);
			state.counter_parties.splice(i, 1);
		}
	},

	actions: {
		setCounterParty({ commit }, data) {
			commit('setCounterParty', data);
		},
		deleteCounterParty({ commit }, data) {
			commit('deleteCounterParty', data);
		},
		fetchCounterParties({commit}) {
			axios.get('/api/v1/counterparties').then(response => {
				console.log(response.data)
				commit('setCounterParties', response.data.data);
			});
		}
	}
};


