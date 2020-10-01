<template>
    <div>
        <template v-if="is_loaded">
            <hr>
            <div class="row">
                <div class="col-md-12">
                    <fieldset>
                        <legend class="text-info">Edit {{ full_name }} ({{ user.role }})</legend>
                        <div v-html="$error.handle(error)"></div>
                        <form @submit.prevent="submit">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group"
                                         :class="{ 'has-feedback has-error': errors.has('first_name')}">
                                        <label>First Name</label>
                                        <input v-validate="'required'" type="text" class="form-control"
                                               v-model="user.firstname"
                                               name="first_name">
                                    </div>
                                    <small class="help-block" v-if="errors.has('first_name')">
                                        {{errors.first('first_name')}}
                                    </small>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Middle Name</label>
                                        <input type="text" class="form-control" v-model="user.middlename"
                                        >
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group"
                                         :class="{ 'has-feedback has-error': errors.has('last_name')}">
                                        <label>Last name</label>
                                        <input type="text" name="last_name" class="form-control" v-model="user.lastname"
                                               v-validate="'required'">
                                    </div>
                                    <small class="help-block" v-if="errors.has('last_name')">
                                        {{errors.first('last_name')}}
                                    </small>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group"
                                         :class="{ 'has-feedback has-error': errors.has('phone_number')}">
                                        <label>Phone </label>
                                        <input type="text" class="form-control" v-validate="'required|max:15'"
                                               name="phone_number" v-model="user.phone_number">
                                    </div>
                                    <small class="help-block" v-if="errors.has('phone_number')">
                                        {{errors.first('phone_number')}}
                                    </small>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group"
                                         :class="{ 'has-feedback has-error': errors.has('id_number')}">
                                        <label>ID Number </label>
                                        <input type="text" class="form-control" v-validate="'required'" name="id_number"
                                               v-model="user.id_number">
                                    </div>
                                    <small class="help-block" v-if="errors.has('id_number')">
                                        {{errors.first('id_number')}}
                                    </small>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group" :class="{ 'has-feedback has-error': errors.has('email')}">
                                        <label>Email</label>
                                        <input name="email" type="text" class="form-control"
                                               v-validate="'required|email'" v-model="user.email">
                                    </div>
                                    <small class="help-block" v-if="errors.has('email')">
                                        {{errors.first('email')}}
                                    </small>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group" :class="{ 'has-feedback has-error': errors.has('role')}">
                                        <label>Role</label>
                                        <select class="form-control" name="role" v-validate="'required'"
                                                v-model="user.role">
                                            <option v-for="role in roles" :value="role.name">{{ role.name | unslug }}
                                            </option>
                                        </select>
                                    </div>
                                    <small class="help-block" v-if="errors.has('role')">
                                        {{errors.first('role')}}
                                    </small>
                                </div>

                                <div class="col-md-12">
                                    <button class="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </form>
                    </fieldset>
                </div>
            </div>
        </template>
        <template v-if=" ! is_loaded">
            <loading/>
        </template>
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
                error: '',
                roles: [],
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
                axios.get('/api/v1/other-roles').then(response => {
                    this.roles = response.data;
                    this.loading = false;
                });
            },

            submit() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        let user = this.user;
                        user.role = user.role.toLowerCase().replace(' ', '_');
                        axios.put('/api/v1/update-user/' + this.$route.params.id, user).then(() => {
                            toastr.success('The users has been updated.', 'Saved');
                            this.$router.push({name: 'users.show', params: {id: this.$route.params.id}});
                        }).catch(error => {
                            this.error = error.response;
                        });
                    }
                });

            }
        },

        computed: {
            full_name() {
                return this.user.firstname + ' ' + this.user.middlename ? this.user.middlename : '' + ' ' + this.user.lastname ? this.user.lastname : '';
            }
        }
    }
</script>
