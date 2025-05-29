import { ref } from "vue";
import type { FormConfig, FormItemConfig } from "../types";

export const useFormConfig = () => {
  const genderOptions = ref<{ label: string; value: string }[]>([]);
  setTimeout(() => {
    genderOptions.value = [
      {
        label: "男",
        value: "1",
      },
      {
        label: "女",
        value: "0",
      },
    ];
  }, 5000);

  const initialValue = ref({});

  const formConfig = ref({
    name: {
      type: "input",
      // value: undefined as string | undefined,
      // label: "姓名",,
      initialValue: "",
      label: "姓名",
      formItemProps: {
        rules: [{ required: true, message: "必须输入姓名", trigger: "blur" }],
      },
      // formControlProps: {},
    },
    gender: {
      type: "select",
      initialValue: "",
      // label: "性别",
      // value: undefined as string | undefined,
      label: "性别",
      options: genderOptions as unknown as { label: string; value: string }[],
    },
  } satisfies FormConfig);
  return formConfig;

};
