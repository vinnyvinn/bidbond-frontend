<template>
    <div>
        <form @submit.prevent="validateForm()">
            <div class="form-group">
                <label>Procuring Entity</label>
                <v-select :options="counter_parties" label="name" data-vv-name="procuring_entity"
                          name="procuring_entity" v-model="bid_bond.counter_party"
                          placeholder="Select Company Tendering From" v-validate="'required'"></v-select>
                <small class="help-block" v-if="errors.has('procuring_entity')">{{errors.first('procuring_entity')}}
                </small>
            </div>

            <div class="form-group">
                <label>Tender Purpose</label>
                <textarea rows="3" name="tender_purpose" class="form-control"
                          placeholder="eg. Tender for provision of auctioneering services"
                          v-model="bid_bond.tender_purpose" v-validate="'required'"></textarea>
                <small class="help-block" v-if="errors.has('tender_purpose')">{{errors.first('tender_purpose')}}</small>
            </div>
            <div class="form-group">
                <label>Addressee</label>
                <textarea rows="3" placeholder="eg. Procurement Officer" class="form-control"
                          v-validate="'required'" name="addressee"
                          v-model="bid_bond.addressee"></textarea>
                <small class="help-block" v-if="errors.has('addressee')">{{errors.first('addressee')}}</small>
            </div>
            <div class="form-group">
                <a href="#" class="btn btn-info pull-left btn-sm" @click.prevent="$emit('back')">Previous</a>
                <button type="submit" class="btn btn-primary pull-right btn-sm">Next</button>
            </div>
        </form>
    </div>
</template>

<script>
   import {mapGetters} from 'vuex';
    export default {
        mounted() {
            this.current.counter_party ? this.bid_bond.counter_party = this.current.counter_party : this.bid_bond.counter_party = null;
            this.current.tender_purpose ? this.bid_bond.tender_purpose = this.current.tender_purpose : this.bid_bond.tender_purpose = '';
            this.current.addressee ? this.bid_bond.addressee = this.current.addressee : this.bid_bond.addressee = '';

           if (!this.isEmpty(this.getBidbond)){
           this.current.counter_party = this.counter_parties.find(c => c.id == this.getBidbond.counter_party_id);
           }
        },
        props: {
            current: {
                type: Object,
            },
            counter_parties: {
                type: Array,
                default() {
                    return [];
                }
            },
        },
        data() {
            return {
                bid_bond: {
                    counter_party: null,
                    tender_purpose: '',
                    addressee: '',
                },
            }
        },
        methods: {
          isEmpty(obj) {
            for(var key in obj) {
              if(obj.hasOwnProperty(key))
                return false;
            }
            return true;
          },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$emit('step2', this.bid_bond);
                    }
                });
            },
        },
        computed: {
          ...mapGetters(['getBidbond']),
            end_date() {
                if (this.bid_bond.addressee && this.bid_bond.tender_purpose) {
                    return moment(this.bid_bond.addressee).add(parseInt(this.bid_bond.tender_purpose), 'days').format('YYYY-MM-DD');
                }

                return '';
            }
        },

        watch: {
            end_date(newval, oldval) {
                this.bid_bond.end_date = newval;
            },

            current(newval, oldval) {
                newval.amount ? this.bid_bond.amount = newval.amount : this.bid_bond.amount = '';
                newval.tender_purpose ? this.bid_bond.tender_purpose = newval.tender_purpose : this.bid_bond.tender_purpose = '';
                newval.addressee ? this.bid_bond.addressee = newval.addressee : this.bid_bond.addressee = '';
            }
        }
    }
</script>
