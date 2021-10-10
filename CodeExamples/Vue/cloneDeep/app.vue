<script setup>
import { onBeforeMount } from '@vue/runtime-core'
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import Component from './component.vue'

const store = useStore()

// Получаем объект с бэка
onBeforeMount(() => store.dispatch('fetchObject'))

// Получаем объект из хранилища для редактироватья 0 уровня вложенности
const object = computed(() => store.getters['getObject'])

// Получаем первый элемент массива children и назначаем изменения в исходный объект
const objectFirstChild = computed({
    get: () => store.getters['getObject'].children[0],
    set: (value) => store.commit('assignObject', value)
})

// Получаем статус об наличии изменений в объекте
const isModified = computed(() => store.getters['isModified'])

// Производим сохранение результата редактирования
const saveChanges = () => {
    store.dispatch.updateObject(object.value)
}

</script>
<template>
    <!-- Редактируем Title -->
    <Component v-if="object?.title" fieldName="title" v-model:title="object.title" />

    <!-- Редактируем Child Title первого элемента массива -->
    <Component
        v-if="objectFirstChild?.child_title"
        fieldName="child_title"
        v-model:child_title="objectFirstChild.child_title"
    />
    <button :disabled="!isModified" @click="saveChanges">Сохранить изменения</button>
</template>