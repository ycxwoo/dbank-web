<template>
    <div class="json-format-container">
        <JSONEditor
            v-model="jsonData"
            mode="text"
            height="600"
            ref="editor"
            @change="onChange"
        />
    </div>
  </template>
  
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'

import JSONEditor from 'vue3-ts-jsoneditor';

defineOptions({
    name: "JsonFormat",
    components: {
        JSONEditor
    },
})

const jsonData = ref({});

const editor = ref();

const onChange = (value: any) => {
    // console.log("s = ", s)
    // editor.value.$set('DDD')
    // editor.value.$refresh()
}

onMounted(async () => {
    await nextTick()
})


</script>
<style scoped>
    .json-format-container {
    }

</style>
  