export const RelationshipManagers = {
	state: {
		relationship_managers: []
	},

	getters: {
		getRelationshipManagers(state) {
			return state.relationship_managers;
		}
	},

	mutations: {
		setRelationshipManagers(state, data) {
			state.relationship_managers = data;
		}
	},

	actions: {
		fetchRelationshipManagers({commit}) {
			axios.get('/api/v1/relationship_managers').then(response => {
				let users = response.data.map(x => {
					return {
						"id": x.id,
						"fullname": [x.firstname, x.middlename, x.lastname].join(' '),
					}
				});
				commit('setRelationshipManagers', users);
			});
		}
	}
};


