<template>
    <v-app id="inspire">
        <v-card>
            <v-card-title>
                Pricing Group
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
                    <button type="button" class="btn btn-black pull-right" @click.prevent="groupModal(null)"
                            v-if="$can.view($store.getters.getAuthUser, 'create-bidbond-pricing')">Create Group
                    </button>
                </div>
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="groups"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :search="search"
                    item-key="name"
                    class="elevation-1"
            >
                <template v-slot:item.name="{ item }">
                    {{ item.name | unslug }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn class="mx-1 my-1 edit-icon" small @click.prevent="groupModal(item)"
                           v-if="$can.view($store.getters.getAuthUser, 'edit-bidbond-pricing')">
                        <v-icon dark small>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn class="mx-1 my-1 delete-icon" small @click.prevent="deleteGroup(item)"
                           v-if="$can.view($store.getters.getAuthUser, 'delete-bidbond-pricing')">
                        <v-icon dark small>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <modal :showModal="showModal" @close="showModal = false">
            <template v-slot:header>
                <h5 v-if="group">Edit Group</h5>
                <h5 v-else>Create New Group</h5>
            </template>
            <form @submit.prevent="save">
                <div class="row">
                    <div class="col-md-12" v-html="$error.handle(error)"></div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" required class="form-control" v-model="name">
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <button class="btn btn-primary pull-right" type="submit">
                                <span v-if="group">Update</span>
                                <span v-else>Create</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </modal>
    </v-app>
</template>

<script>
    import Fields from "./BidFieldDefs";
    import {mapGetters} from 'vuex';
    export default {
        mounted() {
            this.fetch();
        },
        data() {
            return {
                search: '',
                sortBy: 'id',
                sortDesc: false,
                headers: Fields,
                error: '',
                group: null,
                name: '',
                showModal: false
            }
        },
      watch:{
        groups(){
          return this.groups;
        }
      },
        methods: {
            fetch() {
                    this.$store.dispatch("fetchGroups").then(() => {
                        this.loading = false;
                    });
            },
            save() {
                if (this.group) {
                    this.edit();
                    return;
                }
                axios.post('/api/v1/groups', {'name': this.name.replace(/ /g, '_').toLowerCase()}).then((response) => {
                    this.showModal = false;
                    this.name = '';
                    this.group = null;
                    this.$store.dispatch('setGroup',response.data);
                    toastr.success('Group Created');
                }).catch(err => {
                    this.loading = false;
                    if (err.response) {
                        this.error = err.response;
                    }
                });
            },
            edit() {
                this.group.name = this.name.replace(/ /g, '_').toLowerCase();
                this.loading = true;
                axios.put('/api/v1/groups/' + this.group.id, this.group).then(() => {
                    this.loading = false;
                    this.showModal = false;
                    console.log('suucess')
                    this.$store.dispatch('setGroup',this.group);
                    this.name = '';
                    this.group = null;
                    toastr.success('Group updated');
                }).catch(err => {
                    this.loading = false;
                    if (err.response) {
                      this.$store.dispatch('fetchGroups');
                        this.error = err.response;
                    }
                });
            },
            deleteGroup(group) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "Are you sure you want to delete the group " + group.name + " ?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        axios.delete('/api/v1/groups/' + group.id).then(() => {
                            this.$store.dispatch('deleteGroup', group);
                            this.group = null;
                            toastr.success('Group deleted');
                        }).catch(error => {
                            toastr.warning(error.response.data.error);
                        });
                    }
                })
            },
            groupModal(group) {
                if (group != null) {
                    this.group = group;
                    this.name = group.name;
                } else {
                    this.group = null;
                }
                this.showModal = true;
            }
        },
        computed: {
          ...mapGetters({groups:'getGroups'})
        }
    }
</script>

