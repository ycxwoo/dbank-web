<template>
    <div class="params-container">
        <span>参数管理</span>
    </div>
  </template>
  
<script lang="ts" setup>
import { reactive, ref, onBeforeMount } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
    name: "Params"
})

</script>
<style scoped>
.params-container {
}

</style>
  