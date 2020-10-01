<template>
    <div class="container">
        <div class="form-group">
            <label>Select Template</label>
            <v-select :options="templates" label="name" v-model="selected_template" placeholder="Select Template"
                      required></v-select>
        </div>
        <div class="form-group">
            <input type="checkbox" v-model="terms" id="terms">
            <label for="terms" style="margin-left: 10px;">I have read the <a href="#" @click.prevent="show_terms=true">terms
                and conditions.</a></label>
        </div>
        <hr>
        <div class="form-group">
            <div class="preview" id="bid-bond-template"
                 style="background: #fff url(/img/sample.png) no-repeat; background-size: contain; background-position-x: center;">
                <div v-html="preview"></div>
            </div>
        </div>
        <hr>
        <div class="form-group" style="text-align: right; padding: 0 20px;">
            <button class="btn btn-primary btn-sm" @click.prevent="selectTemplate">Proceed</button>
            <a href="#" class="btn btn-info pull-left btn-sm" @click.prevent="$emit('back')">Previous</a>
        </div>
        <modal :showModal="show_terms" @close="show_terms=false">
            <template v-slot:header>
                <h5>Terms and Conditions</h5>
            </template>
            <div>
                <terms/>
            </div>
            <hr>
            <div class="form-group">
                <a href="#" class="btn btn-primary" @click.prevent="show_terms = false; terms = true;">Accept Terms and
                    Conditions</a>
                <a href="#" class="btn btn-danger pull-right" @click.prevent="show_terms = false">Cancel</a>
            </div>
        </modal>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Terms from "@/components/Guest/Terms.vue";
    export default {
        components: {
            Terms
        },
        mounted() {
         this.fetch();
        },
        props: {
            current: {
                type: Object,
            },
        },
        data() {
            return {
                templates: [],
                selected_template: {},
                preview: '',
                terms: false,
                show_terms: false
            }
        },
        computed:{
        ...mapGetters(['getTender','getBidbond'])
        },
        methods: {
            fetch() {
                const self = this;
                axios.get('/api/v1/bid-bond-templates').then(response => {
                    this.templates = response.data.data;
                    if (this.current.template) {
                        const selected_t = this.templates.filter(res => {
                            return res.secret === self.current.template;
                        });
                        if (selected_t) {
                         this.selected_template = selected_t[0];
                        }
                        if (this.getBidbond){
                          this.terms = true;
                           var temp = this.templates.filter(res => {
                            return res.secret === this.getBidbond.bid_template.secret;
                          });
                          this.selected_template = temp[0];
                        }

                    }
                    else {
                        this.selected_template = this.templates[0];
                    }
                });
            },
            selectTemplate() {
                if (this.terms) {
                    return this.$emit('selected', this.selected_template.secret);
                } else {
                    window.scrollTo(0, 0);
                    toastr.error('Please accept the terms and conditions');
                }
            }
        },
        watch: {
          getBidbond(){
            return this.getBidbond;
          },
            selected_template(n) {
                if (!n) return;
                axios.post('/api/v1/bid-bonds/preview', {
                    "company_id": this.current.company.company_unique_id,
                    "counter_party_id": this.current.counter_party.id,
                    "addressee":this.current.addressee,
                    "company": this.current.company.name,
                    "purpose": this.current.tender_purpose,
                    "tender_no": this.getTender,
                    'currency': 'KES',
                    "effective_date": this.current.start_date,
                    "expiry_date": this.current.end_date,
                    "template_secret": this.selected_template.secret,
                    "amount": this.current.amount,
                    "period": this.current.period
                }).then(response => {
                    this.preview = response.data;
                });
            }
        }
    }
</script>

<style lang="scss">
    .preview {
        background: #fff;
        padding: 20px;
    }
</style>
