<template>
    <div>
        <div class="card">
            <div class="card-header">
                <h3>Manage Roles and Permissions</h3>
            </div>
            <div class="card-body">
                <form @submit.prevent="attachPermission">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>Name</label>
                                <select class="form-control" v-model="perm.role" @change="fetchRolePermissions">
                                    <option v-for="role in roles" :value="role">{{ role.name | unslug }}</option>
                                </select>
                            </div>
                            <div>
                                <p>Select Permissions to Attact to Role</p>
                                <hr>
                                <div class="row">
                                    <div class="col-md-4" v-for="(permission) in permissions">
                                        <div class="form-group">
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" :id="permission.id"
                                                       v-model="perm.permission" :value="permission.id">
                                                <label class="custom-control-label" :for="permission.id">{{permission.name}}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div>
                                <p>Commissions for this role</p>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="custom-control custom-checkbox custom-control-inline">
                                                <input type="checkbox" class="custom-control-input"
                                                       id="earns-commissions" v-model="perm.earns_commission" value="1">
                                                <label class="custom-control-label" for="earns-commissions">Earns a
                                                    commission</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12" v-if="perm.earns_commission == 1">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Percentage on bidbonds generated</label>
                                                    <input type="number" class="form-control" step=".0001"
                                                           v-model="perm.commission.amount"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <button class="btn btn-primary pull-right" type="submit">Attach Permissions</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                roles: [],
                permissions: [],
                perm: {
                    permission: [],
                    roleid: '',
                    commission: {}
                }
            }
        },
        mounted() {
            this.fetchRoles();
            this.fetchPermissions();
        },

        methods: {
            fetchRoles() {
                axios.get('/api/v1/roles').then(response => {
                    this.roles = response.data;
                    this.loading = false;
                });
            },

            fetchRolePermissions() {
                axios.post('/api/v1/role/abilities', {role: this.perm.role}).then(response => {
                    this.perm.permission = response.data.permissions;
                    if (response.data.commission) {
                        this.perm.earns_commission = true;
                        this.perm.commission = response.data.commission;
                    } else {
                        this.perm.commission = {};
                    }
                });
            },

            fetchPermissions() {
                axios.get('/api/v1/permissions').then(response => {
                    this.permissions = response.data;
                    this.loading = false;
                });
            },

            attachPermission() {
                let data = this.perm;
                data.permission = this.perm.permission;
                data.role = this.perm.role;
                axios.post('/api/v1/attach/permissions', data).then(() => {
                    toastr.success('Perissions updated');
                });
            }
        },
    }
</script>

