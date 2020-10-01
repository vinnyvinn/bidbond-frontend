<template>
    <div>
        <template v-if="!loading">
            <div class="col-md-12" v-html="$error.handle(error)"></div>
            <table class="table table-striped table-responsive-sm">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, i) in users" :key="i">
                    <td>{{ pagination.from + i }}</td>
                    <td>{{ user.firstname }} {{ user.middlename }} {{ user.lastname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.roles[0] ? user.roles[0].name : '' | unslug }}</td>
                    <td>{{ user.active ? 'Active' : 'Inactive' }}</td>
                    <td>{{ user.created_at }}</td>
                    <td>
                        <a href="#" class="btn btn-success btn-sm" @click.prevent="restoreUser(user.id)"
                           v-if="$can.view($store.getters.getAuthUser, 'restore-user')">Restore</a>
                    </td>
                </tr>
                <tr v-if="!users.length">
                    <td colspan="7">
                        <div class="alert alert-info">No users found</div>
                    </td>
                </tr>
                </tbody>
            </table>
            <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                        @paginate="fetch"></pagination>
        </template>
        <loading v-else/>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },

        data() {
            return {
                error:'',
                users: [],
                loading: false,
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                }
            }
        },

        methods: {
            fetch() {
                this.loading = true;
                axios.get('/api/v1/users/deleted?page=' + this.pagination.current_page).then(response => {
                    this.loading = false;
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
                }).catch(err => {
                    this.loading = false;
                    if (err.response) {
                        this.error = err.response;
                    }
                });
            },
            restoreUser(user_id) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "This will restore the user account",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, restore it!'
                }).then((result) => {
                    if (result.value) {
                        axios.post('/api/v1/user/'+ user_id +'/restore').then(() => {
                            toastr.success('User restored successfully.', 'Success');
                            this.$router.replace({name: 'users.index'});
                        }).catch(err => {
                            this.loading = false;
                            if (err.response) {
                                this.error = err.response;
                            }
                        });
                    }
                })
            },
        }
    }
</script>
