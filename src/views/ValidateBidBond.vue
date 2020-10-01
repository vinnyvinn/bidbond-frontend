<template>
	<div class="container">
		<div id="bid-bond-template" v-html="content"></div>
	</div>
</template>

<script>
	export default {
		mounted() {
			axios.get('/api/v1/bid-bonds/' + this.$route.params.bidbond + '/' + this.$route.params.company).then(response => {
				this.content = response.data;
			})
		},

		data() {
			return {
				content: ''
			}
		}
	}
</script>