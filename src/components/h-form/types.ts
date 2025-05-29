import type { ElFormItem, ElInput, ElOption, ElSelect } from "element-plus";

export type FormItemConfig<T> = InputFormItemConfig | SelectFormItemConfig<T>;

interface FormItemConfigBase<T> {
  // label?: string;
  label: string,
  initialValue: T
  formItemProps?: InstanceType<typeof ElFormItem>["$props"];
  formControlProps?: Record<string, any>;
}

interface InputFormItemConfig extends FormItemConfigBase<string> {
  type: "input";
  // initialValue: string
  formControlProps?: InstanceType<typeof ElInput>["$props"];
}

interface SelectFormItemConfig<T> extends FormItemConfigBase<T> {
  type: "select";
  initialValue: T,
  options: InstanceType<typeof ElOption>["$props"][];
  formControlProps?: InstanceType<typeof ElSelect>["$props"];
}

export type FormConfig = Record<string, FormItemConfig<unknown>>;
