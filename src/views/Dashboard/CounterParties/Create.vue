<template>
	<div>
		<fieldset>
			<legend>Create Counter Party</legend>
			<div v-html="$error.handle(error)"></div>
			<form @submit.prevent="submit">
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<label>Name</label>
							<input type="text" name="name" v-model="counter_party.name" v-validate="'required'" class="form-control">
						</div>
					</div>
					<div class="col-md-12">
						<div class="form-group">
							<label>Category</label>
							<select v-model="counter_party.category" class="form-control">
								<option v-for="category in categories" :value="category.secret">{{ category.name }}</option>
							</select>
						</div>
					</div>
					<div class="col-md-12">
						<div class="form-group">
							<label>Physical Address</label>
							<input type="text" v-model="counter_party.physical_address" class="form-control">
						</div>
					</div>
					<div class="col-md-12">
						<div class="form-group">
							<label>Postal Address</label>
							<input type="text" v-model="counter_party.postal_address" class="form-control">
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Postal Code</label>
							<v-select :options="postal_codes" label="code" v-validate="'required'" v-model="postal_code" placeholder="Postal Code"></v-select>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Postal Name</label>
							<input required type="text" class="form-control" v-model="postal_code.name" readonly="">
						</div>
					</div>
					<div class="col-md-12">
						<button class="btn btn-primary">Save</button>
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
				postal_codes: [],
				counter_party: {},
				postal_code: {},
				error: '',
				categories: []
			}
		},

		methods: {
			fetch() {
				axios.get('/api/v1/counterparty').then(response => {
					this.categories = response.data.data.categories;
					this.postal_codes = response.data.data.postalcodes;
				});
			},

			submit() {
				let data = this.counter_party;
				data.postal_code = this.postal_code.id;
				axios.post('/api/v1/counterparty', data).then((response) => {
					toastr.success("Counterparty created successfully");
					this.$store.dispatch('setCounterParty',response.data.data);
					this.$router.push({ name: 'counter-parties.index' });
				});
			}
		}
	}
</script>
