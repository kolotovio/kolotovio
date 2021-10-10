<script setup>
const props = defineProps({
    fieldName: {
        type: String
    }
})
</script>
<template>
    <input
        type="text"
        @input="$emit(`update:${props.fieldName}`, $event.target.value)"
        :value="$attrs[props.fieldName]"
    />
</template>