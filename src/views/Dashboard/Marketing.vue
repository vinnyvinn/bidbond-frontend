<template>
	<div>
		<h4>Marketing</h4>
		<hr>
		<div class="row">
			<div class="col-md-3">
				<a href="#" @click.prevent="show_new_group = true" class="btn btn-info btn-sm pull-right">New Group</a>
				<h5>Active Groups</h5>
				<table class="table">
					<tr v-for="group in groups">
						<td><a href="#" @click.prevent="selected_group = group">{{ group.name }}</a></td>
					</tr>
				</table>
			</div>
			<div class="col-md-3" v-if="selected_group.name">
				<h5>{{ selected_group.name }} members</h5>
				<table class="table">
					<tr v-for="member in selected_group.members">
						<td>{{ member.name }}<a href="#" class="pull-right" @click.prevent="removeMember(member)">x</a></td>
					</tr>
				</table>
				<a href="#" @click.prevent="add_members = true" class="btn btn-info btn-sm pull-right">Add Members</a>
			</div>
			<div class="col-md-6" v-if="add_members == false">
				<form @submit.prevent="sendMessage">
					<div class="form-group">
						<label>Type</label>
						<select class="form-control" v-model="message.type">
							<option value="sms">SMS</option>
							<option value="email">Email</option>
						</select>
					</div>
					<div class="form-group">
						<label>Message</label>
						<textarea v-model="message.message" class="form-control" rows="4"></textarea>
					</div>
					<div class="form-group">
						<button class="btn btn-primary">Send Message</button>
					</div>
				</form>
			</div>
			<div class="col-md-6" v-if="add_members == true">
				<h5>Companies</h5>
				<a href="#" class="pull-right" @click.prevent="add_members = false">cancel</a></td>
				<form @submit.prevent="">
					<div class="form-group">
						<label>Search Companies</label>
						<input type="text" class="form-control" v-model="search_term">
					</div>
					<br>
					<ul>
						<li v-for="company in companies"><a href="#" @click.prevent="addMember(company)">{{ company.name }}</a></li>
					</ul>
				</form>
			</div>
			<div class="col-md-4" v-if="show_new_group">
				<div class="card">
					<h5>Create new group</h5>
					<form @submit.prevent="saveNewGroup">
						<div class="form-group">
							<label>Name</label>
							<input type="text" class="form-control" v-model="new_group.name">
						</div>
						<div class="form-group">
							<button class="btn btn-primary">Save</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import tinymce from 'vue-tinymce-editor'

	export default {
		components: {
			tinymce
		},

		mounted() {
			this.fetch();
			this.fetchCompanies();
		},

		data() {
			return {
				groups: [],
				selected_group: {},
				editor_options: {
                    height: '400px',
                    file_picker_types: 'image',
                },
                message: '',
                show_new_group: false,
                new_group: { name: ''},
                add_members: false,
                companies: [],
                search_term: '',
                message: { type: '', message: ''}
			}
		},

		methods: {
			fetch() {
				axios.get('/api/v1/list-groups').then(response => {
					this.groups = response.data;
				});
			},

			saveNewGroup() {
				axios.post('/api/v1/create-group', this.new_group).then(response => {
					toastr.success('The group has been created');
					this.selected_group = response.data;
					this.add_members = true;
					this.show_new_group = false;
					this.groups.push(response.data);
				});
			},

			fetchCompanies() {
				axios.get('/api/v1/companies').then(response => {
					this.companies = response.data;
				});
			},

			addMember(company) {
				let data = {
					group_id: this.selected_group.id,
					company_id: company.id
				};

				axios.post('/api/v1/attach-group', data).then(response => {
					this.selected_group.members ? '' : this.selected_group.members = [];
					this.selected_group.members.push(company);
					toastr.success(company.name + ' has been added to ' + this.selected_group.name);
				});
			},

			removeMember(company) {
				let data = {
					group_id: this.selected_group.id,
					company_id: company.id
				};

				axios.post('/api/v1/detach-group', data).then(response => {
					toastr.success(company.name + ' has been removed from ' + this.selected_group.name);
					this.selected_group.members = this.selected_group.members.filter(member => {
						return member.id != company.id;
					})
				});
			},

			sendMessage() {
				this.message.group_id = this.selected_group.id;
				axios.post('/api/v1/send-message', this.message).then(response => {
					toastr.success('The message has been sent');
				})
			}
		}
	}
</script>