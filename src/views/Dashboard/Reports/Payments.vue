	<template>
	<div class="show-company">
			<h6 align="center">Financial Reports</h6>
			<hr>
		<div class="row">
			<div class="col-md-3">
				<div class="nav-tabs">
					<ul>
						<li>
							<a href="#" @click.prevent="show = 1" :class="show == 1 ? 'active' : ''">Payments</a>
						</li>
						<li>
							<a href="#" @click.prevent="show = 2" :class="show == 2 ? 'active' : ''">Earnings</a>
						</li>
						<li>
							<a href="#" @click.prevent="show = 3" :class="show == 3 ? 'active' : ''">T24 Daily Report</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="col-md-9">
				<div class="the-content">
					<template v-if="show == 1">
						<table class="table table-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Principal Amount</th>
									<th>Value Date</th>
									<th>Deal Date</th>
								</tr>
							</thead>
							<tbody>

							</tbody>
						</table>
					</template>
					<template v-if="show == 2">
						<table class="table table-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>Document Name</th>
									<th>Download</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</template>
					<template v-if="show == 3">
						<h4>T24 Daily Report</h4>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		mounted() {
			this.fetch();
		},

		data() {
			return {
				loading: false,
				company: {},
				payments: {},
				show: 1
			}
		},

		methods: {

			setDocuments() {
				this.company.docs = this.company.docs.map(doc => {
					doc.fullPath = process.env.VUE_APP_API_URL + '/' + doc.path;

					return doc;
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../../styles/variables";

	.show-company {
		.nav-tabs {
			border-bottom: none;
			max-width: 150px;
			margin-left: auto;
			margin-right: auto;

			ul {
				list-style: none;
				padding: 0;
				border-right: 1px solid #ddd;
				border-left: 1px solid #ddd;
				border-top: 1px solid #ddd;
				text-align: center;

				li {
					a {
						display: block;
						padding: 10px;
						border-bottom: 1px solid #ddd;
						font-size: 16px;

						&.active {
							background: $black;
							color: $white;
						}
					}
				}
			}
		}

		.card {
			margin-bottom: 20px;

			p {
				font-weight: bold;

				span {
					font-weight: normal;
					font-size: 14px;
					margin-left: 10px;
				}
			}
		}

		.the-content {

		}
	}
</style>
