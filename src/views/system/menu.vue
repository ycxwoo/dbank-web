<template>
    <div class="menu-container">

        <el-dialog :title="addDialog.title" v-model="addDialog.visible" :close-on-click-modal="false" width="35%" draggable >
            <el-form ref="addMenuFormRef" :model="addDialog.formData" :rules="addDialog.rules" label-width="100px" label-position="left" class="centered-form">
                <el-form-item label="仅显示子菜单">
                    <el-switch v-model="addDialog.formData.meta.onlySubmenu" />
                </el-form-item>
                <el-form-item label="隐藏">
                    <el-switch v-model="addDialog.formData.hidden" />
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="addDialog.formData.path" />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addDialog.formData.name" />
                </el-form-item>
                <el-form-item label="标题" prop="meta.title">
                    <el-input v-model="addDialog.formData.meta.title" />
                </el-form-item>
                <el-form-item label="图标" prop="meta.icon">
                    <el-input v-model="addDialog.formData.meta.icon" />
                </el-form-item>
                <el-form-item label="组件" prop="component">
                    <el-input v-model="addDialog.formData.component" />
                </el-form-item>
                <el-form-item label="重定向" prop="redirect">
                    <el-input v-model="addDialog.formData.redirect" />
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addDialogSubmitForm(addMenuFormRef)">提交</el-button>
                <el-button type="primary" @click="addDialog.visible = false">关闭</el-button>
            </span>
        </el-dialog>

        <el-form :inline="true" :model="search" style="float: right;">
            <!-- <el-form-item label="状态" >
                <el-select v-model="search.status" placeholder="请选择" style="width: 120px" :empty-values="[null, undefined]">
                    <el-option label="全部" value="" />
                </el-select>
            </el-form-item> -->

            <el-form-item>
                <el-button type="primary" :icon="Refresh" @click="refresh()">刷新</el-button>
                <el-button type="primary" @click="add()">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table  v-loading="tableLoading" :data="tableData" row-key="id" stripe style="width: 100%; margin-top: 10px; margin-bottom: 10px;" >
            <el-table-column align="center" prop="id" label="ID" width="250px"/>
            <el-table-column align="center" prop="meta.title" label="菜单" />
            <el-table-column align="center" prop="hidden" label="是否隐藏" width="100px" />
            <!-- <el-table-column align="center" prop="meta.onlySubmenu" label="仅显示子菜单" width="120px" /> -->
            <el-table-column align="center" prop="path" label="路径" />
            <!-- <el-table-column align="center" prop="component" label="组件" /> -->
            <el-table-column align="center" fixed="right" label="操作">
                <template v-slot="{row}">
                    <el-button type="primary" link size="small" @click="edit(row)">编辑</el-button>
                    <el-button v-if="row.id" type="primary" link size="small" @click="addLevel(row)">添加</el-button>
                    <el-button type="primary" link size="small" @click="del(row)">删除</el-button>
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
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useRouter, useRoute } from "vue-router";
import { Refresh } from '@element-plus/icons-vue'
import { getList, addMenu, editMenu, delMenu } from '@/api/menu'

defineOptions({
    name: "Menu"
})

const router = useRouter();

let tableData = reactive([]);
const tableLoading = ref(false);

const page = reactive({
    current_page: 1,
    page_size: 10,
    page_sizes: [10, 20, 50, 100, 200, 500, 1000],
    page_total: 1,
    total_number: 0
})

const addMenuFormRef = ref<FormInstance>()

const search = reactive({
    status: "",
})

//新增对话框数据
const addDialog =  reactive({
    formData:{
        id: "",
        path: "",
        name: "",
        redirect: "",
        meta: {
            title: "",
            onlySubmenu: false,
            icon: ""
        },
        component: "/views/layout/index",
        children: [],
        hidden: false,
        editPath: "",
    },
    title: "添加主菜单",
    visible: false,
    rules: {
        path: [{ required: true, message: '请输入', trigger: 'blur' },],
        name: [{ required: true, message: '请输入', trigger: 'blur' },],
        // redirect: [{ required: true, message: '请输入', trigger: 'blur' }],
        'meta.title': [{ required: true, message: '请输入', trigger: 'blur' }],
        'meta.icon': [{ required: true, message: '请输入', trigger: 'blur' }],
        component: [{ required: true, message: '请输入', trigger: 'blur' }],
    }
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
    addDialog.visible = true
    addDialog.title= "添加主菜单"
    addDialog.formData = {
        id: "",
        path: "",
        name: "",
        redirect: "",
        meta: {
            title: "",
            onlySubmenu: false,
            icon: ""
        },
        hidden: false,
        component: "/views/layout/index",
        children: [],
        editPath: "",
    }
}

const addLevel = async (row: any) => {
    addDialog.visible = true
    addDialog.title= "添加子菜单"
    addDialog.formData = {
        id: row.id,
        path: "",
        name: "",
        redirect: "",
        meta: {
            title: "",
            onlySubmenu: false,
            icon: ""
        },
        hidden: false,
        component: "",
        children: [],
        editPath: "",
    }
}

const edit = async (row: any) => {
    // router.push({path: '/system/menu/edit',query:{id:id}});   //使用route.query.id获取
    addDialog.title = "编辑菜单"
    addDialog.visible = true
    addDialog.formData = row
    addDialog.formData.editPath = row.path
}

const del = async (row: any) => {
    ElMessageBox.confirm( '确认删除该条数据( ' + row.meta.title + ' ) ?', '警告',
        { cancelButtonText: '取消', confirmButtonText: '确认', type: 'warning',}
    ).then(() => {
        delMenu({"id":row.id, "path":row.path}).then(async (res: any) => {
            ElMessage({ type: 'success', message: '已删除',})
            getLists()
        }).catch((err: any) => {
            console.log(err)
        })
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消',})
    })
}

const addDialogSubmitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            if(addDialog.formData.editPath != ""){
                editMenu(addDialog.formData).then(async (res: any) => {
                    console.log(res)
                    addDialog.visible = false
                    getLists()
                }).catch((err: any) => {
                    console.log(err)
                })
            }else{
                addMenu(addDialog.formData).then(async (res: any) => {
                    console.log(res)
                    addDialog.visible = false
                    getLists()
                }).catch((err: any) => {
                    console.log(err)
                })
            }
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
  