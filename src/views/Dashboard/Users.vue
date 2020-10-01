<template>
    <top-nav>
        <li v-if="$can.view($store.getters.getAuthUser, 'list-users')">
            <router-link :to="{ name: 'users.index'}">All System Users</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'restore-user')">
            <router-link :to="{ name: 'users.deleted'}">Deleted Users</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'list-customers')">
            <router-link :to="{ name: 'users.customers'}">List Customer</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'list-roles')">
            <router-link :to="{ name: 'users.roles'}">Manage Roles</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'attach-permissions')">
            <router-link :to="{ name: 'users.permissions'}">Manage Permissions</router-link>
        </li>
        <li v-if="$can.view($store.getters.getAuthUser, 'create-users')">
            <router-link :to="{ name: 'users.create'}">Create User</router-link>
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
