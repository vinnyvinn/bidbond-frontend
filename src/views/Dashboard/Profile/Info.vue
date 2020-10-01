<template>
    <div>
        <h4 align="center">My Account</h4>
        <hr>
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <table class="table table-striped">
                    <tr>
                        <td><strong>Name</strong></td>
                        <td>{{ user.firstname+ ' '+((user.middlename!== null)?user.middlename:'')+ ' '+user.lastname
                            }}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Email</strong></td>
                        <td>{{ user.email }}</td>
                    </tr>
                    <tr>
                        <td><strong>Phone</strong></td>
                        <td>{{ user.phone_number }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            user() {
                return this.$store.getters.getAuthUser;
            }
        },
    }
</script>
