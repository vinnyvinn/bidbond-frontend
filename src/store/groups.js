export const Groups = {
	state: {
		groups: []
	},

	getters: {
		getGroups(state) {
			return state.groups;
		}
	},

	mutations: {
		setGroups(state, data) {
			state.groups = data;
		},
		setGroup(state, data) {
			const index = state.groups.findIndex(d => d.id === data.id);
			if (index === -1)
				state.groups.push(data);
			else
				state.groups[index] = data;
		},
        deleteGroup(state,data){
            const i = state.groups.map(item => item.id).indexOf(data.id);
            state.groups.splice(i, 1);
        }
	},

	actions: {
		setGroup({ commit }, data) {
			commit('setGroup', data);
		},
        deleteGroup({ commit }, data) {
            commit('deleteGroup', data);
        },
		fetchGroups({commit}) {
			axios.get('/api/v1/groups').then(response => {
				commit('setGroups', response.data);
			});
		}
	}
};


