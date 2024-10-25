<template>
    <div class="encode-container">
        <el-row>
            MD5编码
        </el-row>
        <br/>
        <el-row :gutter="24">
            <el-col :span="8">
                <el-form label-width="50px">
                    <el-form-item label="明文: ">
                        <el-input v-model="pageData.md5Plaintext" type="textarea" :rows="3"/>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="7">
                <el-form label-width="80px">
                    <el-form-item label="MD5: ">
                        <el-input v-model="pageData.md5" readonly @click="copyText(pageData.md5)"/>
                    </el-form-item>
                    <el-form-item label="MD5(MD5): ">
                        <el-input v-model="pageData.md5Md5" readonly @click="copyText(pageData.md5Md5)"/>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="9">
                <el-form label-width="140px">
                    <el-form-item label="MD5(大写): ">
                        <el-input v-model="pageData.md5Up" readonly @click="copyText(pageData.md5Up)"/>
                    </el-form-item>
                    <el-form-item label="MD5(MD5)(大写): ">
                        <el-input v-model="pageData.md5Md5Up" readonly @click="copyText(pageData.md5Md5Up)"/>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            Base64编码解码
        </el-row>
        <br/>
        <el-row :gutter="24" style="max-height: 720px;overflow: auto;">
            <el-col :span="12">
                <el-form label-width="48px">
                    <el-form-item label="明文: ">
                        <el-input v-model="pageData.base64Plaintext" type="textarea" :rows="20"/>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <el-form label-width="48px">
                    <el-form-item label="密文: ">
                        <el-input v-model="pageData.base64Ciphertext" type="textarea" :rows="20"/>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
  </template>
  
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue'

import { copyText } from '@/utils/tools'
import { encodeBase64, decodeBase64, md5sum } from '@/utils/crypto'

defineOptions({
    name: "Encode"
})

const pageData =  reactive({
    md5Plaintext: "",
    md5: "",
    md5Md5: "",
    md5Up: "",
    md5Md5Up: "",
    base64Plaintext: "",
    base64Ciphertext: "",
})

watch(() => pageData.md5Plaintext, (newVal) => {
    if(newVal == "") {
        pageData.md5 = "";
        pageData.md5Md5 = "";
        pageData.md5Up = "";
        pageData.md5Md5Up = "";
        return;
    }
    pageData.md5 = md5sum(newVal).toString();
    pageData.md5Md5 = md5sum(pageData.md5).toString();
    pageData.md5Up = md5sum(newVal).toString().toUpperCase();
    pageData.md5Md5Up = md5sum(pageData.md5).toString().toUpperCase();
})

watch(() => pageData.base64Plaintext, (newVal) => {
    if(newVal == "") {
        pageData.base64Ciphertext = "";
        return;
    }
    pageData.base64Ciphertext = encodeBase64(newVal)
})

watch(() => pageData.base64Ciphertext, (newVal) => {
    if(newVal == "") {
        pageData.base64Plaintext = "";
        return;
    }
    pageData.base64Plaintext = decodeBase64(newVal);
})

onMounted(() => {

})


</script>
<style scoped>
    .encode-container {

    }

</style>
  