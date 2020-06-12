<template>
  <div class="login-container">
      <div class="login-img"></div>
      <el-form
        ref="login-form"
        :model="user"
        :rules="rules"
      >
          <el-form-item prop="mobile">
            <el-input
              v-model="user.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="user.code"
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              :loading="loginLoading"
              @click="onLogin"
            >登录</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false
      },
      // checked: false,
      loginLoading: false, // 登录时的 loading 状态
      rules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请勾选用户协议'))
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据
      // const user = this.user
      // 表单验证
      // console.log(this.$refs['login-form'])
      this.$refs['login-form'].validate((valid, err) => {
        if (!valid) {
          return
        }
        // 验证通过 提交登录
        this.login()
      })
    },
    login () {
      // 开启 loading
      this.loginLoading = true
      login(this.user).then(res => {
        console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭 loading
        this.loginLoading = false
      }).catch(err => {
        console.log('登录失败', err)
        this.$message.error('登录失败, 手机号或验证码错误')
        // 关闭 loading
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("./login_bg.jpg") no-repeat;
    background-size: cover;
    .login-img{
      width: 300px;
      height: 57px;
      background: url("./logo_index.png") no-repeat #fff center center;
      padding:0 50px;
      padding-bottom: 30px;
    }
    .el-form{
      background-color: #fff;
      padding:25px 50px 20px;
      min-width: 300px;
      .login-btn{
        width:100%
      }
    }
}
</style>>
