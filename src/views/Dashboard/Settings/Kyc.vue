<template>
    <div class="tab-pane">
        <button type="button" class="btn btn-black btn-sm pull-right" @click.prevent="kycModal(null)"
                v-if="$can.view($store.getters.getAuthUser, 'create-roles')">Enable/Disable Kyc
        </button>
        <div class="clearfix"></div>
        <table class="table table-hover mt-2">
            <thead>
            <tr>
                <th>#ID</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(kyc, index) in kycStatus" :key="index">
                <td>{{ index+1 }}</td>
                <td>{{ kyc.role.name | unslug }}</td>
                <td>{{ kyc.status ? 'Enabled' : 'Disabled' }}</td>
                <td>
                    <button type="button" class="btn btn-sm mr-2 btn-info" @click.prevent="kycModal(kyc)"><i
                            class="fa fa-edit"></i> Edit
                    </button>
                    <button type="button" @click="deletekyc(kyc.role.id, index)"
                            class="btn btn-danger btn-sm"><i
                            class="fa fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <modal :showModal="showModal" @close="showModal = false">
            <template v-slot:header>
                <h5><span v-if="edit">Edit</span><span v-else>Create New</span> KYC</h5>
            </template>
            <form @submit.prevent="validateForm">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group" :class="{ 'has-feedback has-error': errors.has('role')}">
                            <label>Select Role</label>
                            <select class="form-control" name="role" v-validate="'required'" v-model="kyc.role.id">
                                <option v-for="r in roles" :value="r.id" :key="r.id">{{ r.name | unslug }}</option>
                            </select>
                            <small class="help-block" v-if="errors.has('role')">
                                {{errors.first('role')}}
                            </small>
                        </div>
                        <div class="form-group" :class="{ 'has-feedback has-error': errors.has('status')}">
                            <label>Status</label>
                            <select class="form-control" name="status" v-validate="'required'" v-model="kyc.status">
                                <option value="1">Enable</option>
                                <option value="0">Disable</option>
                            </select>
                            <small class="help-block" v-if="errors.has('status')">
                                {{errors.first('status')}}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <button class="btn btn-primary pull-right" type="submit">
                                <span v-if="edit">Update</span>
                                <span v-else>Create</span>
                            </button>
                        </div>
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
            this.fetchRoles();
        },
        data() {
            return {
                roles: [],
                kyc: {
                    role: {
                        id: null,
                        name: ''
                    },
                    status: null
                },
                kycStatus: {},
                showModal: false,
                edit: true
            }
        },
        methods: {
            fetch() {
                axios.get('/api/v1/kyc-status').then(response => {
                    this.kycStatus = response.data;
                    this.loading = false;
                });
            },
            fetchRoles() {
                axios.get('/api/v1/roles').then(response => {
                    this.roles = response.data;
                })
            },
            deletekyc(id, index) {
                axios.post('/api/v1/kyc-status/delete', {role_id: id}).then(() => {
                    this.kycStatus.splice(index, 1);
                });
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.edit ? this.editKyc() : this.createKyc();
                    }
                });
            },
            kycModal(k) {
                if (k) {
                    this.edit = true;
                    this.kyc = k;
                } else {
                    this.edit = false;
                    this.kyc = {
                        role: {
                            id: null,
                            name: ''
                        },
                        status: null
                    };
                }
                this.showModal = true;
            },
            editKyc() {
                axios.put('/api/v1/kyc-status', {
                    'role_id': this.kyc.role.id,
                    'status': this.kyc.status
                }).then(() => {
                    this.showModal = false;
                    toastr.success('The kyc status has been updated', 'Success');
                    this.fetch();
                });
            },
            createKyc() {
                axios.post('/api/v1/kyc-status', {
                    'role_id': this.kyc.role.id,
                    'status': this.kyc.status
                }).then(() => {
                    this.showModal = false;
                    toastr.success('The kyc status has been created', 'Success');
                    this.fetch();
                });
            }
        }
    }
</script>
