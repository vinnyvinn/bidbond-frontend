<template>
	<div>
		<form @submit.prevent="$emit('step4')">
			<h4>Summary</h4>
			<hr>
			<div class="row" v-if="is_valid">
				<div class="col-md-6">
					<div class="bond-content">
						<p>Company: <span>{{ bid_bond.company.name }}</span></p>
						<p>Procuring Entity: <span>{{ bid_bond.counter_party.name }}</span></p>
						<p>Tender Number: <span>{{ getTender }}</span></p>
					</div>
				</div>
				<div class="col-md-6">
					<div class="bond-content">
						<p>Tender Purpose</p>
						<p><span>{{ bid_bond.tender_purpose }}</span></p>
						<hr>
						<p>Addressee</p>
						<p><span>{{ bid_bond.addressee }}</span></p>
					</div>
				</div>
			</div>
			<hr>
			<div class="row" v-if="is_valid">
				<div class="col-md-6">
					<div class="bond-content">
						<p>BidBond Amount: <span>{{ $number.format(bid_bond.amount) }}</span></p>
						<p>Tender Period: <span>{{ bid_bond.period }}</span></p>
						<p>Start Date: <span>{{ start_date }}</span></p>
						<p>End Date: <span>{{ bid_bond.end_date }}</span></p>
					</div>
				</div>
				<div class="col-md-6">
					<div class="bond-content">
						<p>BidBond Charge: <span>{{ $number.format(pricing.bid_bond_charge) }}</span></p>
						<p>Excise Duty: <span>{{ $number.format(pricing.excise_duty) }}</span></p>
						<p>Indemnity Cost: <span>{{ $number.format(pricing.indemnity_cost) }}</span></p>
						<p>Total: <span>{{ $number.format(pricing.total) }}</span></p>
					</div>
				</div>
			</div>
			<br v-if="is_valid">
			<div v-if="! is_valid" class="alert alert-danger">
				<p>The bidbond amount is invalid. Please try a different amount.</p>
			</div>
			<div class="form-group">
				<a href="" class="btn btn-info pull-left btn-sm" @click.prevent="$emit('back')">Previous</a>
				<button class="btn btn-primary pull-right btn-sm" v-if="is_valid">Confirm</button>
			</div>
		</form>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';
	export default {
		props: {
			bid_bond: {
				type: Object,
				default() {
					return {
						company: {},
						counter_party: {}
					}
				}
			},
			pricing: {
				type: Object,
				default() {
					return {}
				}
			}
		},

		computed: {
			...mapGetters(['getTender']),
			start_date() {
				return moment(this.bid_bond.start_date).format('YYYY-MM-DD')
			},

			is_valid() {
				return this.pricing != 0;
			}
		}
	}
</script>
<style lang="scss">
	.bond-content {
		p {
			font-weight: bold;

			span {
				font-weight: normal;
				font-size: 14px;
			}
		}
	}
</style>
