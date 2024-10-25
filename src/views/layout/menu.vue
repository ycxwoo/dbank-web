
<template>

    <el-aside class="sidebar" :width="isCollapse?'64px':'250px'">
        <div class="logo">
            <img :src="logoSrc" alt="" style="height: 32px; height: 32px; margin-right: 16px;">
            <h3 v-if="!isCollapse">后台管理</h3>
        </div>
        <el-menu class="menu" :collapse="isCollapse" :default-active="$route.path" background-color="#304156" text-color="#fff" :collapse-transition="false" @open="handleOpen" @close="handleClose" router>

            <template v-for="item in menuList" :key="item.path">
                <!-- //如果有子菜单，或者只显示子菜单属性(onlySubmenu)为false, 将以多级菜单显示 -->
                <el-sub-menu v-if="item.children?.length || !item.meta?.onlySubmenu" :index="item.path">
                    <template #title>
                        <el-icon> <component :is="item.meta?.icon"></component> </el-icon>
                        <span>{{ item.meta?.title }}</span>
                    </template>
                    <el-menu-item :index="child.path" v-for="child in item.children" :key="child.path">
                        <el-icon><component :is="child.meta?.icon"></component></el-icon>
                        <span>{{ child.meta?.title }}</span>
                    </el-menu-item>
                </el-sub-menu>
                <!-- //否则只显示一级菜单 -->
                <el-menu-item v-else :index="item.path">
                    <el-icon><component :is="item.meta?.icon"></component></el-icon>
                    <span>{{ item.meta?.title }}</span>
                </el-menu-item>
            </template>

        </el-menu>

    </el-aside>
</template>

<script  lang="ts" setup>
import logoSrc from '@/assets/images/logo.png';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute, type RouteRecordNormalized,type RouteRecordRaw } from "vue-router";
import lodash from 'lodash';
// import { ElCollapseTransition } from 'element-plus';
import { GetUserInfo  } from '@/stores/user-info'; // 导入用户信息存储

defineOptions({
    name: "LayoutMenu"
})

const props = defineProps<{
  isCollapse: boolean;
}>();

const menuList = ref([] as RouteRecordRaw[]);

const route = useRoute();
const router = useRouter();

const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
}

//过滤菜单列表
const filterMenuList = (menus: any) => {
    for (let i = menus.length - 1; i >= 0; i--) {
        if (menus[i].hidden) {
            menus.splice(i, 1);  // 删除数组中的元素
            continue
        }

        if (menus[i].children) {
            filterMenuList(menus[i].children);
        }
    }
}

onMounted(() => {
    //获取用户信息
    var userInfo = GetUserInfo();
    //深拷贝
    var userInfoTemp =  lodash.cloneDeep(userInfo)
    filterMenuList(userInfoTemp.menu);

    // 循环菜单, 这里只能操作两级菜单,2级以上菜单需要重写
    userInfoTemp.menu.forEach((menu: any) => {
        if(menu.meta.onlySubmenu){
            // console.log("menu.children = ", menu.children,", menu = ", menu)
            menu.children.forEach((child: any) => {
                menuList.value.push(child);
            });
        }else{
            menuList.value.push(menu);
        }
    });

    // console.log("menuList all = ", menuList.value);
})

</script>

<style>

.sidebar {
    background-color: #304156;
    transition: width 300ms ease;
}

.logo {
    /* margin-top: 5px; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* font-size: 13px; */
    height: 50px;
    color: #fff;
    background-color: #2b2f3a;
}

.menu {
    border-right: none !important;
}

</style>