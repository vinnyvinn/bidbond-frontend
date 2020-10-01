<template>
    <div>
        <loading v-if="!is_loaded"/>
        <template v-else>
            <table class="table table-striped table-responsive-sm">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registration No</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Deleted At</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(agent, i) in agents" :key="i">
                    <td>{{ pagination.from + i }}</td>
                    <td>{{ agent.name }}</td>
                    <td>{{ agent.email }}</td>
                    <td>{{ agent.phone }}</td>
                    <td>{{ agent.crp }}</td>
                    <td>{{ agent.agent_type }}</td>
                    <td>{{ agent.active ? 'Active' : 'Inactive' }}</td>
                    <td>{{ agent.deleted_at }}</td>
                    <td>
                        <a href="#" class="btn btn-success btn-sm" @click.prevent="restoreAgent(agent.id)"
                           v-if="$can.view($store.getters.getAuthUser, 'restore-agents')">Restore</a>
                    </td>
                </tr>
                <tr v-if="!agents.length">
                    <td :colspan="9">
                        <div class="alert alert-info">No agents found</div>
                    </td>
                </tr>
                </tbody>
            </table>
            <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                        @paginate="fetch"></pagination>
        </template>
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
                axios.get('/api/v1/agents/deleted?page=' + this.pagination.current_page).then(response => {
                    this.is_loaded = true;
                    if(!response.data.hasOwnProperty('data')) return;
                    this.agents = response.data.data;
                    this.pagination = this.pagination = (({total, per_page, current_page, last_page, from, to}) => ({
                        total,
                        per_page,
                        current_page,
                        last_page,
                        from,
                        to
                    }))(response.data);

                });
            },
            restoreAgent(agent_id) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "This will restore the agent user account",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, restore it!'
                }).then((result) => {
                    if (result.value) {
                        axios.post('/api/v1/agent/' + agent_id + '/restore').then(() => {
                            toastr.success('Agent restored successfully.', 'Success');
                            this.$router.replace({name: 'agents.index'});
                        });
                    }
                })
            },
        }
    }
</script>
