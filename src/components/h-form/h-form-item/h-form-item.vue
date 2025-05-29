<script
  setup
  lang="ts"
  generic="FD extends FormDataType<any>, FC extends FormConfig, FCItem extends FormItemConfig<any>, FN extends string"
>
import { ElFormItem } from "element-plus";
import type { FormConfig, FormItemConfig } from "../types";
import type { FormDataType } from "../hooks/use-form";

const props = defineProps<{
  formData: FD;
  formConfig: FC;
  fieldName: FN;
  formItemConfig: FCItem;
}>();

defineSlots<{
  label(props: {
    formData: FD;
    formConfig: FC;
    formItemConfig: FCItem;
    fieldName: FN;
    label: string;
  }): any;
  //   label: [
  //     formData: FD,
  //     formConfig: FC,
  //     formItemConfig: FCItem,
  //     fieldName: FN,
  //     label: string
  //   ];
  default(props: {
    formData: FD;
    formConfig: FC;
    formItemConfig: FCItem;
    fieldName: FN;
    value: FD[FN];
  }): any;
}>();
</script>
<template>
  <ElFormItem
    :label="formItemConfig.label"
    :prop="fieldName"
    :data-form-item.attr="fieldName"
    v-bind="formItemConfig.formItemProps"
  >
    <template v-if="$slots.label" #label="{ label }">
      <slot
        name="label"
        :formData
        :formConfig
        :formItemConfig
        :fieldName
        :label
      ></slot>
    </template>
    <slot
      :formData
      :formConfig
      :formItemConfig
      :fieldName
      :value="formConfig[fieldName]"
    >
    </slot>
  </ElFormItem>
</template>

<style scoped></style>
