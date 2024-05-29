
<template>
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
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <el-avatar :src="defAvatar"> </el-avatar>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人中心</el-dropdown-item>
                            <el-dropdown-item>退出</el-dropdown-item>
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
import { reactive, ref, onBeforeMount } from 'vue'
// import type { FormInstance, FormRules } from 'element-plus'
// import { get_captcha, login } from '@/api/login'
// import { SetToken } from '@/stores/token'

import defAvatar from '@/assets/images/default-avatar.gif';
import { useRouter, useRoute } from "vue-router";
import LayoutMenu from "./menu.vue" 
import { GetUserInfo } from '@/stores/user-info';
 
const route = useRoute();
const router = useRouter();

defineOptions({
    name: "Layout"
})

const isCollapse = ref(false)
const userInfo = ref({
    username: "",
    menu: []
})

function collapse(){
    isCollapse.value = !isCollapse.value
    // console.log("collapse = ", isCollapse.value);
}

// var collapse = () => {
//   isCollapse = ! isCollapse
//     console.log("collapse = ", isCollapse);
// }

onBeforeMount(() => {
     //获取用户信息
     userInfo.value = GetUserInfo();
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

</style>