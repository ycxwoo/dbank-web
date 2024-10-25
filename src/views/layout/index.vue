
<template>

    <el-dialog title="修改密码" v-model="cpwDialog.visible" :close-on-click-modal="false" width="35%" draggable >
        <el-form ref="cpwFormRef" :model="cpwDialog.formData" :rules="cpwDialog.rules" label-width="70px" label-position="right" class="centered-form">
            <el-form-item label="账号" prop="username">
                {{ userInfo.username }}
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="cpwDialog.formData.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="cpwDialog.formData.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword2">
                <el-input v-model="cpwDialog.formData.newPassword2" type="password" show-password />
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cpwDialogSubmitForm(cpwFormRef)">提交</el-button>
            <el-button type="primary" @click="cpwDialog.visible = false">关闭</el-button>
        </span>
    </el-dialog>

    <el-container style="height: 100%;">
      <LayoutMenu :isCollapse="isCollapse"></LayoutMenu>
      <el-container>
        <el-header class="header">
            <div style="cursor: pointer;" @click="collapse">
                <el-icon size="24" v-if="isCollapse"><Expand /></el-icon>
                <el-icon size="24" v-else><Fold /></el-icon>
            </div>
            <el-breadcrumb class="bread-crumb" separator="/">
                <template v-for="(item, index) in $route.matched" :key="index">
                    <!-- :to="{ path: item.path }" -->
                    <el-breadcrumb-item v-if="!item.meta.onlySubmenu" to="#">{{ item.meta.title }}</el-breadcrumb-item>
                </template>
            </el-breadcrumb>
            <div class="avatar">
                <span style="margin-right: 5px;">{{userInfo.username}}</span>
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <el-avatar :src="defAvatar"> </el-avatar>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="openCpwDialog">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout" divided >退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>
        <el-divider style="margin: 0px;"/>
        <el-main class="content">
            <router-view />
        </el-main>
      </el-container>
    </el-container>
</template>



<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
// import type { FormInstance, FormRules } from 'element-plus'
// import { get_captcha, login } from '@/api/login'
// import { SetToken } from '@/stores/token'

import defAvatar from '@/assets/images/default-avatar.gif';
import { useRouter, useRoute } from "vue-router";
import LayoutMenu from "./menu.vue" 
import { GetUserInfo, RemoveUserInfo } from '@/stores/user-info';
import { logout } from '@/api/login'
import { changePassword } from '@/api/admin'
import { RemoveToken } from '@/stores/token';
import { ElMessage, type FormInstance } from 'element-plus';
 
const route = useRoute();
const router = useRouter();

defineOptions({
    name: "Layout"
})

const isCollapse = ref(false)
let userInfo = reactive({
    username: "",
    menu: []
})

const cpwFormRef = ref<FormInstance>()

const cpwDialog = reactive({
    visible: false,
    formData: {
        username: "",
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
    },
    rules: {
        oldPassword: [{ required: true, message: '请输入', trigger: 'blur' },],
        newPassword: [{ required: true, message: '请输入', trigger: 'blur' },],
        newPassword2: [{ required: true, message: '请输入', trigger: 'blur' },],
    },
})


function collapse(){
    isCollapse.value = !isCollapse.value
    // console.log("collapse = ", isCollapse.value);
}

// var collapse = () => {
//   isCollapse = ! isCollapse
//     console.log("collapse = ", isCollapse);
// }

const cpwDialogSubmitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            if(cpwDialog.formData.newPassword != cpwDialog.formData.newPassword2){
                ElMessage.error('两次输入的密码新密码不一致')
                return
            }

            if(cpwDialog.formData.newPassword.length < 6){
                ElMessage.error('密码长度不能小于6位')
                return
            }

            changePassword(cpwDialog.formData).then(async (res: any) => {
                console.log(res)
                cpwDialog.visible = false
                handleCommand("logout")
            }).catch((err: any) => {
                console.log(err)
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

const handleCommand = async (command: string | number | object) => {
    if(command == "logout"){
        logout().then(() => {
            //删除用户信息
            RemoveUserInfo()
            RemoveToken()
            router.push({ path: '/login' })
        }).catch((err: any) => {
            //删除用户信息
            RemoveUserInfo()
            RemoveToken()
            router.push({ path: '/login' })
        })
    }else if(command == "openCpwDialog"){
        cpwDialog.visible = true
    }
}

onMounted(() => {
     //获取用户信息
     userInfo = GetUserInfo();

     cpwDialog.formData.username = userInfo.username
})

</script>

<style scoped>
    .menu {
        background-color: #304156;
    }
    .header {
        align-items: center;
        justify-content: space-between;
        display: flex;
        padding-left: 5px;
        height: 50px
    }
    .bread-crumb {
        margin-left: 40px;
        position: fixed;
    }
    .avatar {
        display: flex;
        align-items: center;
        /* margin-right: 20px; */
    }
    .el-dropdown-link {
        cursor: pointer;
        color: var(--el-color-primary);
    }
    .content {
        padding: 10px;
        overflow: auto;
    }

    .centered-form {
        margin: 0 auto; /* 让表单水平居中 */
        max-width: 400px; /* 设置表单的最大宽度 */
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end; /* 让 footer 的按钮靠右 */
        margin-top: 20px; /* 给 footer 按钮一些顶部间距 */
    }
</style>