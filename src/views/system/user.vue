<template>
    <div class="user-container">

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

        <el-table  v-loading="tableLoading" :data="tableData" stripe style="width: 100%; margin-top: 10px; margin-bottom: 10px;" >
            <!-- <el-table-column align="center" prop="id" label="ID" width="250px" /> -->
            <el-table-column align="center" prop="username" label="账号" />
            <el-table-column align="center" prop="name" label="昵称" />
            <el-table-column align="center" prop="roles" label="角色" />
            <el-table-column align="center" prop="login_time" label="登录时间" >
                <template v-slot="{row}">
                    {{ timestamp_to_str(row.login_time) }}
                </template>
            </el-table-column>

            <el-table-column align="center" fixed="right" label="操作">
                <template v-slot="{row}">
                    <el-button type="primary" link size="small" @click="edit(row.id)">编辑</el-button>
                    <el-button type="primary" link size="small" @click="del(row.id,row.name)">删除</el-button>
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
import { reactive, ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

import { getList, delUser } from '@/api/admin'
import { timestamp_to_str } from '@/utils/tools'

defineOptions({
    name: "User"
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

const search = reactive({
    status: '',
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
    router.push({path: '/system/user/edit'});   //使用route.query.id获取
}

const edit = async (id: string) => {
    router.push({path: '/system/user/edit',query:{id:id}});   //使用route.query.id获取
}

const del = async (id: string, name: string) => {
    ElMessageBox.confirm( '确认删除该条数据( ' + name + ' ) ?', '警告',
        { cancelButtonText: '取消', confirmButtonText: '确认', type: 'warning',}
    ).then(() => {
        delUser({"id":id}).then(async (res: any) => {
            ElMessage({ type: 'success', message: '已删除',})
            getLists()
        }).catch((err: any) => {
            console.log(err)
        })
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消',})
    })
}

onMounted(() => {
    getLists()
});

</script>

<style scoped>
.user-container {
}

</style>
  