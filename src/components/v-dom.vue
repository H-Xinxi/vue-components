<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { useAttrs, watchEffect } from 'vue';

const props = defineProps<{
    dom: HTMLElement
}>()
const attrs = useAttrs()
watchEffect(() => {
    for(let [key,value] of Object.entries(attrs)) {
        if(key.startsWith('on')) {
            props.dom
        } else {

        }
        props.dom.setAttribute(key.toLowerCase(),(value as string))
    }
})
</script>

<style scoped>

</style>