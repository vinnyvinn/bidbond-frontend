<template>
    <top-nav>
        <li>
            <router-link :to="{ name: 'companies.index'}">Companies</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'create-companies')">
            <router-link :to="{name: 'companies.create'}">Create Company</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'list-agent-companies')">
            <router-link :to="{name: 'companies.agents'}">Agent Companies</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'restore-companies')">
            <router-link :to="{name: 'companies.deleted'}">Deleted Companies</router-link>
        </li>
    </top-nav>
</template>
<script>
    import TopNav from "@/components/TopNav.vue";

    export default
    {
        components: {
            TopNav
        }
    }
</script>
