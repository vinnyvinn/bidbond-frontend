<template>
	<div>
		<loading v-if="loading"/>
		<template v-else>
			<template v-if="$can.view($store.getters.getAuthUser, 'approve-companies')">
				<fieldset>
					<legend>Add Director to {{ company.name }} Manually</legend>
					<div v-html="$error.handle(error)"></div>
					<form @submit.prevent="submitManual">
						<div class="row">
							<div class="col-md-4">
								<div class="form-group">
									<label>First Name</label>
									<input type="text" v-model="director.firstname" class="form-control">
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group">
									<label>Middle Name</label>
									<input type="text" v-model="director.middlename" class="form-control">
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group">
									<label>Last Name</label>
									<input type="text" v-model="director.lastname" class="form-control">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<label>Email</label>
									<input type="text" class="form-control" v-model="director.email">
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<label>Phone Number</label>
									<phone-number v-model="director.phone_number" />
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<label>ID Number</label>
									<input type="text" class="form-control" v-model="director.id_number">
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<label>Citizenship</label>
									<select v-model="director.citizenship" class="form-control">
										<option value="kenyan">Kenyan</option>
										<option value="foreigner">Foreigner</option>
									</select>
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<button class="btn btn-primary">Save</button>
								</div>
							</div>
						</div>
					</form>
				</fieldset>
			</template>
			<template v-else>
				<fieldset v-if="$can.view($store.getters.getAuthUser, 'add-directors')">
					<legend>Add Director to {{ company.name }}</legend>
					<div v-html="$error.handle(error)"></div>
					<form @submit.prevent="submit" data-vv-scope="form2">
						<div class="row">
							<div class="col-md-4">
								<div class="form-group" :class="{ 'has-feedback has-error': errors.has('form2.first_name')}">
									<label>First Name</label>
									<input type="text" name="first_name" v-validate="'required'" v-model="director.firstname" class="form-control">
								</div>
								<small class="help-block" v-if="errors.has('form2.first_name')">
									{{errors.first('form2.first_name')}}
								</small>
							</div>
							<div class="col-md-4">
								<div class="form-group">
									<label>Middle Name</label>
									<input type="text" v-model="director.middlename" class="form-control">
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" :class="{ 'has-feedback has-error': errors.has('form2.last_name')}">
									<label>Last Name</label>
									<input type="text" name="last_name" v-validate="'required'" v-model="director.lastname" class="form-control">
								</div>
								<small class="help-block" v-if="errors.has('form2.last_name')">
									{{errors.first('form2.last_name')}}
								</small>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group" :class="{ 'has-feedback has-error': errors.has('form2.phone_number')}">
									<label>Phone Number</label>
									<phone-number v-model="director.phone_number" name="phone_number" v-validate="'required|numeric|digits:12'" />
									<small class="help-block" v-if="errors.has('form2.phone_number')">
										{{errors.first('form2.phone_number')}}
									</small>
								</div>
								<div class="form-group" :class="{ 'has-feedback has-error': errors.has('form2.email')}">
									<label>Email</label>
									<input type="text" class="form-control" name="email" v-validate="'required|email'" v-model="director.email" />
									<small class="help-block" v-if="errors.has('form2.email')">
										{{errors.first('form2.email')}}
									</small>
								</div>
								<div class="form-group" :class="{ 'has-feedback has-error': errors.has('form2.id_number')}">
									<label>ID Number</label>
									<input type="text" class="form-control" name="id_number" v-validate="'required'" v-model="director.id_number">
								</div>
								<small class="help-block" v-if="errors.has('form2.id_number')">
									{{errors.first('form2.id_number')}}
								</small>
								<div class="form-group" :class="{ 'has-feedback has-error': errors.has('form2.citizenship')}">
									<label>Citizenship</label>
									<select v-model="director.citizenship" name="citizenship" v-validate="'required'" class="form-control">
										<option value="kenyan">Kenyan</option>
										<option value="foreigner">Foreigner</option>
									</select>
									<small class="help-block" v-if="errors.has('form2.citizenship')">
										{{errors.first('form2.citizenship')}}
									</small>
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<button class="btn btn-primary" type="submit">Save</button>
								</div>
							</div>
						</div>
					</form>
				</fieldset>
				<div class="alert alert-warning" v-else>You are not allowed to add directors to this company.</div>
			</template>
		</template>
	</div>
</template>

<script>
	export default {
		mounted() {
			this.fetch();
		},

		data() {
			return {
				loading: true,
				company: {},
				director: {
					company_id: '',
					firstname: '',
					middlename: '',
					lastname: '',
					email: '',
					phone_number: 254,
					id_number: '',
					citizenship: ''
				},
				error: ''
			}
		},

		methods: {
			fetch() {
				axios.get('/api/v1/companies/' + this.$route.params.id).then(response => {
					this.company = response.data.data;
					this.director.company_id = this.company.id;
					this.loading = false;
				});
			},
			submit() {
				return this.$validator.validateAll('form2').then(result => {
					if (result) {
						axios.post('/api/v1/create/director', this.director).then(() => {
							toastr.success('Director has been added', 'Saved');
							this.$router.push({ name: 'companies.show', params: { id: this.$route.params.id }});
						}).catch(error => {
							this.error = error.response;
						});
					}
				});
			},

			submitManual() {
				axios.post('/api/v1/manual-create/director', this.director).then(() => {
					toastr.success('Director has been added', 'Saved');
					this.$router.push({ name: 'companies.show', params: { id: this.$route.params.id }});
				}).catch(error => {
					this.error = error.response;
				});
			}
		}
	}
</script>
