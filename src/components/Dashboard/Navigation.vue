<template>
    <div class="navigation">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-7 col-xs-6">
                    <bread-crumbs @toggle="$emit('toggle')"/>
                </div>
                <div class="col-md-5 col-xs-6">
                    <div class="links">
                        <ul>
                            <li>
                                <router-link :to="{ name: 'help' }" class="help">
                                    Help
                                    <i class="fa fa-question-circle-o"></i>
                                </router-link>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-capitalize" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-user"></i>
                                    {{ first_name }}
                                    <small>({{ role }})</small>
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" @click.prevent="$router.push({ name: 'profile.info'})">My Account</a>
                                    <a class="dropdown-item" @click.prevent="logout">Log out</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BreadCrumbs from "@/components/Dashboard/BreadCrumbs";

    export default {
        components: {
            BreadCrumbs
        },
        mounted() {
            this.initiate();
        },
        methods: {
            logout() {
                axios.post('/api/v1/logout').finally(() => {
                    this.$auth.logout();
                    window.location.href = this.$router.resolve({name: 'login'}).href;
                });
            },
            initiate() {
                if (this.first_name) return;
                this.$store.dispatch('initialize');
            }
        },
        computed: {
            first_name() {
                return this.$store.getters.getAuthUser.firstname;
            },

            role() {
                return this.$store.getters.getAuthUser.role;
            }
        }
    }
</script>

<style lang="scss">
    @import "../../styles/variables";

    .navigation {
        .links {
            float: right;

            @media (max-width: 480px) {
                float: left;
            }

            ul {
                list-style: none;
                padding: 0;

                li {
                    display: inline-block;

                    a {
                        display: block;

                        &.help {
                            width: auto;
                            display: inline-block;

                            @media (max-width: 480px) {
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
