<template>
    <top-nav>
        <li>
            <router-link :to="{ name: 'agents.index'}">Agents</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'onboard-agencies')">
            <router-link :to="{name: 'agents.create'}">Onboard Agency</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'restore-agencies')">
            <router-link :to="{name: 'agents.deleted'}">Deleted Agents</router-link>
        </li>
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
