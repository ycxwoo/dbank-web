<template>
    <div class="user-info-container">
        <el-page-header @back="goBack" :content="pageData.pageName"> </el-page-header>
        <el-form ref="formRef" :model="pageData.formData" :rules="pageData.rules" label-width="80px" label-position="right"  class="form-container">
            <el-form-item label="账号" prop="username">
                <el-input v-model="pageData.formData.username" style="width: 30%" :disabled="pageData.formData.id!=''"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="pageData.formData.password" type="password" show-password style="width: 30%"/>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="pageData.formData.name" style="width: 30%"/>
            </el-form-item>
            <el-form-item label="简介" prop="introduction">
                <el-input v-model="pageData.formData.introduction" type="textarea" style="width: 30%"/>
            </el-form-item>
            <el-form-item label="角色" prop="roleChecked">
                <el-checkbox-group v-model="pageData.formData.roles">
                    <el-checkbox v-for="(item, index) in pageData.roleList" :key="index" :label="item.name" :value="item.name" />
                </el-checkbox-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
            </el-form-item>
        </el-form>

    </div>
  </template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from "vue-router";
import type { FormInstance, ElTree } from 'element-plus'

import { getInfo, addUser, editUser } from '@/api/admin'
import { getList as getRoleList } from '@/api/role'

defineOptions({
    name: "UserInfo"
})

const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>()

//新增对话框数据
const pageData =  reactive({
    pageName: "添加",
    formData:{
        id: "",
        username: "",
        password: "",
        name: "",
        introduction: "",
        roles: [],
    },
    rules: {
        username: [{ required: true, message: '请输入', trigger: 'blur' },],
        password: [{ required: true, message: '请输入', trigger: 'blur' },],
        name: [{ required: true, message: '请输入', trigger: 'blur' },],
        introduction: [{ required: true, message: '请输入', trigger: 'blur' },],
    },
    roleList: [] as any[],
})


const getRoleLists = async () => {
    var res = await getRoleList({"page":1,"page_size":1000})
    pageData.roleList = res.data.list
}


const getInfos = async () => {
    getInfo({"id":pageData.formData.id}).then(res => {
        pageData.formData.username = res.data.username
        pageData.formData.name = res.data.name
        pageData.formData.introduction = res.data.introduction
        pageData.formData.roles = res.data.roles

        //数据填充后,设置规则能避免编辑时提示请输入
        pageData.rules.password = []
    })
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            if(pageData.formData.id != "") {
                editUser(pageData.formData).then(async (res: any) => {
                    console.log(res)
                    goBack()
                }).catch((err: any) => {
                    console.log(err)
                })
            }else{
                addUser(pageData.formData).then(async (res: any) => {
                    console.log(res)
                    goBack()
                }).catch((err: any) => {
                    console.log(err)
                })
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

const goBack = () => {
    console.log('go back');
    router.back();
}

onMounted(async () => {
    await nextTick()
    //必须要先等待getLists结果完全回来，再调用getInfos, 应为getInfos中需要设置勾选
    await getRoleLists()
    if(route.query.id){
        pageData.formData.id = route.query.id as string
        pageData.pageName = "编辑"
        getInfos()
    }
})


</script>

<style scoped>
    .user-info-container {
        .form-container {
            margin: 20px
        }
    }
</style>