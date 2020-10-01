<template>
    <div>
        <table class="table table-striped table-responsive-sm" v-if="is_loaded">
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Status</th>
                <th>Limit</th>
                <th>Balance</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(agent, i) in agents" :key="i">
                <td>{{ pagination.from + i }}</td>
                <td>{{ agent.name }}</td>
                <td>{{ agent.email }}</td>
                <td>{{ agent.phone }}</td>
                <td>{{ agent.agent_type }}</td>
                <td>{{ agent.active ? 'Active' : 'Inactive' }}</td>
                <td>{{ $number.format(agent.limit) }}</td>
                <td>{{ $number.format(agent.balance) }}</td>
                <td>
                    <router-link :to="{name: 'agents.show', params: { id: agent.id }}"
                                 class="btn btn-sm mr-1 btn-warning">show
                    </router-link>
                    <a href="#" class="btn btn-danger btn-sm" @click.prevent="deleteAgent(agent.id)"
                       v-if="$can.view($store.getters.getAuthUser, 'delete-agents')">Delete</a>
                </td>
            </tr>
            <tr v-if="!agents.length">
                <td :colspan="9">
                    <div class="alert alert-info">No agents found</div>
                </td>
            </tr>
            </tbody>
        </table>
        <loading v-else/>
        <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                    @paginate="fetch"></pagination>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },

        data() {
            return {
                agents: [],
                is_loaded: false,
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                }
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/agents?page=' + this.pagination.current_page).then(response => {
                    this.is_loaded = true;
                    if(!response.data.hasOwnProperty('data')) return;
                    this.agents = response.data.data;
                    this.pagination = (({total, per_page, current_page, last_page, from, to}) => ({
                        total,
                        per_page,
                        current_page,
                        last_page,
                        from,
                        to
                    }))(response.data);
                });
            },
            deleteAgent(agent_id) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "This will delete the agent and their linked user account.You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.delete('/api/v1/agents/'+ agent_id).then(() => {
                            toastr.success('Agent deleted successfully.', 'Success');
                            this.fetch();
                        });
                    }
                })
            },
        }
    }
</script>
