<template>
    <div>
      <v-app id="inspire">
        <template v-if="loading">
          <loading/>
        </template>
        <template v-else>
        <v-card>
          <v-card-title>
            Counter Parties
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <div v-if="$can.view($store.getters.getAuthUser, 'create-counterparties')">
              <router-link :to="{ name: 'counter-parties.create'}" class="btn btn-sm btn-black pull-right create-icon">Create
                New
              </router-link>
            </div>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="counter_parties"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :search="search"
              item-key="name"
              class="elevation-1"
          >

            <template v-slot:item.actions="{ item }">
              <v-btn class="mx-1 my-1 edit-icon" small @click.prevent="edit(item)" v-if="$can.view($store.getters.getAuthUser, 'edit-counterparties')">
                <v-icon dark small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn class="mx-1 my-1 delete-icon" small  @click.prevent="deleteParty(item)"
                     v-if="$can.view($store.getters.getAuthUser, 'delete-counterparties')">

                <v-icon dark small>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
        </template>
        <modal :showModal="showModal" @close="showModal = false">
          <template v-slot:header>
            <h5>Edit Counterparty</h5>
          </template>
          <form @submit.prevent="update">
            <div v-html="$error.handle(error)"></div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" required v-model="counter_party.name" class="form-control">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Physical Address</label>
                  <input type="text" required v-model="counter_party.physical_address" class="form-control">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Postal Address</label>
                  <input type="text" required v-model="counter_party.postal_address" class="form-control">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Category</label>
                  <v-select :options="categories" :reduce="x => x.secret" label="name"
                            v-model="counter_party.category_secret"
                            placeholder="Category"></v-select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Postal Code</label>
                  <v-select :options="postal_codes" :reduce="x => x.id" @input="getCounterparty" label="code"
                            v-model="counter_party.postal_code_id"
                            placeholder="Postal Code"></v-select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Postal Name</label>
                  <input required type="text" class="form-control" v-model="postal_code" readonly="">
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
    import {mapGetters} from 'vuex';

    export default {
        mounted() {
            this.fetch();
            this.getCounterparties();
        },
        data() {
            return {
                loading: true,
                showModal: false,
                search: '',
                sortBy: 'id',
                sortDesc: false,
                headers:FielDefs,
                categories: [],
                postal_codes: [],
                postal_code: '',
                counter_party: {
                    name: '',
                    postal_code_id: null,
                    category_secret: ''
                },
                error: '',
            }
        },
           watch:{
             counter_parties(){
               return this.counter_parties;
             }
           },
        methods: {
            fetch() {
                axios.get('/api/v1/counterparty').then(response => {
                    this.categories = response.data.data.categories;
                    this.postal_codes = response.data.data.postalcodes;
                    this.loading = false;
                });
            },
            getCounterparties() {
                    this.$store.dispatch("fetchCounterParties").then(() => {
                        this.loading = false;
                    });

            },
            edit(c) {
                this.postal_code = this.postal_codes.filter(x => x.id == c.postal_code_id)[0].name;
                this.counter_party = c;
                this.showModal = true;
            },
            getCounterparty() {
                if (this.counter_party.postal_code_id) {
                    this.postal_code = this.postal_codes.filter(x => x.id == this.counter_party.postal_code_id)[0].name;
                }
            },
            update() {
                let data = this.counter_party;
                data.postal_code = this.counter_party.postal_code_id;
                data.category = this.counter_party.category_secret;

                axios.put('/api/v1/counterparty/' + this.counter_party.id, data).then((response) => {
                  this.showModal = false;
                  toastr.success("Counterparty updated successfully")
                    this.$store.dispatch("setCounterParty", response.data.data);
                }).catch(error => {
                    this.error = error.response;
                });
            },
            deleteParty(party) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "Are you sure you want to delete the counterparty " + party.name + " ?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.delete('/api/v1/counterparty/' + party.id).then(() => {
                            this.$store.dispatch("deleteCounterParty", party);
                            toastr.success("Counterparty deleted successfully");
                        });
                    }
                });
            }
        },
        computed: {
          ...mapGetters({
            counter_parties:'getCounterParties'
          }),

        }
    }
</script>

<style>

</style>
