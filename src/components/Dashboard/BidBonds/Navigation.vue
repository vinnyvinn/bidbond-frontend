<template>
    <top-nav>
        <li v-if="$can.view($store.getters.getAuthUser, 'create-bidbonds')">
            <router-link :to="{name: 'bidbonds.create'}">Generate a Bid Bond</router-link>
        </li>
        <li>
            <router-link :to="{ name: 'bidbonds.index'}">BidBonds</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'list-bidbond-templates')">
            <router-link :to="{name: 'bid-bond-templates.index'}">BidBond Templates</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'list-counterparties')">
            <router-link :to="{name: 'counter-parties.index'}">Counter Parties</router-link>
        </li>
        <template v-if="$can.view($store.getters.getAuthUser, 'list-bidbond-pricing')">
            <li>
                <router-link :to="{name: 'bid-bond-pricing.index'}">Pricing</router-link>
            </li>
            <li>
                <router-link :to="{name: 'pricing-group'}">Pricing Group</router-link>
            </li>
        </template>
    </top-nav>
</template>
<script>
    import TopNav from "@/components/TopNav.vue";

    export default {
        components: {
            TopNav
        },
    }
</script>
