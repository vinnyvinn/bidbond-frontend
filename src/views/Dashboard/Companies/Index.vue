<template>
    <div>
        <loading v-if="loading"/>
        <template v-else>
            <table class="table table-striped table-responsive-sm" v-if="companies.length">
                <thead>
                <tr v-if="$store.getters.getAuthUser.role === 'agent'">
                    <th>#</th>
                    <th>Name</th>
                    <th>Reg Number</th>
                    <th>Postal Address</th>
                    <th>Postal Code</th>
                    <th>County</th>
                    <th>Actions</th>
                </tr>
                <tr v-else>
                    <th>#</th>
                    <th>Name</th>
                    <th>Reg Number</th>
                    <th>Phone</th>
                    <th>Approval Status</th>
                    <th>Payment Status</th>
                    <th>Created At</th>
                    <th v-if="$can.view($store.getters.getAuthUser, 'view-companies')">Actions</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="$store.getters.getAuthUser.role === 'agent'">
                    <tr v-for="(company, i) in companies" :key="i">
                        <td>{{ i + pagination.from }}</td>
                        <td>{{ company.name }}</td>
                        <td>{{ company.crp }}</td>
                        <td>{{ company.postal_address }}</td>
                        <td>{{ company.postal_code }}</td>
                        <td>{{ company.county }}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-info" @click.prevent="editModal(company)"><i
                                    class="fa fa-edit"></i> Edit
                            </button>
                            <button type="button" class="btn btn-sm ml-1 btn-danger"
                                    @click.prevent="deleteCompany(company)"><i
                                    class="fa fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr v-for="(company, i) in companies" :key="i">
                        <td>{{ i + pagination.from }}</td>
                        <td>{{ company.name }}</td>
                        <td>{{ company.crp }}</td>
                        <td>{{ company.phone_number }}</td>
                        <td>{{ company.approval_status }}</td>
                        <td>{{ company.paid ? 'Paid' : 'Unpaid' }}</td>
                        <td>{{ company.created_at }}</td>
                        <td v-if="$can.view($store.getters.getAuthUser, 'view-companies')">
                            <router-link :to="{name: 'companies.show', params: { id: company.company_unique_id }}"
                                         class="btn btn-sm btn-warning">show
                            </router-link>
                        </td>
                    </tr>
                </template>

                </tbody>
            </table>
            <div class="alert alert-warning" v-else>
                <p>There are no companies</p>
            </div>
            <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                        @paginate="fetch"></pagination>

        </template>
        <modal v-if="company" :showModal="showModal" @close="showModal = false">
            <template v-slot:header>
                <h5>Edit Company</h5>
            </template>
            <form @submit.prevent="validateForm">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 form-group"
                             :class="{ 'has-feedback has-error': errors.has('company_name')}">
                            <label>Company Name</label>
                            <input type="text" class="form-control" v-validate="'required'" name="company_name"
                                   v-model="company.name">
                            <small class="help-block" v-if="errors.has('company_name')">
                                {{errors.first('company_name')}}
                            </small>
                        </div>
                        <div class="col-md-6 form-group"
                             :class="{ 'has-feedback has-error': errors.has('registration_number')}">
                            <label>Registration Number</label>
                            <input type="text" class="form-control" v-validate="'required'" v-model="company.crp"
                                   placeholder="e.g CPR/2001/2650" name="registration_number">
                            <small class="help-block" v-if="errors.has('registration_number')">
                                {{errors.first('registration_number')}}
                            </small>

                        </div>
                        <div class="col-md-6 form-group"
                             :class="{ 'has-feedback has-error': errors.has('postal_address')}">
                            <label>Company Postal Address</label>
                            <input type="text" placeholder="eg 123" class="form-control" name="postal_address"
                                   v-validate="'required|numeric'" v-model="company.postal_address">
                            <small class="help-block" v-if="errors.has('postal_address')">
                                {{errors.first('postal_address')}}
                            </small>
                        </div>
                        <div class="col-md-6 form-group"
                             :class="{ 'has-feedback has-error': errors.has('postal_code')}">
                            <label>Postal Code</label>
                            <v-select :options="postal_codes" label="code" v-model="company.postal_code_id"
                                      name="postal_code"
                                      :reduce="c => c.id" v-validate="'required'" placeholder="Postal Code"></v-select>
                            <small class="help-block" v-if="errors.has('postal_code')">
                                {{errors.first('postal_code')}}
                            </small>

                        </div>
                        <div class="col-md-6 form-group">
                            <label>County</label>
                            <input type="text" placeholder="County" class="form-control"
                                   v-model="$store.getters.getCounty" readonly/>
                        </div>
                        <div class="col-md-12 form-group">
                            <button class="btn btn-primary pull-right">Submit</button>
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
        },

        data() {
            return {
                companies: [],
                loading: true,
                showModal: false,
                company: {
                    name: '',
                    crp: '',
                    postal_address: '',
                    postal_code_id: null
                },
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                }
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/companies?page=' + this.pagination.current_page).then(response => {
                    this.loading = false;
                    if (!response.data.data) return;
                    this.companies = response.data.data;
                    this.pagination = this.pagination = (({total, per_page, current_page, last_page, from, to}) => ({
                        total,
                        per_page,
                        current_page,
                        last_page,
                        from,
                        to
                    }))(response.data);
                });
                if (!this.postal_codes.length) {
                    this.$store.dispatch("fetchPostalCodes").then(() => {
                        this.loading = false;
                    });
                }
            },
            editModal(company) {
                this.company = company;
                this.showModal = true;
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.update();
                    }
                });
            },
            update() {
                this.company.company_id = this.company.company_unique_id;
                const company = (({company_id, name, crp, postal_address, postal_code_id}) =>
                    ({company_id, name, crp, postal_address, postal_code_id}))(this.company);

                axios.put('/api/v1/companies/agent', company).then(() => {
                    toastr.success("Company updated successfully");
                    this.showModal = false;
                    this.fetch();
                }).catch(err => {
                    if (err.response) {
                        this.error = err.response;
                    }
                });
            },
            deleteCompany(company) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "Are you sure you want to delete the company " + company.name + " ?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.delete('/api/v1/companies/agent', {data: {'company_id': company.company_unique_id}}).then(() => {
                            this.fetch();
                            toastr.success('Company deleted');
                        }).catch(error => {
                            toastr.warning(error.response.data.error);
                        });
                    }
                })
            },
        },
        computed: {
            postal_codes() {
                return this.$store.getters.getPostalCodes;
            },
        },
        watch: {
            'company.postal_code_id'(n) {
                this.$store.dispatch('setCounty', n);
            }
        }
    }
</script>
