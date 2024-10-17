<template>
    <div class="role-container">

        <el-form :inline="true">
            <el-form-item label="状态">
                <el-select v-model="search.status" placeholder="请选择">
                <el-option label="全部" value="" />
                <!-- <el-option v-for="(value, key) in _get_check_status_list()" :key="key" :label="value" :value="key" /> -->
                </el-select>
            </el-form-item>

            <!-- <el-input v-model="search.wallet_address" placeholder="请输入内容" :style="{ width: '500px' }">
                <template slot="prepend">用户账户</template>
            </el-input> -->

            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button type="primary" @click="add()">添加</el-button>
        </el-form>

        <el-table  v-loading="tableLoading" :data="tableData" stripe style="width: 100%; margin-top: 10px; margin-bottom: 10px;" >
            <el-table-column align="center" prop="id" label="ID" width="180" />
            <el-table-column align="center" prop="level" label="角色" />
            <el-table-column align="center" prop="menu" label="菜单" />
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
import { getList } from '@/api/role'

defineOptions({
    name: "Role"
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
    
}

onBeforeMount(() => {
    getLists()
})

</script>
<style scoped>
.role-container {
}

</style>
  