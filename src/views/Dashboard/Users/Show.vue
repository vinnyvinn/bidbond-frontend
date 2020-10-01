<template>
    <div>
        <template v-if="is_loaded">
            <h5 align="center">{{ full_name }} ({{ user.role | unslug }})</h5>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <table class="table table-striped table-responsive-sm">
                        <tbody>
                        <tr>
                            <td><strong>Email</strong></td>
                            <td>{{ user.email }}</td>
                        </tr>
                        <tr>
                            <td><strong>Phone Number</strong></td>
                            <td>{{ user.phone_number }}</td>
                        </tr>
                        <tr>
                            <td><strong>ID number</strong></td>
                            <td>{{ user.id_number }}</td>
                        </tr>
                        <tr v-if="user.role === 'relationship_manager'">
                            <td><strong>RM Code</strong></td>
                            <td>{{ user.user_unique_id }}</td>
                        </tr>
                        <tr>
                            <td><strong>Joined On</strong></td>
                            <td>{{ user.created_at }}</td>
                        </tr>

                        <tr v-if="$can.view($store.getters.getAuthUser, 'suspend-user')">
                            <td><strong>Action</strong></td>
                            <td>
                                <a href="#" class="btn btn-warning btn-sm" @click.prevent="suspend"
                                   v-if="user.active == 1">Suspend</a>
                                <a href="#" class="btn btn-danger btn-sm ml-2" @click.prevent="deleteUser"
                                   v-if="deletable">Delete</a>
                                <a href="#" class="btn btn-success btn-sm" @click.prevent="activate"
                                   v-if="user.active == 0">Activate</a>
                                <router-link :to="{ name: 'users.edit' , params: { id : this.$route.params.id }}"
                                             v-if="$can.view($store.getters.getAuthUser, 'edit-user')"
                                             class="btn btn-primary btn-sm pull-right">Edit
                                </router-link>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6" v-if="$can.view($store.getters.getAuthUser, 'create-users')">
                    <div class="card">
                        <h5>User Permissions</h5>
                        <hr>
                        <ol>
                            <li v-for="permission in user.permissions">{{ permission.title }}</li>
                        </ol>
                        <br>
                        <a href="#" class="btn btn-primary btn-sm" @click.prevent="show_roles_modal = true">Change
                            Role</a>
                        <modal :showModal="show_roles_modal" @close="show_roles_modal = false">
                            <template v-slot:header>
                                <h5>Change Role</h5>
                            </template>
                            <div v-html="$error.handle(error)"></div>
                            <form @submit.prevent="changeRole">
                                <div class="form-group">
                                    <select class="form-control" v-model="new_role">
                                        <option v-for="role in roles" :value="role.name">{{ role.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </modal>
                    </div>
                </div>
            </div>
        </template>
        <loading v-else/>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
            this.fetchRoles();
        },

        data() {
            return {
                user: {},
                is_loaded: false,
                show_roles_modal: false,
                roles: [],
                new_role: '',
                error: '',
            }
        },

        methods: {
            fetch() {
                this.is_loaded = false;
                axios.get('/api/v1/user/' + this.$route.params.id).then(response => {
                    this.user = response.data;
                    this.is_loaded = true;
                });
            },

            fetchRoles() {
                axios.get('/api/v1/roles').then(response => {
                    this.roles = response.data;
                });
            },
            deleteUser() {
                this.$swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.post('/api/v1/user/delete', {
                            userid: this.user.user_unique_id
                        }).then(() => {
                            toastr.success('User deleted successfully.', 'Success');
                            this.$router.replace({name: 'users.index'});
                        });
                    }
                })
            },
            changeRole() {
                axios.post('/api/v1/change-user-role', {
                    userid: this.user.user_unique_id,
                    role: this.new_role
                }).then(() => {
                    toastr.success('User role updated.', 'Saved');
                    this.show_roles_modal = false;
                    this.fetch();
                }).catch(error => {
                    if (error.response) {
                        if (error.response.status === 401) {
                            this.error = error.response.data.error;
                        } else {
                            this.error = error.response.data.message;
                        }
                    }
                });
            },

            suspend() {
                axios.post('/api/v1/suspend-user', {userid: this.user.user_unique_id}).then(() => {
                    toastr.success(this.user.firstname + ' has been suspended');
                    this.fetch();
                });
            },

            activate() {
                axios.post('/api/v1/activate-user', {userid: this.user.user_unique_id}).then(() => {
                    toastr.success(this.user.firstname + ' has been activated');
                    this.fetch();
                });
            }
        },

        computed: {
            full_name() {
                return this.user.firstname + ' ' + this.user.middlename ? this.user.middlename : '' + ' ' + this.user.lastname ? this.user.lastname : '';
            },
            deletable() {
                return this.user.role !== "customer" && this.$can.view(this.$store.getters.getAuthUser, 'delete-users');
            }
        }
    }
</script>
