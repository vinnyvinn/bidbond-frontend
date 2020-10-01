<template>
    <div>
        <template v-if="loading">
            <loading/>
        </template>
        <template v-else>
            <div v-html="$error.handle(error)"></div>
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
                error: '',
                loading: true
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/companysearch/' + this.$route.params.id).then(response => {
                    toastr.success('The company search was successfull. You may now add directors', 'Success');
                    this.$router.push({name: 'companies.directors.create', params: {id: this.$route.params.id}});
                }).catch(error => {
                    this.loading = false;
                    this.error = error.response;
                });
            }
        }
    }
</script>
