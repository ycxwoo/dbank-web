<template>
    <div class="string-container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>随机字符串</span>
                </div>
            </template>
            <el-form label-width="80px">
                <el-form-item label="包含字符: ">
                    <el-checkbox-group v-model="pageData.includeStr">
                        <el-checkbox label="a-z" value="a-z" checked />
                        <el-checkbox label="A-Z" value="A-Z" checked />
                        <el-checkbox label="0-9" value="0-9" checked />
                        <el-checkbox label="特殊字符" value="特殊字符"  />
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="排除字符: ">
                        <el-checkbox v-model="pageData.exIncludeStr" label="iIl1o0O" value="iIl1o0O" />
                </el-form-item>
                <el-form-item label="数量: ">
                    <el-radio-group v-model="pageData.createNum">
                        <el-radio value="2" size="large">2</el-radio>
                        <el-radio value="5" size="large">5</el-radio>
                        <el-radio value="10" size="large">10</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="长度: ">
                    <el-radio-group v-model="pageData.createLength" v-if="!pageData.customLength">
                        <el-radio value="16" size="large">16</el-radio>
                        <el-radio value="32" size="large">32</el-radio>
                        <el-radio value="64" size="large">64</el-radio>
                        <el-radio value="128" size="large">128</el-radio>
                    </el-radio-group>
                    <el-input v-model="pageData.createLength"  v-else/>
                </el-form-item>

                <el-form-item>
                    <el-button type="success" @click="createRandomStr()">生成</el-button>
                    <el-button type="primary" @click="customLength()">自定义长度</el-button>
                </el-form-item>
            </el-form>

            <div v-for="(item, index) in pageData.randomStr" :key="index">
                <el-input readonly :value="item" style="margin-bottom: 3px;" @click="copyText(item)"/>
            </div>

        </el-card>
    </div>
  </template>
  
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue'
import { copyText } from '@/utils/tools'


defineOptions({
    name: "Menu"
})

const pageData =  reactive({
    includeStr: ["a-z", "A-Z", "0-9"],
    exIncludeStr: false,
    createLength: "16",
    createNum: "2",
    randomStr: [] as string[],
    customLength: false,
})

const customLength = () => {
    pageData.customLength = !pageData.customLength
}

const createRandomStr = () => {
    let str = "";
    if (pageData.includeStr.includes("a-z")) {
        str += "abcdefghijklmnopqrstuvwxyz";
    }
    if (pageData.includeStr.includes("A-Z")) {
        str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (pageData.includeStr.includes("0-9")) {
        str += "0123456789";
    }
    if (pageData.includeStr.includes("特殊字符")) {
        str += "~!@#$%^&*()_+`-=[]{}|;':\",./<>?";
    }
    if (pageData.exIncludeStr) {
        str = str.replace(/[iIl1o0O]/g, "");
    }
    if(str == "") {
        ElMessage({ type: 'warning', message: '请选择包含字符',})
        return;
    }

    const result = [];
    var createNum =  parseInt(pageData.createNum)
    var createLength =  parseInt(pageData.createLength)
    for (let i = 0; i < createNum; i++) {
        let temp = "";
        for (let j = 0; j < createLength; j++) {
            temp += str[Math.floor(Math.random() * str.length)];
        }
        result.push(temp);
    }
    pageData.randomStr = result;
}

onMounted(() => {
    // createRandomStr()
})


</script>
<style scoped>
    .string-container { 
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .box-card {
            width: 480px;
            max-height: 800px;
            overflow: auto;
        }
    }

</style>
  