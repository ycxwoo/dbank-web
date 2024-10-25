<template>
    <div class="time-format-container">
        <el-row :gutter="20">
            <el-col :span="2">
                <span class="inline-flex items-center">当前时间</span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="pageData.currentTimestamp" readonly @click="copyText(pageData.currentTimestamp)"/>
            </el-col>
            <el-col :span="4">
                <el-input v-model="pageData.currentTime" readonly @click="copyText(pageData.currentTime)" />
            </el-col>
        </el-row>
        <br/>
        <el-row :gutter="20">
            <el-col :span="2">
                <span class="inline-flex items-center">时间戳转换</span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="pageData.givenTimestamp" placeholder="请输入时间戳"/>
            </el-col>
            <el-col :span="4">
                <el-input v-model="pageData.coverTimeStr" readonly @click="copyText(pageData.coverTimeStr)" />
            </el-col>
        </el-row>
        <br/>
        <el-row :gutter="20">
            <el-col :span="2">
                <span class="inline-flex items-center">转时间戳</span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="pageData.givenTimeStr" placeholder="请输入时间字符串"/>
            </el-col>
            <el-col :span="4">
                <el-input v-model="pageData.coverTimestamp" readonly @click="copyText(pageData.coverTimestamp)" />
            </el-col>
        </el-row>

    </div>
  </template>
  
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue'

import { copyText, GetCurrentTimestamp, timestampToStr, strToTimestamp } from '@/utils/tools'

defineOptions({
    name: "TimeFormat"
})

const pageData =  reactive({
    currentTimestamp: 0,
    currentTime: "",
    givenTimestamp: "",
    coverTimeStr: "",
    givenTimeStr: "",
    coverTimestamp: 0,
})

const updateTime = () => {
    pageData.currentTimestamp = GetCurrentTimestamp()
    pageData.currentTime = timestampToStr(pageData.currentTimestamp)
}

watch(() => pageData.givenTimestamp, (newVal) => {
    pageData.coverTimeStr = timestampToStr(parseInt(newVal));
})

watch(() => pageData.givenTimeStr, (newVal) => {
    pageData.coverTimestamp = strToTimestamp(newVal) / 1000;
})

onMounted(() => {
    setInterval(updateTime, 1000);
    pageData.currentTimestamp = GetCurrentTimestamp();
})

</script>
<style scoped>
    .time-format-container {
    }

</style>
  