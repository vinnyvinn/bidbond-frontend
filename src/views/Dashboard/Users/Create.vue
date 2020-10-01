<template>
    <fieldset class="container">
        <legend class="text-info">Create A User</legend>
        <div v-html="$error.handle(user_error)"></div>
        <form @submit.prevent="validateForm">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('first_name')}">
                        <label>First Name</label>
                        <input type="text" class="form-control" name="first_name" v-validate="'required'"
                               v-model="user.firstname">
                        <small class="help-block" v-if="errors.has('first_name')">
                            {{errors.first('first_name')}}
                        </small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Middle Name</label>
                        <input type="text" class="form-control" v-model="user.middlename">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('last_name')}">
                        <label>Last name</label>
                        <input name="last_name" type="text" class="form-control" v-validate="'required'"
                               v-model="user.lastname">
                        <small class="help-block" v-if="errors.has('last_name')">
                            {{errors.first('last_name')}}
                        </small>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('email')}">
                        <label>Email</label>
                        <input name="email" v-validate="'required|email'" type="email"
                               class="form-control" v-model="user.email">
                        <small class="help-block" v-if="errors.has('email')">
                            {{errors.first('email')}}
                        </small>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('phone_number')}">
                        <label>Phone </label>
                        <phone-number name="phone_number" v-validate="'required|numeric|min:10|max:15'"
                                      v-model="user.phone_number"/>
                        <small class="help-block" v-if="errors.has('phone_number')">
                            {{errors.first('phone_number')}}
                        </small>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" :class="{ 'has-feedback has-error': errors.has('id_number')}">
                        <label>ID Number </label>
                        <input v-validate="'required'" type="text" class="form-control" name="id_number"
                               v-model="user.id_number">
                        <small class="help-block" v-if="errors.has('id_number')">
                            {{errors.first('id_number')}}
                        </small>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group">
                        <label>Role</label>
                        <select class="form-control" name="role" v-validate="'required'"
                                v-model="user.role">
                            <option v-for="role in roles" :key="role">{{ role | unslug }}</option>
                        </select>
                        <small class="help-block" v-if="errors.has('id_number')">
                            {{errors.first('id_number')}}
                        </small>
                    </div>
                </div>

                <div class="col-md-12">
                    <div class="form-group">
                        <button class="btn btn-primary pull-right">Create User</button>
                    </div>
                </div>
            </div>
        </form>
    </fieldset>
</template>

<script>
    export default {
        mounted() {
            this.fetchRoles();
        },
        components: {},
        data() {
            return {
                roles: [],
                user: {
                    firstname: '',
                    middlename: '',
                    lastname: '',
                    email: '',
                    role: '',
                    id_number: '',
                    phone_number: '254'
                },
                user_error: '',
            }
        },
        methods: {
            fetchRoles() {
                axios.get('/api/v1/other-roles').then(response => {
                    const r = response.data;
                    this.roles = r.filter(x => x.name !== 'agent').map(x => x.name);
                    this.loading = false;
                });
            },
            createUser() {
                let user = this.user;
                user.role = user.role.toLowerCase().replace(' ', '_');
                axios.post('/api/v1/user/create', user).then(() => {
                    toastr.success('User ' + this.user.firstname + ' has been created');
                    this.$router.push({name: "users.index"});
                }).catch(error => {
                    this.user_error = error.response;
                });
            },

            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.createUser();
                    }
                });
            },
        },
    }
</script>
