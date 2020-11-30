<template>
    <div class="login-page">
        <div class="login-page-left">
            <div class="login-page-left-cover" :style="'background-image: url('+require('@/assets/images/login-cover.jpg')+')'">
                <div class="login-page-left-cover-content">
                    <h1>Excellent anonymous polling website.</h1>
                    <div class="login-page-left-footer">
                      Made with <span class="text-red">❤</span> by Erik
                    </div>
                </div>
            </div>
        </div>
        <div class="login-page-right">
            <div class="login-page-right-header">
                <h1 class="login-page-right-header-title text-black">Login</h1>
                <p class="login-page-right-header-subtitle">Silahkan login dengan akun yang sudah terdaftar</p>
            </div>
            <div class="login-page-right-body">
                <form class="login-page-right-body-form" @submit.prevent="login">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input class="textbox" type="text" name="username" id="username" v-model="loginData.username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="input-password">
                          <input class="textbox" :type="!viewPass ? 'password' : 'text'" name="password" id="password" v-model="loginData.password">
                          <i @click="viewPass = !viewPass" :class="!viewPass ? 'fas fa-eye' : 'fas fa-eye-slash active'"></i>
                        </div>
                        <div class="reset-password">
                          <a href="#" class="text-primary">Forgot Password?</a>
                        </div>
                    </div>
                    <Button :loading="isLoading" @click.native="login">Login</Button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Base/Button.vue';

export default {
    components: {
        Button
    },
    data() {
      return {
        loginData: {
          username: '',
          password: ''
        },
        isLoading: false,
        viewPass: false,
      }
    },
    methods: {
      login() {
        this.isLoading = true;
        this.$store.dispatch('auth/login', this.loginData)
          .then(res => {
            // console.log(res);
            this.isLoading = false;
            this.$router.push('/')
          })
          .catch(err => {
            this.isLoading = false;
            alert(err.response.data.message)
          })
      }
    }
}
</script>

<style lang="scss" scoped>
.login-page {
    height: 100vh;
    display: flex;
    width: 100%;
    @include breakpoint(sm) {
      flex-direction: column;
      &-left,
      &-right {
        width: 100% !important;
      }
      &-left-cover-content {
        padding: 50px 30px !important;
        h1 {
          font-size: 2.6rem !important; 
        }
      }
      &-right {
        padding: 80px 30px !important;
      }
      &-left-footer {
        display: none;
      }
    }
    &-left {
        height: 100%;
        width: 40%;
        &-cover {
            height: 100%;
            background-repeat: no-repeat;
            background-size: cover;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            &-content {
                // background: rgb(6, 91, 194, 0.8);
                background: rgb(16, 24, 94, .7);
                color: white;
                width: 100%;
                height: 100%;
                padding: 80px 50px {
                  bottom: 40px;
                };
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                word-break: break-word;
                h1 {
                    font-size: 2.8rem;
                }
            }
        }
    }
    &-right {
        width: 60%;
        padding: 10px 20px;
        padding: 80px;
        &-header {
          margin-bottom: 50px;
          &-title {
            margin-bottom: 8px;
          }
          &-subtitle {
              font-size: 13px;
              color: $gray;
              width: calc(100% - 60%);
              line-height: 1.7;
              @include breakpoint(sm) {
                width: 100%;
              }
          }
        }
        &-body {
          &-form {
            width: 100%;
            > *, input {
              width: 100%;
            }
            button {
              margin-top: 25px;
            }
            .input-password {
              position: relative;
              i {
                position: absolute;
                right: 20px;
                top: 18px;
                font-size: 17px;
                color: $gray;
                cursor: pointer;
                transition: .3s;
                &.active {
                  color: $primary;
                }
              }
            }
            .reset-password {
              margin-top: 5px;
              margin-left: auto;
              a {
                font-size: 14px;
                font-weight: 500;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
    }
    
}
</style>