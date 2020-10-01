<template>
    <div>
        <loading v-if="! is_loaded"/>
        <table class="table table-striped table-responsive-sm" v-else>
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th v-if="$can.view($store.getters.getAuthUser, 'view-user')">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, i) in users" :key="i">
                <td>{{ pagination.from + i }}</td>
                <td>{{ user.firstname }} {{ user.middlename }} {{ user.lastname }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role | unslug }}</td>
                <td>{{ user.active ? 'Active' : 'Inactive' }}</td>
                <td>{{ user.created_at }}</td>
                <td v-if="$can.view($store.getters.getAuthUser, 'view-user')">
                    <router-link :to="{name: 'users.show', params: { id: user.user_unique_id }}"
                                 class="btn btn-sm btn-warning">show
                    </router-link>
                </td>
            </tr>
            <tr v-if="!users.length">
                <td :colspan="$can.view($store.getters.getAuthUser, 'view-user') ? 8 : 7">
                    <div class="alert alert-info">No users found</div>
                </td>
            </tr>
            </tbody>
        </table>
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
                users: [],
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
                this.is_loaded = false;
                axios.get('/api/v1/users?page=' + this.pagination.current_page).then(response => {
                    this.is_loaded = true;
                    if(!response.data.hasOwnProperty('data')) return;
                    this.users = response.data.data;
                    this.pagination = this.pagination = (({total, per_page, current_page, last_page, from, to}) => ({
                        total,
                        per_page,
                        current_page,
                        last_page,
                        from,
                        to
                    }))(response.data);
                });
            }
        }
    }
</script>
