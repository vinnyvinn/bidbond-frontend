<template>
	<div>
		<fieldset>
			<legend>Add Pricing Tariff</legend>
			<div v-html="$error.handle(error)"></div>
			<form @submit.prevent="validateForm">
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<label>Pricing Group</label>
							<v-select :options="groups" name="group" label="name" v-model="price.group_id"
									  :reduce="c => c.id" :class="{'is-invalid': errors.has('group') }"
									  placeholder="Select Pricing Group" v-validate="'required'"></v-select>
							<small class="help-block" v-if="errors.has('group')">
								{{errors.first('group')}}
							</small>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Lower Bound</label>
							<vue-numeric v-model="price.lower_bound" class="form-control" v-validate="'required'"/>
							<small class="help-block" v-if="errors.has('lower_bound')">
								{{errors.first('lower_bound')}}
							</small>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Upper Bound</label>
							<vue-numeric v-model="price.upper_bound" class="form-control" name="upper_bound"
										 v-validate="'required'"/>
							<small class="help-block" v-if="errors.has('lower_bound')">
								{{errors.first('upper_bound')}}
							</small>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Charge Type</label>
							<select v-model="price.charge_type" class="form-control" name="charge_type"
									v-validate="'required'">
								<option value="fixed">Fixed</option>
								<option value="percent">Percentage</option>
							</select>
							<small class="help-block" v-if="errors.has('charge_type')">
								{{errors.first('charge_type')}}
							</small>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Cost</label>
							<vue-numeric v-model="price.cost" :precision="3" name="cost" class="form-control" v-validate="'required'"/>
							<small class="help-block" v-if="errors.has('cost')">
								{{errors.first('cost')}}
							</small>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Discount</label>
							<vue-numeric v-model="price.discount" name="discount" :precision="3" class="form-control"
										 v-validate="'required'"/>
							<small class="help-block" v-if="errors.has('discount')">
								{{errors.first('discount')}}
							</small>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Discount Type</label>
							<select v-model="price.discount_type" class="form-control" name="discount_type"
									v-validate="'required'">
								<option value="fixed">Fixed</option>
								<option value="percent">Percentage</option>
							</select>
							<small class="help-block" v-if="errors.has('discount_type')">
								{{errors.first('discount_type')}}
							</small>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Duration</label>
							<select v-model="price.duration" class="form-control" name="duration"
									v-validate="'required'">
								<option value="1">Monthly</option>
								<option value="3">Quarterly</option>
								<option value="12">Yearly</option>
							</select>
							<small class="help-block" v-if="errors.has('duration')">
								{{errors.first('duration')}}
							</small>
						</div>
					</div>
					<div class="col-md-12">
						<button type="submit" class="btn btn-primary">Save</button>
					</div>
				</div>
			</form>
		</fieldset>
	</div>
</template>

<script>
	export default {
		mounted() {
			this.fetch();
		},

		data() {
			return {
				price: {},
				error: ''
			}
		},
		methods: {
			fetch() {
				if (!this.groups.length) {
					this.$store.dispatch("fetchGroups");
				}
			},

			validateForm() {
				return this.$validator.validateAll().then(result => {
					if (result) {
						axios.post('/api/v1/bidbond-pricing', this.price).then(() => {
							this.$router.push({name: 'bid-bond-pricing.index'})
						}).catch(error => {
							this.error = error.response;
						});
					}

				});
			},
			submit() {
				axios.post('/api/v1/bidbond-pricing', this.price).then(() => {
					this.$router.push({ name: 'bid-bond-pricing.index' })
				}).catch(error => {
					this.error = error.response;
				});
			},
		},
		computed: {
			groups() {
				return this.$store.getters.getGroups;
			},
		},
	}
</script>
