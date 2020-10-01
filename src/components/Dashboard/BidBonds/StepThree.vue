<template>
	<div>
		<form @submit.prevent="validateForm">
			<div class="form-group">
				<label>BidBond Amount</label>
				<vue-numeric name="bidbond_amount" v-validate="'required|max_value:' + current.company.balance" v-model="bid_bond.amount" class="form-control" />
				<small class="help-block" v-if="errors.has('bidbond_amount')">{{errors.first('bidbond_amount')}}
				</small>
   			</div>

			<div class="form-group">
				<label>Tender Period</label>
				<select class="form-control" v-model="bid_bond.period" v-validate="'required'" name="tender_period">
					<option value="30">30 Days</option>
					<option value="60">60 Days</option>
					<option value="90">90 Days</option>
					<option value="120">120 Days</option>
					<option value="180">180 Days</option>
					<option value="210">210 Days</option>
					<option value="365">365 Days</option>
				</select>
				<small class="help-block" v-if="errors.has('tender_period')">{{errors.first('tender_period')}}
				</small>
			</div>
			<div class="form-group">
				<label>Start Date</label>
				<date-picker v-model="bid_bond.start_date" v-validate="'required'" format="yyyy-MM-dd" name="bid_bond_start_date" input-class="form-control bg-white" :disabledDates="disabledDates" />
				<small class="help-block" v-if="errors.has('bid_bond_start_date')">{{errors.first('bid_bond_start_date')}}
				</small>
			</div>
			<div class="form-group">
				<label>End Date</label>
				<input type="text" class="form-control" v-model="end_date" readonly>
			</div>
			<div class="form-group">
				<a href="" class="btn btn-info pull-left btn-sm" @click.prevent="$emit('back')">Previous</a>
				<button class="btn btn-primary pull-right btn-sm" type="submit">Next</button>
			</div>
		</form>
	</div>
</template>

<script>
	import DatePicker from 'vuejs-datepicker';

	export default {
		components: {
			DatePicker
		},
		mounted() {
			this.current.amount ? this.bid_bond.amount = this.current.amount : this.bid_bond.amount = '';
			this.current.period ? this.bid_bond.period = this.current.period : this.bid_bond.period = '';
			this.current.start_date ? this.bid_bond.start_date = this.current.start_date : this.bid_bond.start_date = '';
		},
		data() {
			return {
				bid_bond: {
					amount: '',
					period: '',
					start_date: '',
					end_date: ''
				},
				disabledDates: {
					to: new Date(Date.now() - 8640000)
				},
				pre_pricing: {}
			}
		},


		props: {
			current: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		methods: {
			validateForm() {
				return this.$validator.validateAll().then(result => {
					if (result) {
						this.$emit('step3', this.bid_bond);
					}
				});
			},
		},

		computed: {
			end_date() {
				if (this.bid_bond.start_date && this.bid_bond.period) {
					let end_date = moment(this.bid_bond.start_date).add(parseInt(this.bid_bond.period), 'days').format('YYYY-MM-DD');
					this.bid_bond.start_date = moment(this.bid_bond.start_date).format('YYYY-MM-DD');
					return end_date;
				}

				return '';
			}
		},

		watch: {
			'bid_bond.amount'(){
			console.log(this.bid_bond.amount)
			},
			end_date(newval, oldval) {
				this.bid_bond.end_date = newval;
			},

			current(newval, oldval) {
				newval.amount ? this.bid_bond.amount = newval.amount : this.bid_bond.amount = '';
				newval.period ? this.bid_bond.period = newval.period : this.bid_bond.period = '';
				newval.start_date ? this.bid_bond.start_date = newval.start_date : this.bid_bond.start_date = '';
			}
		}
	}
</script>
