<script setup lang="ts" generic="FC extends FormConfig">
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElSelect,
} from "element-plus";
import type { FormConfig } from "./types";
import type { FormDataType, HFormData } from "./hooks/use-form";
import { useTemplateRef } from "vue";
// import LL from 'leaflet'

const props = defineProps<{
  elFormProps?: InstanceType<typeof ElForm>["$props"];
  formData: FormDataType<FC>;
}>();

const formConfig = props.formData.getFormConfig();

type SlotProps<T extends keyof FC> = {
  formConfig: FC;
  formItemConfig: FC[T];
};

type SlotNameMap = {
  [key in keyof FC & string as `${key}:form-item`]: `${key}:form-item`;
};
const slots = defineSlots<
  {
    [key in keyof FC]: (props: SlotProps<key>) => void;
  } & {
    [key in keyof FC & string as `${key}:form-item`]: (
      props: SlotProps<key>
    ) => void;
  } & {
    [key in keyof FC & string as `${key}:label`]: (
      props: SlotProps<key> & { label: string }
    ) => void;
  }
>();
const elFormRef = useTemplateRef("elFormRef");

defineExpose({
  elFormRef,
});


function handleSubmit(e:SubmitEvent) {
  // e.preventDefault()
  props.formData.submit()

}
</script>

<template>
  <ElForm ref="elFormRef" :model="props.formData" v-bind="props.elFormProps" @submit.prevent="handleSubmit">
    <template v-for="(item, fieldName) in formConfig" :key="fieldName">
      <slot
        :name="`${fieldName as string}:form-item`"
        :form-config="formConfig"
        :form-item-config="item"
      >
        <ElFormItem
          :label="item.label"
          :prop="(fieldName as string)"
          :data-form-item.attr="fieldName"
          v-bind="item.formItemProps"
        >
          <template
            v-if="$slots[`${fieldName as string}:label`]"
            #label="{ label }"
          >
            <slot
              :name="`${fieldName as string}:label`"
              :form-config="formConfig"
              :form-item-config="item"
              :label="label"
            >
            </slot>
          </template>
          <slot
            :name="(fieldName as string)"
            :form-config="formConfig"
            :form-item-config="item"
          >
            <ElInput
              v-if="item.type === 'input'"
              v-model="props.formData[fieldName]"
            ></ElInput>
            <ElSelect
              v-if="item.type === 'select'"
              v-model="props.formData[fieldName]"
            >
              <ElOption
                v-for="{ key, value, label } of item.options"
                :key
                :label
                :value
              >
              </ElOption>
            </ElSelect>
          </slot>
        </ElFormItem>
      </slot>
    </template>
    <div>
      <ElButton type="primary" native-type="submit"> 提交 </ElButton>
    </div>
  </ElForm>
</template>

<style scoped></style>
