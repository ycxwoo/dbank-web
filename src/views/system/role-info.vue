<template>
    <div class="role-info-container">
        <el-page-header @back="goBack" :content="pageData.pageName"> </el-page-header>
        <el-form ref="formRef" :model="pageData.formData" :rules="pageData.rules" label-width="80px" label-position="right"  class="form-container">
            <el-form-item label="角色" prop="name">
                <el-input v-model="pageData.formData.name" style="width: 30%"/>
            </el-form-item>
            <el-form-item label="菜单" prop="pageData.menuList">
                <el-tree ref="treeRef" :data="pageData.menuList" show-checkbox node-key="path" default-expand-all :render-content="renderContent" highlight-current/>
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

import { getList } from '@/api/menu'
import { addRole, getInfo, editRole } from '@/api/role'

defineOptions({
    name: "RoleInfo"
})

const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>()
const treeRef = ref<InstanceType<typeof ElTree>>()

// 定义菜单项 key 的类型
type MenuKey = string | number;

//新增对话框数据
const pageData =  reactive({
    pageName: "添加",
    formData:{
        id: "",
        name: "",
        level: 1,
        menu: [] as MenuKey[],
    },
    rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' },],
    },
    menuList: [],
})


const getLists = async () => {
    var res = await getList({"page":1,"page_size":1000})
    pageData.menuList = res.data.list
}

const getAllCheckedKeys = () => {
    var cKeys= treeRef.value!.getCheckedKeys(false)
    var hcKeys = treeRef.value!.getHalfCheckedKeys()

    // 将半选中的节点也加入到选中节点中
    return Array.from(new Set([...cKeys, ...hcKeys]));
}

const getInfos = async () => {
    getInfo({"id":pageData.formData.id}).then(res => {
        pageData.formData.name = res.data.name
        pageData.formData.level = res.data.level
        
        //设置勾选, 由于keys中包含父级的ID, 所以会勾选所有, 需要再次取消勾选
        treeRef.value!.setCheckedKeys(res.data.menu, true)
        //获取已勾选的
        var checkedKeys = getAllCheckedKeys()
        //循环 checkedKeys , 如果 已勾选的未包含在 res.data.menu, 则取消勾选
        checkedKeys.forEach((key: any) => {
            if(!res.data.menu.includes(key)){
                treeRef.value!.setChecked(key, false, false)
            }
        });

        //清空
        // treeRef.value!.setCheckedKeys([], false)
    })
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            var cKeys= treeRef.value!.getCheckedKeys(false)
            var hcKeys = treeRef.value!.getHalfCheckedKeys()

            // 将半选中的节点也加入到选中节点中
            const allKeys = Array.from(new Set([...cKeys, ...hcKeys]));

              // 清空 formData.menu
            pageData.formData.menu = [];

            // 循环将 allKeys 中的元素放入 pageData.formData.menu 中
            allKeys.forEach((key: any) => {
                return pageData.formData.menu.push(key);
            });

            if(pageData.formData.id != "") {
                editRole(pageData.formData).then(async (res: any) => {
                    console.log(res)
                    goBack()
                }).catch((err: any) => {
                    console.log(err)
                })
            }else{
                addRole(pageData.formData).then(async (res: any) => {
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

const renderContent = (h: any, { node, data, store }: any) => {
    return h('span', {}, data.meta ? data.meta.title : data.label);
}

const goBack = () => {
    console.log('go back');
    router.back();
}

onMounted(async () => {
    await nextTick()
    //必须要先等待getLists结果完全回来，再调用getInfos, 应为getInfos中需要设置勾选
    await getLists()
    if(route.query.id){
        pageData.formData.id = route.query.id as string
        pageData.pageName = "编辑"
        getInfos()
    }
})


</script>

<style scoped>
    .role-info-container {
        .form-container {
            margin: 20px
        }
    }
</style>