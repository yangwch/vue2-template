<template>
  <div class="login_page fillcontain">
    <div class="logo"><i class="iconfont icon-home"></i>智慧综合运维平台</div>
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <!--icon定义字符串，：icon定义方法-->
            <el-input v-model="loginForm.username"  auto-complete="off" placeholder="| 请输入用户名" :prefix-icon="userNameClass" @focus="handleUserFocus(true)" @blur="handleUserFocus(false)" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="| 请输入密码" v-model="loginForm.password" :prefix-icon="passwordClass" @focus="handlePwdFocus(true)" @blur="handlePwdFocus(false)" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
  import {login} from '@/api/index'
  import {mapActions, mapState} from 'vuex'
  export default {
    data () {
      return {
        // 定义变量:输入框获取焦点
        focusUserName: false,
        focusPassword: false,
        loginForm: {
          userName: '',
          password: '',
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        },
        showLogin: false,
        loading: false
      }
    },
    mounted () {
      this.showLogin = true
    },
    computed: {
      ...mapState(['userInfo']),
      // 用户名、密码输入框获取焦点与失去焦点绑定的方法
      userNameClass () {
        return this.focusUserName ? 'blank iconfont icon-account focus' : 'blank iconfont icon-account'
      },
      passwordClass () {
        return this.focusPassword ? 'blank iconfont icon-lock focus' : 'blank iconfont icon-lock'
      }
    },
    methods: {
      ...mapActions(['getAdminData', 'saveUserInfo']),
      async submitForm (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.loading = true
            // 请求登录接口
            try {
              let res = await login({ username: this.loginForm.username, password: this.loginForm.password })
              if (res) {
                /* 将用户token本地缓存 */
                this.saveUserInfo(res)
                this.$message({
                  type: 'success',
                  message: '登录成功'
                })
                this.$router.push('main')
              } else {
                this.$message({
                  type: 'error',
                  message: (res.error && res.error.message) || '用户名或密码错误'
                })
                this.loading = false
              }
            } catch (ex) {
              this.$message({
                  type: 'error',
                  message: '用户名或密码错误'
                })
              this.loading = false
            }
          } else {
            this.loading = false
            this.$notify.error({
              title: '错误',
              message: '请输入正确的用户名密码',
              offset: 100
            })
            return false
          }
        })
      },
      
      handleUserFocus: function (isFocus) {
        this.focusUserName = isFocus
      },
      handlePwdFocus: function (isFocus) {
        this.focusPassword = isFocus
      }
    },
    watch: {
      adminInfo: function (newValue) {
        /*
        if (newValue && newValue.user && newValue.user.id) {
          this.$message({
            type: 'success',
            message: '检测到您之前登录过，将自动登录'
          });
          this.$router.push('manage')
        }
        */
      }
    }
  }
</script>

<style lang="less">
  @import '../../../style/mixin';
  .login_page{
    background: #82b0e087;
    background-size: cover;
    background-position: center;
    .logo{
      text-align: center;
      padding: 30px 0;
      font-size: 30px;
      span{
        display:block;
        font-size:40px;
        color: #07ccef;
        margin-top:20px;
      }
    }
    .form_contianer{
      .wh(320px, 180px);
      .ctp(320px, 180px);
      padding: 35px 45px;
      border-radius: 5px;
      text-align: center;
      background-color: #324056 ;
      opacity:0.9;
      margin-left:-200px;
      margin-top:-100px;
      .submit_btn{
        width: 100%;
        font-size: 16px;
        background-color:#1aa2ff;
        border:1px solid #1aa2ff;
        color:#ffffff;
      }
    }
    .form-fade-enter-active, .form-fade-leave-active {
      transition: all 1s;
    }
    .form-fade-enter, .form-fade-leave-active {
      transform: translate3d(0, -50px, 0);
      opacity: 0;
    }
    .focus{
      color:#1aa2ff;
      
    }
    /*更改element原有的样式*/
    input{
      background:#202d3d ;
       border-color:#202d3d ;
       color:#c3c3c3 ;
     }
  
    .el-form-item__error{
      color:#e04f78;
      padding-top:8px;
    }
    .el-form-item{
      margin-bottom: 30px;
    }
    .el-input__icon{
      left:0;
    }
    .el-input__icon + .el-input__inner{
      padding-left:40px;
    }
    .el-form-item.is-error .el-input__inner{
      border-color:#e04f78;
    }
  }
  
</style>
