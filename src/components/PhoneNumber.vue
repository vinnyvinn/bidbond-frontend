<template>
	<div>
		<input type="text" class="form-control" @input="handle" v-model="val" @focusout="format" placeholder="254..." autocomplete="false">
		<span class="error-text" v-if="invalid">The phone number is invalid.</span>
	</div>
</template>

<script>
	export default {
		mounted() {
			this.val = 254;
		},

		data() {
			return {
				val: this.value,
				invalid: false
			}
		},

		props: ['value'],

		methods: {
			handle() {
				this.$emit('input', this.val);
			},

			format() {
				if(!this.val){
					this.invalid = false;
					return;
				}

				if (this.val.startsWith('0')) {
					this.val = this.val.slice(1);
				}

				if (! this.val.startsWith('254')) {
					this.val = '254' + this.val;
				}

				this.invalid = this.val.length !== 12;

				this.handle();
			}
		}
	}
</script>
