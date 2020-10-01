<template>
    <div class="bread-crumbs">
        <div class="main">
            <router-link :to="{ name: 'dashboard' }"><i class="fa fa-home"></i> Home</router-link>
        </div>
        <div class="crumb" v-for="crumb in crumbs">
            <i class="fa fa-caret-right"></i>
            {{ crumb }}
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            toggleSideBar() {

            }
        },

        computed: {
            crumbs() {
                return this.$route.fullPath.split('/').filter(crumb => {
                    return crumb.length > 1;
                });
            }
        }
    }
</script>

<style lang="scss">
    @import "../../styles/variables";

    .bread-crumbs {
        padding: 10px;

        .main {
            padding: 2px 5px;
            border: solid 1px #ddd;
            width: 80px;
            border-radius: 5px;
            display: inline-block;
            text-align: center;

            i {
                color: $primary;
                margin-right: 5px;
            }
        }

        .crumb {
            display: inline-block;
            text-transform: capitalize;
            color: $gray;

            @media (max-width: 480px) {

            }

            i {
                margin: 0 10px;
            }

            &:last-child {
                color: $primary;
            }
        }
    }
</style>
