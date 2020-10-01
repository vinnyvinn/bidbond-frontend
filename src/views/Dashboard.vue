<template>
    <div class="dashboard">
        <div class="side" id="my-sidebar">
            <side-bar @toggle="toggle" />
        </div>
        <div class="wrapper">
            <navigation @toggle="toggle" />
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <div class="main-content" id="main-content">
                            <router-view />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "@/style";
    import SideBar from "@/components/Dashboard/SideBar";
    import Navigation from "@/components/Dashboard/Navigation";

    export default {
        components: {
            SideBar, Navigation
        },

        methods: {
            toggle() {
                $('#my-sidebar').toggleClass('show');
            }
        },

        computed: {
            current_path() {
                return this.$route.fullPath;
            }
        },

        watch: {
            current_path() {
                $('#my-sidebar').removeClass('show');
            }
        }
    }
</script>

<style lang="scss">
    .dashboard {
        .side {
            width: 250px;
            position: fixed;
            height: 100%;
            overflow-y: auto;
            z-index: 9999999;
            background: #fff;

            &.show {
                display: block;
                border-right: solid 1px #aaa;
            }

            @media (max-width: 480px) {
                display: none;
            }
        }

        .wrapper {
            width: 100%;
            padding-left: 250px;
            position: absolute;

            @media (max-width: 480px) {
                padding-left: 0;
            }
        }

        .main-content {
            padding: 8px;
        }
    }
</style>
