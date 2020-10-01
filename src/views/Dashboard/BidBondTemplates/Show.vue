<template>
    <div>
        <div class="tasks">
            <router-link :to="{ name: 'bid-bond-templates.edit', params: { id: $route.params.id }}"
                         class="btn btn-primary"
                         v-if="$can.view($store.getters.getAuthUser, 'update-bidbond-templates')">Edit
            </router-link>
            <a href="#" @click.prevent="deleteTemplate" class="btn btn-danger"
               v-if="$can.view($store.getters.getAuthUser, 'delete-bidbond-templates')">Delete</a>
        </div>
        <hr>
        <div id="bid-bond-template" v-html="template"></div>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },

        data() {
            return {
                template: {}
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/bid-bond-templates/' + this.$route.params.id).then(response => {
                    this.template = response.data;
                });
            },

            deleteTemplate() {
                axios.post('/api/v1/bid-bond-templates/' + this.$route.params.id).then(() => {
                    this.$router.push({name: 'bid-bond-templates.index'});
                })
            }
        }
    }
</script>

<style lang="scss">
    .tasks {
        text-align: right;

        a {
            margin: 0 10px;
        }
    }
</style>