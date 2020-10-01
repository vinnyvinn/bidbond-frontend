<template>
    <div class="tab-pane">
        <table class="table table-hover mt-2">
            <thead>
            <tr>
                <th>#</th>
                <th>Option</th>
                <th>Value</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(setting, index) in settings" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ setting.option | unslug }}</td>
                <td>{{ setting.value }}</td>
                <td>
                    <button type="button" class="btn btn-sm mr-2 btn-info" @click.prevent="settingModal(setting)"><i
                            class="fa fa-edit"></i> Edit
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <modal :showModal="showModal" @close="showModal = false">
            <template v-slot:header>
                <h5>Edit Setting</h5>
            </template>
            <form @submit.prevent="validateForm">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group" :class="{ 'has-feedback has-error': errors.has('role')}">
                            <label>Setting</label>
                            <input class="form-control" v-validate="'required'" v-model="setting.option" readonly/>
                        </div>
                        <div class="form-group" :class="{ 'has-feedback has-error': errors.has('status')}">
                            <label>Value</label>
                            <input class="form-control" name="value" v-validate="'required'" v-model="setting.value"/>
                            <small class="help-block" v-if="errors.has('value')">
                                {{errors.first('value')}}
                            </small>
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
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },
        data() {
            return {
                setting: { id: null, option: null, value: null },
                settings: [],
                showModal: false,
                edit: true
            }
        },
        methods: {
            fetch() {
                axios.get('/api/v1/price-settings').then(response => {
                    this.settings = response.data;
                    this.loading = false;
                });
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        axios.put('/api/v1/price-settings/' + this.setting.id, this.setting).then(() => {
                            this.showModal = false;
                            toastr.success(this.setting.option + ' updated successfully!', 'Success');
                            this.fetch();
                        });
                    }
                });
            },
            settingModal(k) {
                this.edit = true;
                this.setting = k;
                this.showModal = true;
            },
        }
    }
</script>
