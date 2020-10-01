<template>
    <div>
        <div>
            <button type="button" class="btn btn-black pull-right" @click.prevent="roleModal(null)"
                    v-if="$can.view($store.getters.getAuthUser, 'create-roles')">Create Role
            </button>
            <h4>User Roles</h4>
        </div>
        <table class="table table-striped table-responsive-sm">
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Created At</th>
                <th v-if="$can.view($store.getters.getAuthUser, 'create-roles')">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(role, i) in roles" v-bind:key="role.id">
                <td>{{ i+1 }}</td>
                <td>{{ role.name | unslug}}</td>
                <td>{{ role.created_at | stampTodateFilter }}</td>
                <td v-if="$can.view($store.getters.getAuthUser, 'create-roles')">
                    <button type="button" class="btn btn-sm btn-info" @click.prevent="roleModal(role)"><i
                            class="fa fa-edit"></i> Edit
                    </button>
                    <button type="button" class="btn btn-sm ml-1 btn-danger" @click.prevent="deleteRole(role)"><i
                            class="fa fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
            </tbody>
        </table>

        <modal :showModal="showModal" @close="showModal = false">
            <template v-slot:header>
                <h5 v-if="role">Edit Role</h5>
                <h5 v-else>Create New Role</h5>
            </template>
            <form @submit.prevent="save">
                <div class="row">
                    <div class="col-md-12" v-html="$error.handle(error)"></div>
                    <div class="form-group col-md-12">
                        <label>Name</label>
                        <input type="text" class="form-control" v-model="name">
                    </div>
                    <div class="form-group col-md-12">
                        <button class="btn btn-primary pull-right" type="submit">
                            <span v-if="role">Update</span>
                            <span v-else>Create</span>
                        </button>
                    </div>
                </div>
            </form>
        </modal>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },

        data() {
            return {
                roles: [],
                showModal: false,
                role: null,
                name: '',
                error: ''
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/roles').then(response => {
                    this.roles = response.data;
                    this.loading = false;
                });
            },
            save() {
                if (this.role) {
                    this.edit();
                    return;
                }

                axios.post('/api/v1/role/create', {'name': this.name.replace(/ /g, '_')}).then(() => {
                    this.showModal = false;
                    this.fetch();
                    this.name = '';
                    this.role = null;
                    toastr.success('Role Created');
                });
            },
            edit() {
                this.role.name = this.name.replace(/ /g, '_');
                axios.post('/api/v1/role/update', this.role).then(() => {
                    this.showModal = false;
                    this.fetch();
                    this.name = '';
                    this.role = null;
                    toastr.success('Role updated');
                }).catch(error => {
                    this.error = error.response;
                });
            },
            deleteRole(role) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "Are you sure you want to delete the role " + role.name + " ?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.post('/api/v1/role/delete', role).then(() => {
                            this.fetch();
                            this.role = null;
                            toastr.success('Role deleted');
                        }).catch(error => {
                            toastr.warning(error.response.data.error);
                        });
                    }
                })
            },
            roleModal(role) {
                if (role != null) {
                    this.role = role;
                    this.name = role.name;
                } else {
                    this.role = null;
                }
                this.showModal = true;
            }
        }
    }
</script>
