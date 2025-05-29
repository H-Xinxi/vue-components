<script setup lang="ts">
import { TABLE_INJECTION_KEY } from 'element-plus/es/components/table/src/tokens.mjs';
import { inject, onBeforeMount, onMounted } from 'vue';

const elTable = inject(TABLE_INJECTION_KEY)
console.log(elTable)
elTable!.attrs.onRowClick = (e) => {
        console.log(e)
    }
onBeforeMount(() => {



})
</script>
<template>
  <div></div>
</template>

<style scoped></style>
