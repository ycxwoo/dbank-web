<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <h2 class="title">后台管理</h2>

      <el-form-item prop="username">
        <el-input size="large" v-model="loginForm.username" placeholder="账号" prefix-icon="User" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          size="large"
          v-model="loginForm.password"
          placeholder="密码"
          prefix-icon="Lock"
          suffix-icon="Hide"
        />
      </el-form-item>

      <el-form-item prop="code">
        <el-container>
          <el-input
            style="max-width: 272px"
            size="large"
            v-model="loginForm.code"
            placeholder="请输入验证码"
          ></el-input>
          <img
            style="width: 128px; cursor: pointer"
            :src="loginForm.captcha"
            @click="get_auth_code"
            alt="1111"
          />
        </el-container>
      </el-form-item>
      <el-form-item>
        <el-button size="large" style="width: 100%" type="primary" @click="submitForm(loginFormRef)"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onBeforeMount } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { get_captcha, login } from '@/api/login'
import { SetToken } from '@/stores/token'

import { useRouter, useRoute } from "vue-router";
 
const route = useRoute();
const router = useRouter();

interface RuleForm {
  username: string
  password: string
  code: string
  captcha: string
  id: string
}

const loginFormRef = ref<FormInstance>()
let loginForm = reactive<RuleForm>({
  username: '',
  password: '',
  code: '',
  captcha: '',
  id: ''
})

const loginRules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 32, message: '长度为3-32', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 32, message: '长度为3-32', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      login({
        username: loginForm.username,
        password: loginForm.password,
        code: loginForm.code,
        id: loginForm.id
      })
        .then((res) => {
          console.log(res)
          router.replace('/home')
          SetToken(res.token)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const get_auth_code = async () => {
  const res = await get_captcha()
  loginForm.captcha = res.img
  loginForm.id = res.id
}

onBeforeMount(() => {
  get_auth_code()
})
</script>
<style scoped>
.login-container {
  position: relative; /* 设置为相对定位 */
  width: 100%;
  height: 100%;
  background-color: #2d3a4b;
  color: white; /* 设置字体颜色为白色 */
}

.login-form {
  position: absolute; /* 设置为绝对定位 */
  top: 35%; /* 距离顶部 40% */
  left: 50%; /* 居中 */
  transform: translate(-50%, -50%); /* 垂直水平居中 */
  width: 400px;
}
.title {
  text-align: center; /* 居中 */
}
</style>
