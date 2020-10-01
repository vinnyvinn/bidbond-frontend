<template>
    <div>
        <v-app id="inspire">
            <v-card>
                <v-card-title>
                    Pricing Tariffs
                    <v-spacer></v-spacer>
                    <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <div>
                        <router-link :to="{ name: 'bid-bond-pricing.create'}"
                                     class="btn btn-sm btn-black pull-right create-icon"
                                     v-if="$can.view($store.getters.getAuthUser, 'create-bidbond-pricing')">Create New
                        </router-link>
                    </div>
                </v-card-title>
                <v-data-table
                        :headers="headers"
                        :items="pricing"
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                        :search="search"
                        item-key="name"
                        class="elevation-1"
                >
                    <template v-slot:item.group_id="{ item }">
                        {{ item.group.name | unslug }}
                    </template>
                    <template v-slot:item.lower_bound="{ item }">
                        {{$number.format(item.lower_bound)}}
                    </template>
                    <template v-slot:item.upper_bound="{ item }">
                        {{$number.format(item.upper_bound)}}
                    </template>
                    <template v-slot:item.cost="{ item }">
                        {{$number.format(item.cost)}}
                    </template>
                    <template v-slot:item.duration="{ item }">
                        {{duration(item.duration)}}
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn class="mx-1 my-1 edit-icon" small @click.prevent="edit(item)"
                               v-if="$can.view($store.getters.getAuthUser, 'edit-bidbond-pricing')">
                            <v-icon dark small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn class="mx-1 my-1 delete-icon" small @click.prevent="DeleteData(item.id)"
                               v-if="$can.view($store.getters.getAuthUser, 'delete-bidbond-pricing')">

                            <v-icon dark small>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>
            <modal :showModal="showModal" @close="showModal = false">
                <template v-slot:header>
                    <h5>Edit pricing for {{ edit_price.group.name }}</h5>
                </template>
                <div v-if="error" v-html="$error.handle(error)"></div>
                <form @submit.prevent="update">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Lower Bound</label>
                                <vue-numeric class="form-control" v-model="edit_price.lower_bound"/>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Upper Bound</label>
                                <vue-numeric class="form-control" v-model="edit_price.upper_bound"/>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Charge Type</label>
                                <select class="form-control" v-model="edit_price.charge_type">
                                    <option value="fixed">Fixed</option>
                                    <option value="percent">Percent</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Charge</label>
                                <vue-numeric :precision="2" class="form-control" v-model="edit_price.cost"/>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Discount</label>
                                <vue-numeric v-model="edit_price.discount" :precision="3" class="form-control"/>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Discount Type</label>
                                <select class="form-control" v-model="edit_price.discount_type">
                                    <option value="fixed">Fixed</option>
                                    <option value="percent">Percent</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Duration</label>
                                <select v-model="edit_price.duration" class="form-control">
                                    <option value="1">Monthly</option>
                                    <option value="3">Quarterly</option>
                                    <option value="12">Yearly</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <button class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </form>
            </modal>
        </v-app>
    </div>
</template>

<script>
    import FielDefs from "./FieldDefs";

    export default {
        mounted() {
            this.fetch();
        },
        data() {
            return {
                error: null,
                search: '',
                sortBy: 'id',
                sortDesc: false,
                headers: FielDefs,
                pricing: [],
                groups: {},
                edit_price: {},
                showModal: false
            }
        },
        methods: {
            fetch() {
                axios.get('/api/v1/bidbond-pricing').then(response => {
                    this.pricing = response.data;
                });
            },
            edit(price) {
                this.edit_price = price;
                this.showModal = true;
            },
            DeleteData(id) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "Are you sure you want to delete the pricing group?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.delete('/api/v1/bidbond-pricing/' + id).then(() => {
                            this.fetch();
                        })
                    }
                });
            },
            update() {
                this.error = null;
                axios.put('/api/v1/bidbond-pricing/' + this.edit_price.id, this.edit_price).then(() => {
                    this.showModal = false;
                    this.fetch();
                }).catch(error => {
                    this.error = error.response;
                });
            },
            duration(days) {
                let d;
                switch (days) {
                    case 1:
                        d = "Monthly";
                        break;
                    case 3:
                        d = "Quarterly";
                        break;
                    case 12:
                        d = "Yearly";
                        break;
                    default:
                        d = "N/A";
                }
                return d;
            },
        }
    }
</script>

