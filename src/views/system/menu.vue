<template>
    <div class="menu-container">
        <span>菜单管理</span>
    </div>
  </template>
  
<script lang="ts" setup>
import { reactive, ref, onBeforeMount } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
    name: "Menu"
})

</script>
<style scoped>
.menu-container {
}

</style>
  