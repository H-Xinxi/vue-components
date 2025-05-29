<script setup lang="ts">
import { ref, useTemplateRef, watch, watchEffect } from "vue";
import HForm from "./h-form.vue";
import { useForm } from "./hooks/use-form";
import { useFormConfig } from "./test/form-config";
// import { ElButton } from "element-plus";
import type { ComponentExposed } from "vue-component-type-helpers";
import HFormItem from "./h-form-item/h-form-item.vue";
import { getComponent } from "./test";
// const formRef = useTemplateRef<ComponentExposed<typeof HForm>>("formRef");
const formConfig = useFormConfig();
const { formData, formRef } = useForm(formConfig, {
  async get() {
    return new Promise<{ name: string; gender: string }>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          // name: "test",
          gender: "男",
        });
      }, 3000);
    });
  },
  async submit(f) { 
    console.log("submited", f);
  },
});

watch(
  formData,
  () => {
    console.log(JSON.stringify(formData));
  },
  {
    deep: true,
    immediate: true,
  }
);
// formConfig2
const handleSubmit = () => {
  // console.log(formData.name);
  // formData.validate((isvalid) => {
  //   console.log(isvalid);
  // });
  // formConfig.value.h = {
  //   label: 'hhh',
  //   type: 'input'
  // }
};


const ElButton1 = getComponent()
</script>

<template>
  <ElButton1 type="primary" @click="handleSubmit">提交12</ElButton1>
  <HForm
    ref="formRef"
    :el-form-props="{
      rules: {
        name: [{ required: true, message: '必须输入姓名', trigger: 'blur' }],
      },
    }"
    :form-data="formData"
  >
    <template #name="{ formConfig, formItemConfig }">
      <HFormItem
        :form-config="formConfig"
        :form-item-config="formItemConfig"
        field-name="name"
        :form-data="formData"
      >
        <template
          #label="{ fieldName, formConfig, formData, formItemConfig, label }"
        >
          {{ label }} 123
        </template>
        <template #default="{ value }"> </template>
      </HFormItem>
    </template>

    <!-- <template #name:label="{ label }"> {{ label }} 123 </template> -->
    <template #gender:label="{ label }"> {{ label }} eee </template>
    <!-- <template #gender="{ formConfig, formItemConfig }">
      {{ formItemConfig }}
    </template>
    <template #test:a> test123</template> -->
    <!-- <template #form-item#gender> 

    </template> -->
  </HForm>
</template>

<style scoped></style>
