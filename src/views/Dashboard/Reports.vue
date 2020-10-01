<template>
    <top-nav>
        <li v-if="$can.view($store.getters.getAuthUser, 'payments-reports')">
            <router-link :to="{ name: 'reports.payments'}">Payments Reports</router-link>
        </li>
        <!--                      <li v-if="$can.view($store.getters.getAuthUser, 'users-reports')">-->
        <!--                        <router-link :to="{ name: 'reports.users'}">Users Reports</router-link>-->
        <!--                      </li>-->
        <!--                       <li v-if="$can.view($store.getters.getAuthUser, 'bidbonds-reports')">-->
        <!--                        <router-link :to="{ name: 'reports.bidbonds'}">Bidbonds Reports</router-link>-->
        <!--                      </li>-->
        <li v-if="$can.view($store.getters.getAuthUser, 'companies-reports')">
            <router-link :to="{ name: 'reports.companies'}">Companies Reports</router-link>
        </li>
    </top-nav>
</template>
<script>
    import TopNav from "@/components/TopNav.vue";

    export default {
        components: {
            TopNav
        }
    }
</script>
