<template>
    <div class="menu-container">

        <el-dialog title="添加主菜单" v-model="addDialogFormDataVisible" :close-on-click-modal="false" width="35%" draggable >
            <el-form ref="addMenuFormRef" :model="addDialogFormData" :rules="addDialogFormDataRules" autocomplete="on" label-position="right" style="max-width: 400px" class="centered-form">
                <el-form-item label="路径"  prop="path">
                    <el-input v-model="addDialogFormData.path" />
                </el-form-item>
                <el-form-item label="名称"  prop="name">
                    <el-input v-model="addDialogFormData.name" />
                </el-form-item>
                <el-form-item label="重定向"  prop="redirect">
                    <el-input v-model="addDialogFormData.redirect" />
                </el-form-item>
                <el-form-item label="标题"  prop="meta.title">
                    <el-input v-model="addDialogFormData.meta.title" />
                </el-form-item>
                <el-form-item label="图标"  prop="meta.icon">
                    <el-input v-model="addDialogFormData.meta.icon" />
                </el-form-item>
                <el-form-item label="组件"  prop="component">
                    <el-input v-model="addDialogFormData.component" />
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addDialogSubmitForm(addMenuFormRef)">提交</el-button>
                <el-button type="primary" @click="addDialogFormDataVisible = false">关闭</el-button>
            </span>
        </el-dialog>

        <el-form :inline="true" :model="search" style="float: right;">
            <el-form-item label="状态" >
                <el-select v-model="search.status" placeholder="请选择" style="width: 120px" :empty-values="[null, undefined]">
                    <el-option label="全部" value="" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :icon="Search" @click="refresh()">搜索</el-button>
                <el-button type="primary" @click="add()">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table  v-loading="tableLoading" :data="tableData" row-key="id" stripe style="width: 100%; margin-top: 10px; margin-bottom: 10px;" >
            <el-table-column align="center" prop="id" label="ID" />
            <el-table-column align="center" prop="meta.title" label="菜单" />
            <el-table-column align="center" prop="path" label="路径" />
            <el-table-column align="center" prop="component" label="组件" />

            <el-table-column align="center" fixed="right" label="操作">
                <template v-slot="{row}">
                    <!-- <el-button v-if="row.status == 0" type="text" size="small" >审核</el-button> -->
                    <el-button type="primary" link size="small" >编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row type="flex" class="row-bg" justify="end">
            <el-pagination
                :current-page="page.current_page"
                :page-sizes="page.page_sizes"
                :page-size="page.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total_number"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-row>

    </div>
  </template>
  
<script lang="ts" setup>
import { reactive, ref, onBeforeMount } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getList,addMenu } from '@/api/menu'

defineOptions({
    name: "Menu"
})

let tableData = reactive([]);
const tableLoading = ref(false);

const page = reactive({
    current_page: 1,
    page_size: 10,
    page_sizes: [10, 20, 50, 100, 200, 500, 1000],
    page_total: 1,
    total_number: 0
})

const search = reactive({
    status: "",
})


// 新增对话框数据结构
interface addDialogFormDataStruct {
    path: string
    name: string
    redirect: string
    meta: {
        title: string
        onlySubmenu: boolean
        icon: string
    }
    children: any
    component: string
}

const addMenuFormRef = ref<FormInstance>()

// 对话框验证规则
const addDialogFormDataRules = reactive<FormRules<addDialogFormDataStruct>>({
    path: [
        { required: true, message: '请输入', trigger: 'blur' },
        { min: 3, max: 32, message: '长度为3-32', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
        { min: 3, max: 32, message: '长度为3-32', trigger: 'blur' }
    ],
    redirect: [{ required: true, message: '请输入', trigger: 'blur' }],
    component: [{ required: true, message: '请输入', trigger: 'blur' }],
    'meta.title': [{ required: true, message: '请输入', trigger: 'blur' }],
    'meta.icon': [{ required: true, message: '请输入', trigger: 'blur' }],
})

// 对话框显示控制
const addDialogFormDataVisible = ref(false)

// 新增对话框数据
let addDialogFormData =  reactive<addDialogFormDataStruct>({
    path: "",
    name: "",
    redirect: "",
    meta: {
        title: "",
        onlySubmenu: true,
        icon: ""
    },
    component: "",
    children: [],
})

const handleSizeChange = async (val: any) => {
    console.log(`每页 ${val} 条`)
    page.page_size = val
    page.current_page = 1
    getLists()
}
    
const handleCurrentChange = async (val: any) => {
    console.log(`当前页: ${val}`)
    page.current_page = val
    getLists()
}

const refresh = async () => {
    console.log('refresh')
    page.current_page = 1
    getLists()
}

const getLists = async () => {
    tableLoading.value = true
    let data: any = {
        page: page.current_page,
        page_size: page.page_size
    }

    if (search.status) {
        data.status = search.status
    }

    getList(data).then(res => {
        page.current_page = res.data.current_page
        page.page_size = res.data.page_size
        page.page_total = res.data.page_total
        page.total_number = res.data.total_number
        tableData = res.data.list

        tableLoading.value = false
    }).catch((e: any) => {
        tableLoading.value = false
    })
      
}

const add = async () => {
    addDialogFormDataVisible.value = true
}

const addDialogSubmitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            // addMenu(addDialogFormData).then(async (res: any) => {
            //     console.log(res)
            // }).catch((err: any) => {
            //     console.log(err)
            // })
        } else {
            console.log('error submit!', fields)
        }
    })
}

onBeforeMount(() => {
    getLists()
})


</script>
<style scoped>
    .menu-container {
        .centered-form {
            margin: 0 auto; /* 让表单水平居中 */
            max-width: 400px; /* 设置表单的最大宽度 */
        }

        .dialog-footer {
            display: flex;
            justify-content: flex-end; /* 让 footer 的按钮靠右 */
            margin-top: 20px; /* 给 footer 按钮一些顶部间距 */
        }
    }

</style>
  