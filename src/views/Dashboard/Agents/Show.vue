<template>
    <div class="row">
        <div class="col-md-12" v-html="$error.handle(error)"></div>
        <template v-if="is_loaded">
            <div class="col-md-4">
                <p><strong>Agency Name:</strong> {{agent.name}}</p>
                <p v-if="agent.agent_type === 'business'"><strong>Physical Address: </strong> {{ agent.physical_address
                    }}</p>
                <p><strong>Limit: </strong> KES {{ $number.format(agent.limit)}}</p>
                <p><strong>Created at: </strong> {{agent.created_at | dateFilter }}</p>
                <p><b>Customer ID: </b> {{ agent.customerid}}</p>
                <p><b>Account: </b> {{ agent.account}}</p>
            </div>
            <div class="col-md-4">
                <p v-if="agent.agent_type === 'business'"><strong> Registration Number: </strong> {{ agent.crp }}</p>
                <p><strong>Postal Address: </strong> {{ agent.postal_address }}</p>
                <p><strong>Balance: </strong> KES {{ $number.format(agent.balance)}}</p>
                <p><b>Pricing Group: </b> <span v-if="agent.group">{{agent.group.name | unslug}}</span></p>
            </div>
            <div class="col-md-4">
                <button type="button" v-if="this.$can.view(this.current_user, 'update-agent')"
                        class="btn btn-sm btn-primary"
                        @click.prevent="agentModal(agent)"><i
                        class="fa fa-edit"></i> Edit
                </button>
                <template v-if="create_agent_user">
                    <button class="btn btn-sm btn-outline-info ml-1"
                            @click.prevent="showCreateModal = true"><i class="f fa-add-user"></i> Add User
                    </button>
                    <a href="#" class="btn btn-danger btn-sm ml-1" @click.prevent="deleteAgency"
                       v-if="$can.view($store.getters.getAuthUser, 'delete-agents')"><i class="fa fa-trash"></i> Delete</a>
                </template>
            </div>
            <div class="col-md-12">
                <h6 class="mt-1">Agency Users</h6>
                <table class="table table-striped mt-2 table-responsive-sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>ID Number</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-if="users.length">
                        <tr v-for="(user, i) in users" :key="i">
                            <td>{{ i+1 }}</td>
                            <td>{{ user.firstname }} {{ user.middlename }} {{ user.lastname }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.phone_number }}</td>
                            <td>{{ user.id_number }}</td>
                            <td>{{ user.active ? 'Active' : 'Inactive' }}</td>
                            <td>{{ user.created_at | dateFilter }}</td>
                            <td>
                                <router-link :to="{name: 'users.show', params: { id: user.user_unique_id }}"
                                             class="btn btn-sm btn-warning">View
                                </router-link>
                                <button @click.prevent="delinkUser(user)" class="btn ml-1 btn-sm btn-danger"
                                        v-if="create_agent_user && user.email !== $store.getters.getAuthUser.email"><i
                                        class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="8">
                            <div class="alert alert-info">No users found</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <modal :showModal="showModal" @close="showModal = false">
                <template v-slot:header>
                    <h5>Edit Agent</h5>
                </template>
                <form @submit.prevent="validateForm()">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12" v-html="$error.handle(error)"></div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('agent_type')}">
                                <label>Select Agent Type</label>
                                <select class="form-control" name="agent_type" v-model="e_agent.agent_type"
                                        v-validate="'required'">
                                    <option value="individual">Individual</option>
                                    <option value="business">Business</option>
                                </select>
                                <small class="help-block" v-if="errors.has('agent_type')">
                                    {{errors.first('agent_type')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('agent_name')}">
                                <label class="control-label">Agent Name</label>
                                <input type="text" v-model="e_agent.name" name="agent_name"
                                       v-validate="'required'" class="form-control">
                                <small class="help-block" v-if="errors.has('agent_name')">
                                    {{errors.first('agent_name')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('email')}">
                                <label class="control-label">Email</label>
                                <input type="text" v-model="e_agent.email" name="email"
                                       v-validate="'required|email'" class="form-control">
                                <small class="help-block" v-if="errors.has('email')">
                                    {{errors.first('email')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('phone')}">
                                <label class="control-label">Phone</label>
                                <input type="text" v-model="e_agent.phone" class="form-control"
                                       name="phone"
                                       v-validate="'required|numeric|min:10|max:15'">
                                <small class="help-block" v-if="errors.has('phone')">
                                    {{errors.first('phone')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group" v-if="this.e_agent.agent_type  === 'business'"
                                 :class="{ 'has-feedback has-error': errors.has('registration_pin')}">
                                <label class="control-label">CPR Number</label>
                                <input type="text" v-model="e_agent.crp" name="registration_pin"
                                       v-validate="'required'" class="form-control"
                                       placeholder="CPR/123/2019 | PVT/123/2019">
                                <small class="help-block" v-if="errors.has('registration_pin')">
                                    {{errors.first('registration_pin')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('physical_address')}">
                                <label class="control-label">Physical Address</label>
                                <input type="text" v-model="e_agent.physical_address" name="physical_address"
                                       v-validate="'required'" class="form-control">
                                <small class="help-block" v-if="errors.has('physical_address')">
                                    {{errors.first('physical_address')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('postal_code')}">
                                <label>Postal Code</label>
                                <v-select :options="postal_codes" label="code" v-model="e_agent.postal_code_id"
                                          name="postal_code" :reduce="postal_code => postal_code.id"
                                          v-validate="'required'" placeholder="Postal Code"></v-select>
                                <small class="help-block" v-if="errors.has('postal_code')">
                                    {{errors.first('postal_code')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('postal_address')}">
                                <label>Postal Address</label>
                                <input type="text" v-model="e_agent.postal_address" name="postal_address"
                                       v-validate="'required|numeric'" placeholder="Postal Address eg. 635"
                                       class="form-control">
                                <small class="help-block" v-if="errors.has('postal_address')">
                                    {{errors.first('postal_address')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('account')}">
                                <label class="control-label">Account</label>
                                <input type="text" v-model="e_agent.account" name="account"
                                       v-validate="'required'" class="form-control">
                                <small class="help-block" v-if="errors.has('account')">
                                    {{errors.first('account')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('customerid')}">
                                <label class="control-label">Customer ID</label>
                                <input type="text" v-model="e_agent.customerid" name="customerid"
                                       v-validate="'required'" class="form-control">
                                <small class="help-block" v-if="errors.has('customerid')">
                                    {{errors.first('customerid')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('limit')}">
                                <label class="control-label">Limit</label>
                                <input type="text" v-model="e_agent.limit" class="form-control"
                                       name="limit" v-validate="'required'">
                                <small class="help-block" v-if="errors.has('limit')">
                                    {{errors.first('limit')}}
                                </small>
                            </div>
                            <div class="col-md-6 form-group"
                                 :class="{ 'has-feedback has-error': errors.has('price_group')}">
                                <label>Price Group</label>
                                <v-select :options="groups" label="name" v-model="e_agent.group_id"
                                          name="price_group" :reduce="g => g.id" v-validate="'required'"
                                          placeholder="Price Group"></v-select>
                                <small class="help-block" v-if="errors.has('price_group')">
                                    {{errors.first('price_group')}}
                                </small>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <button class="btn btn-primary pull-right" type="submit">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </modal>
            <modal :showModal="showCreateModal" @close="showCreateModal = false">
                <template v-slot:header>
                    <h5>Create Agent User</h5>
                </template>
                <div class="col-md-12" v-html="$error.handle(error)"></div>
                <create-user :agentid="agent.id"/>
            </modal>
        </template>
        <loading v-else/>
    </div>
</template>

<script>
    import CreateUser from "./CreateUser";

    export default {
        components: {CreateUser},
        mounted() {
            this.fetch();
            this.fetchCodes();
        },
        data() {
            return {
                is_loaded: false,
                showModal: false,
                showCreateModal: false,
                agent: null,
                users: [],
                error: '',
                e_agent: {
                    agent_type: '',
                    name: "",
                    email: "",
                    phone: null,
                    limit: null,
                    crp: "",
                    physical_address: "",
                    account: "",
                    customerid: "",
                    postal_address: "",
                    group_id: null,
                    postal_code: {
                        id: '',
                        code: '',
                        name: ''
                    },
                },
            }
        },
        methods: {
            fetch() {
                this.is_loaded = false;
                axios.get('/api/v1/agents/' + this.$route.params.id).then(response => {
                    this.agent = response.data.agent;
                    this.users = response.data.users;
                    this.is_loaded = true;
                }).catch(err => {
                    this.error = err.response;
                });
            },
            fetchCodes() {
                if (!this.groups.length && this.create_agent_user) {
                    this.$store.dispatch("fetchGroups").then(() => {
                        this.loading = false;
                    });
                }
                if (!this.postal_codes.length) {
                    this.$store.dispatch("fetchPostalCodes").then(() => {
                        this.loading = false;
                    });
                }
            },
            delinkUser(user) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "This will delete " + user.firstname + " " + user.lastname + ". You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.post("/api/v1/agent/" + user.pivot.agent_id + "/unlinkUser", {"user_id": user.pivot.user_id}).then(() => {
                            this.loading = false;
                            toastr.success('Agent deleted successfully');
                            this.fetch();
                        }).catch(err => {
                            this.loading = false;
                            if (err.response) {
                                this.error = err.response;
                            }
                        });
                    }
                });
            },
            deleteAgency() {
                this.$swal({
                    title: 'Are you sure?',
                    text: "This will delete the agency and all its users.You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.delete('/api/v1/agents/' + this.agent.id).then(() => {
                            toastr.success('Agency deleted successfully.', 'Success');
                            this.$router.replace({name: 'agents.index'});
                        });
                    }
                })
            },
            agentModal(agent) {
                this.e_agent = agent;
                this.showModal = true;
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.updateAgent();
                    }
                });
            },
            updateAgent() {
                this.loading = true;
                const agent = (({agent_type, name, email, phone, crp, physical_address, postal_address, limit, group_id, postal_code_id, customerid, account}) => ({
                    agent_type,
                    name,
                    email,
                    phone,
                    crp,
                    physical_address,
                    postal_address,
                    limit,
                    group_id,
                    postal_code_id, customerid, account
                }))(this.e_agent);

                axios.put("/api/v1/agents/" + this.agent.id, agent).then(() => {
                    this.loading = false;
                    toastr.success('Agent updated successfully');
                    this.$router.push({name: "agents.index"});
                }).catch(err => {
                    this.loading = false;
                    if (err.response) {
                        this.error = err.response;
                    }
                });
            },
        },
        computed: {
            current_user() {
                return this.$store.getters.getAuthUser;
            },
            groups() {
                return this.$store.getters.getGroups;
            },
            postal_codes() {
                return this.$store.getters.getPostalCodes;
            },
            create_agent_user() {
                return this.$can.view(this.current_user, 'update-agent') || this.$can.view(this.current_user, 'update-agents-owned')
            }
        }
    }
</script>

