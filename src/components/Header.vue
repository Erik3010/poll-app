<template>
    <div>
        <header>
            <div class="container">
                <nav>
                    <div class="logo">
                        <h1>Poll<span class="text-primary">.io</span></h1>
                    </div>
                    <ul class="menu">
                        <li class="menu-profile">
                            <div class="header-profile">
                                <div class="header-profile-avatar">{{ initialName }}</div>
                                <div class="header-profile-detail">
                                    <h4>{{ user.username }}</h4>
                                </div>
                            </div>
                            <div class="header-profile-dropdown">
                                <div class="dropdown-label">Settings</div>
                                <a href="#" class="dropdown-link">Lihat Profile</a>
                                <a href="#" class="dropdown-link">Edit Profile</a>
                                <a href="#" class="dropdown-link">Ganti Password</a>
                                <div class="dropdown-line"></div>
                                <div class="dropdown-label">Polling</div>
                                <a href="#" class="dropdown-link">Polling Saya</a>
                                <a href="#" class="dropdown-link">Voting Saya</a>
                                <div class="dropdown-line"></div>
                                <a @click="logout" class="dropdown-link logout-link">Logout</a>
                            </div>
                        </li>
                        <!-- <li><Button>Login</Button></li> -->
                        <!-- <li><Button :loading="isLoading" @click.native="logout" class="btn-danger">Logout</Button></li> -->
                    </ul>
                </nav>
            </div>
        </header>
    </div>
</template>

<script>
import Button from '@/components/Base/Button.vue';
import { mapGetters } from 'vuex';

export default {
    components: {
        Button
    },
    data() {
        return {
            isLoading: false,
        }
    },
    mounted() {
        this.$store.dispatch('auth/me');
    },
    computed: {
        ...mapGetters('auth', {user: 'getUser', initialName: 'getInitial'}),
    },
    methods: {
        logout() {
            this.isLoading = true;
            this.$store.dispatch('auth/logout')
                .then(res => {
                    this.$router.push('/login')
                    this.isLoading = false;
                })
                .catch(err => {
                    this.isLoading = false;
                })
        }
    }
}
</script>

<style lang="scss" scoped>
header {
    // height: 80px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #ccc;
    background: white;
    z-index: 99;
    // padding: 0 80px;
    padding: 1rem 0;
    .container {
      padding: 0px 80px;
    }
    *:not(.logo):not(button):not(.header-profile-avatar):not(.header-profile-detail):not(.header-profile-dropdown) {
        // height: 100%;
        display: flex;
        align-items: center;
    }
    nav {
        width: 100%;
        justify-content: space-between;
        .logo h1{
            font-weight: 800;
            font-size: 1.8rem;
        }
        li {
            padding: 0 25px;
            button {
                width: 120px;
            }
        }
    }
}
</style>