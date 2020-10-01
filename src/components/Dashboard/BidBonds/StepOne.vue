<template>
    <div>
        <form @submit.prevent="validateForm()">
            <div class="form-group">
                <label>Company Name</label>
                <v-select :options="companies" label="name" name="company" v-model="bid_bond.company"
                          v-validate="'required'" placeholder="Select your Company" @input="selectedCompany()"></v-select>
                <small class="help-block" v-if="errors.has('company')">
                    {{errors.first('company')}}
                </small>
            </div>
            <div class="form-group">
                <label>Tender Number</label>
                <input type="text" class="form-control" placeholder="eg Kenha/2259/2020" name="tender_number"
                       v-model="bid_bond.tender_number" v-validate="'required'">
                <small class="help-block" v-if="errors.has('tender_number')">
                    {{errors.first('tender_number')}}
                </small>
            </div>
            <div class="form-group">
                <button class="btn btn-primary pull-right btn-sm" type="submit">Next</button>
            </div>
        </form>
    </div>
</template>

<script>

    export default {
        mounted() {
            this.bid_bond = this.current;
            this.$nextTick(() => {
                this.errors.clear();
                this.$nextTick(() => {
                    this.$validator.reset();
                });
            });
        },

        data() {
            return {
                bid_bond: {
                    company: '',
                    tender_number: '',
                }
            }
        },

        props: {
            companies: {
                type: Array,
                default() {
                    return [];
                }
            },

            current: {
                type: Object,
                default() {
                    return {}
                }
            }
        },

        methods: {
            selectedCompany(){
            this.$store.dispatch('setCompany',this.bid_bond.company);
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$store.dispatch('setTender',this.bid_bond.tender_number)
                        this.$emit('step1', this.bid_bond);
                    }
                });
            },
        },

        watch: {
            'bid_bond.company': {
                handler: function (newVal, oldVal) {
                    if (newVal !== null)
                        this.$emit('company-change', newVal);
                },
            },
            current(newval, oldval) {
                this.bid_bond = newval;
            }
        }
    }
</script>
