<template>
    <div>
        <h5>Company Users</h5>
        <button @click.prevent="showModal = true" v-if="canLinkUser" class="btn btn-sm btn-outline-primary"><i class="fa fa-user-plus"></i>
            Add User
        </button>
        <modal :showModal="showModal" @close="showModal = false">
            <template v-slot:header>
                <h5>Add User</h5>
            </template>
            <form @submit.prevent="validateForm">
                <div v-html="$error.handle(error)"></div>
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 form-group"
                             :class="{ 'has-feedback has-error': errors.has('email')}">
                            <label>Email</label>
                            <input type="text" class="form-control" placeholder="Enter user email"
                                   v-validate="'required|email'" name="email"
                                   v-model="email">
                            <small class="help-block" v-if="errors.has('email')">
                                {{errors.first('email')}}
                            </small>
                        </div>
                        <div class="col-md-12 form-group">
                            <button type="submit" class="btn btn-primary pull-right">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </modal>
        <loading v-if="! is_loaded"/>
        <table class="table table-striped table-responsive-sm mt-2" v-else>
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>ID Number</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, i) in users" :key="i">
                <td>{{ 1 + i }}</td>
                <td>{{ user.firstname }} {{ user.middlename }} {{ user.lastname }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone_number }}</td>
                <td>{{ user.id_number }}</td>
                <td>
                    <button type="button"  v-if="canLinkUser" class="btn btn-sm mr-1 btn-danger" @click.prevent="deleteUser(user)"><i
                            class="fa fa-trash"></i> Unlink
                    </button>
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
                email: null,
                showModal: false,
                error: ''
            }
        },

        methods: {
            fetch() {
                this.is_loaded = false;
                axios.get('/api/v1/companies/' + this.$route.params.id + '/users').then(response => {
                    this.is_loaded = true;
                    this.users = response.data;
                });
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                       this.is_loaded = false;
                        axios.post('/api/v1/companies/' + this.$route.params.id + '/users', {
                            'email': this.email
                        }).then(() => {
                            this.is_loaded = true;
                            this.email = null;
                            this.showModal = false;
                            this.fetch();
                        }).catch(err => {
                          console.log('error => '+err)
                            this.is_loaded = true;
                            this.error = err.response;
                        });
                    }
                });
            },
            deleteUser(user) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "You are about to unlink the user " + user.firstname + " from the company!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, Unlink!'
                }).then((result) => {
                    if (result.value) {
                        axios.post('/api/v1/companies/users/unlink', {
                            'email': user.email,
                            'company_id': this.$route.params.id
                        }).then(() => {
                            this.is_loaded = true;
                            this.fetch();
                        }).catch(err => {
                            this.error = err.response;
                        });
                    }
                })
            }
        },
        computed:{
            canLinkUser(){
                let u = this.users.find(x => x.email === this.$store.getters.getAuthUser.email);
                return  (u && u.creator === 1) || this.$can.view(this.$store.getters.getAuthUser, 'attach-company-users');
            }
        }
    }
</script>
