<template>
    <div class="show-company">
        <div class="card" v-if="$can.view($store.getters.getAuthUser, 'view-companies')">
            <h6 class="text-primary text-center">COMPANY DETAILS</h6>
            <hr>
            <div class="row">
                <div class="col-md-12 mb-2">
                    <template v-if="company.approval_status === 'pending' && company.paid==1">
                        <button type="button" @click.prevent="adminApproval"
                                v-if="$can.view($store.getters.getAuthUser, 'approve-companies')"
                                class="btn btn-success btn-sm"><i class="fa fa-check"></i> Approve
                        </button>
                        <router-link
                                :to="{ name: 'companies.directors.create', params: { id: this.$route.params.id }}"
                                v-if="$can.view($store.getters.getAuthUser, 'add-directors')"
                                class="btn btn-info btn-sm" style="margin-left: 20px"><i class="fa fa-user-plus"></i>
                            Add Directors
                        </router-link>
                    </template>
                    <template v-if="$store.getters.getAuthUser.kyc_status && !company.paid">
                        <router-link :to="{ name: 'companies.payment', params: { id: this.$route.params.id }}"
                                     class="btn btn-info btn-sm" style="margin-left:20px"><i class="fa fa-money"></i>
                            Pay for company search
                        </router-link>
                    </template>
                    <button class="btn btn-info btn-sm ml-2" @click.prevent="showModal=true"
                            v-if="set_limit"><i class="fa fa-cogs"></i>
                        Update Limit
                    </button>
                    <router-link :to="{ name: 'companies.users', params: { id: this.$route.params.id }}"
                                 class="btn btn-outline-info btn-sm ml-2"><i class="fa fa-users"></i>
                        View Users
                    </router-link>
                    <button class="btn btn-info btn-sm ml-2" @click.prevent="showEditModal=true"
                            v-if="$can.view($store.getters.getAuthUser, 'update-companies')"><i class="fa fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-danger btn-sm ml-2" @click.prevent="deleteCompany()"
                            v-if="$can.view($store.getters.getAuthUser, 'delete-companies')"><i class="fa fa-trash"></i>
                        Delete
                    </button>
                </div>
                <div class="col-md-6">
                    <p>Name: <span>{{ company.name }}</span></p>
                    <p>Registration Number: <span>{{ company.crp }}</span></p>
                    <p>Phone Number: <span>{{ company.phone_number }}</span></p>
                    <p>KRA PIN: <span>{{ company.kra_pin }}</span></p>
                    <p v-if="$store.getters.getAuthUser.role !== 'agent'">Paid Status: <span>{{ company.paid ? 'Paid' : 'Unpaid' }}</span>
                    </p>
                    <p>Limit: <span>KES {{ $number.format(limit)}}</span></p>
                    <p v-if="set_limit">Pricing Group: <span>{{ groupname | unslug }}</span></p>
                </div>
                <div class="col-md-6">
                    <p>Physical Address: <span>{{ company.physical_address }}</span></p>
                    <p>Postal Address: <span>{{ company.postal_address }}</span></p>
                    <p>Email Address: <span>{{ company.email }}</span></p>
                    <p v-if="$store.getters.getAuthUser.role !== 'agent'">Approval Status: <span>{{ company.approval_status }}</span>
                    </p>
                    <p>Balance: <span>KES {{ $number.format(balance)}}</span></p>
                </div>
            </div>
        </div>
        <div class="row" v-if="view_directors">
            <div class="col-md-3">
                <div class="nav flex-column nav-pills">
                    <a href="#" class="nav-link" @click.prevent="show = 1" :class="show == 1 ? 'active' : ''">Directors</a>
                    <a href="#" class="nav-link" @click.prevent="show = 2" :class="show == 2 ? 'active' : ''">Documents</a>
                </div>
            </div>
            <div class="col-md-9">
                <div class="the-content">
                    <template v-if="show == 1">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Email Address</th>
                                <th>ID Number</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(director, i) in company.directors">
                                <td>{{ i+1 }}</td>
                                <td>{{ director.firstname + ' ' + director.middlename + ' ' + director.lastname }}</td>
                                <td>{{ director.phone_number }}</td>
                                <td>{{ director.email }}</td>
                                <td>{{ director.id_number }}</td>
                                <td>{{ ((director.pivot.verified == '1') ? 'Approved' : 'Pending') }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </template>
                    <template v-if="show == 2">
                        <div style="text-align: right; margin-bottom: 10px;">
                            <a href="#" @click.prevent="showUploadModal = true" class="btn btn-info btn-sm"
                               v-if="$can.view($store.getters.getAuthUser, 'upload-documents')"><i
                                    class="fa fa-upload"></i> Upload Documents</a>
                        </div>
                        <modal :showModal="showUploadModal" @close="showUploadModal = false"
                               v-if="$can.view($store.getters.getAuthUser, 'upload-documents')">
                            <template v-slot:header>
                                <h5>Upload Documents</h5>
                            </template>
                            <div v-html="$error.handle(error)"></div>
                            <form @submit.prevent="uploadDocuments">
                                <div class="form-group">
                                    <label>Select File</label>
                                    <input type="file" class="form-control" ref="the_document" required="">
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-primary">Upload</button>
                                </div>
                            </form>
                        </modal>
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Document Name</th>
                                <th v-if="$can.view($store.getters.getAuthUser, 'download-documents')">Download</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(doc, i) in company.docs" :key="i">
                                <td>{{ i+1 }}</td>
                                <td>{{ doc.name }}</td>
                                <td v-if="$can.view($store.getters.getAuthUser, 'download-documents')">
                                    <button class="btn btn-sm btn-outline-primary" @click.prevent="download(doc)">
                                        Download <i class="fa fa-download"></i>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </template>
                </div>
            </div>
        </div>
        <modal :showModal="showModal" @close="showModal = false">
            <template v-slot:header>
                <h5>Adjust Company Limit</h5>
            </template>
            <div v-html="$error.handle(error)"></div>
            <form @submit.prevent="updateLimit">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>Limit</label>
                            <vue-numeric type="text" class="form-control" v-model="limit"/>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <button class="btn btn-primary pull-right" type="submit">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </modal>
        <modal :showModal="showEditModal" @close="showEditModal = false">
            <template v-slot:header>
                <h5>Edit Company</h5>
            </template>
            <edit-form :company="company"/>
        </modal>
    </div>
</template>

<script>
    import EditForm from "@/views/Dashboard/Companies/Edit.vue";

    export default {
        components: {
            EditForm
        },
        mounted() {
          console.log('mounted => '+this.$route.params.id)
            this.fetch();
        },
        data() {
            return {
                loading: true,
                company: {},
                show: 1,
                showUploadModal: false,
                showEditModal: false,
                showModal: false,
                error: '',
                limit: 0,
                balance: 0,
                groupname: ''
            }
        },
      watch:{
        company(){
          return this.company;
        }
      },
        methods: {
            fetch() {
                axios.get('/api/v1/companies/' + this.$route.params.id).then(response => {
                    this.loading = false;
                    this.groupname = response.data.group;
                    this.company = response.data.data;
                    this.limit = response.data.limit;
                    this.balance = response.data.balance;
                    this.setDocuments();

                    if (this.company.approval_status !== 'approved')
                        this.displayMessage();
                });
            },
            updateLimit() {
                axios.post('/api/v1/companies/limit', {
                    'company_id': this.company.company_unique_id,
                    'limit': this.limit
                }).then(() => {
                    this.showModal = false;
                    this.fetch();
                    toastr.success('Company limit updated');
                }).catch(error => {
                    if (error.response) {
                        this.error = error.response;
                    }
                });
            },
            download(doc) {
                axios({
                    url: '/api/v1/company/attachments',
                  method: 'POST',
                  data:{company_id:this.company.company_unique_id,path:doc.path},
                  responseType: 'blob',
                    params: {
                        'company_id': this.company.company_unique_id,
                        'path': doc.path
                    }
                }).then((response) => {
                    var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', doc.name + '.pdf');
                    document.body.appendChild(fileLink);

                    fileLink.click();
                }).catch(error => {
                    if (error.response) {
                        this.error = error.response;
                    }
                });
            },
            deleteCompany() {
                this.$swal({
                    title: 'Are you sure?',
                    text: "You are about to delete " + this.company.name,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.delete('/api/v1/companies/' + this.company.id).then(() => {
                            toastr.success('Company deleted successfully.', 'Success');
                            this.$router.push({name: 'companies.index'});
                        });
                    }
                })
            },

            setDocuments() {
                this.company.docs = this.company.docs.map(doc => {
                    doc.fullPath = process.env.VUE_APP_API_URL + '/' + doc.path;
                    return doc;
                })
            },

            uploadDocuments() {
                let the_document = this.$refs.the_document.files[0];

                const myData = new FormData();
                myData.append('company_document', the_document);
                myData.append('company_id', this.$route.params.id);

                axios.post('/api/v1/upload-company-document', myData, {headers: {'content-type': 'multipart/form-data'}}).then(() => {
                    toastr.success('Document uploaded', 'Saved');
                    this.showUploadModal = false;
                    this.fetch();
                }).catch(error => {
                    if (error.response) {
                        this.error = error.response;
                    }
                });
            },
            checkApproval() {
                this.loading = true;
                axios.post('/api/v1/company-approval', {
                    'crp': this.company.crp,
                    'company_id': this.company.id
                }).then(response => {
                    this.loading = false;
                    this.company.approval_status = response.data.company.approval_status;
                });
            },
            adminApproval() {
                this.loading = true;
                axios.post('/api/v1/approve-by-admin', {company_id: this.company.company_unique_id}).then(resp => {
                  this.loading = false;
                  console.log('iii')
                    toastr.success(resp.data);
                    this.$router.push({name: 'companies.index'});
                }).catch(error => {
                    this.loading = false;
                    toastr.error(error.response.message);
                });
            },
            displayMessage() {
                if (this.company.remaining_directors >= 2 && this.company.current_director <= 2) {
                    this.$swal(this.company.name, 'Need to add and verify at least 2 director', 'error');
                }
                if (this.company.remaining_directors <= 2 && this.company.current_director < 1) {
                    this.$swal(this.company.name, 'Need to add and verify at least 1 director', 'error');
                }
                this.checkApproval();
            }
        },
        computed: {
            view_directors() {
                return this.$store.getters.getAuthUser.role !== 'agent' && this.$can.view(this.$store.getters.getAuthUser, 'view-companies')
            },
            set_limit() {
                return this.$can.view(this.$store.getters.getAuthUser, 'update-companies-limit') && this.company.approval_status === 'approved';
            }
        }
    }
</script>
