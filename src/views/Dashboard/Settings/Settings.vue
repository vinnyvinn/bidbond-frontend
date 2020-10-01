<template>
    <div id="bidbond-settings" class="tab-pane active">
        <form @submit.prevent="save">
            <div class="form-group">
                <label>System Bank Limit</label>
                <vue-numeric v-model="setting.bank_limit" class="form-control" />
            </div>
            <div class="form-group">
                <label>Company Limit</label>
                <vue-numeric v-model="setting.company_limit" class="form-control"/>
            </div>
            <div class="form-group">
                <label>MPF</label>
                <input type="number" step="0.01" min="0" max="1"  class="form-control" v-model="setting.mpf">
            </div>
            <div class="form-group">
                <label>Other</label>
                <input type="number" step="0.01" min="0" max="1"  class="form-control" v-model="setting.other">
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },

        data() {
            return {
                settings: [],
                setting: {
                    bank_limit: '',
                    indemnity_cost: '',
                    company_limit: '',
                    excise_duty: '',
                    mpf: '',
                    nic: '',
                },
            }
        },
        methods: {
            fetch() {
                axios.get('/api/v1/settings').then(response => {
                    this.setting = response.data;
                    this.loading = false;
                });
            },

            save() {
                axios.post('/api/v1/settings', this.setting).then(() => {
                    toastr.success('The settings have been updated', 'Saved');
                });
            },
        }
    }
</script>
