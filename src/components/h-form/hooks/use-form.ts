import type {
  ElForm,
  FormInstance,
  FormItemProp,
  FormValidateCallback,
} from "element-plus";
// import type HForm from "../h-form.vue";
import type { FormConfig } from "../types";
import type { ComponentExposed } from "vue-component-type-helpers";
import type { Arrayable } from "element-plus/es/utils/typescript.mjs";
import {
  reactive,
  type MaybeRefOrGetter,
  toRaw,
  type Ref,
  type ShallowRef,
  watchEffect,
  toRef,
  toValue,
  unref,
  ref,
  isRef,
  watch,
} from "vue";
import type HForm from "../h-form.vue";

export class HFormData {
  #formConfig: Ref<FormConfig>;
  #formRef: Ref<ComponentExposed<typeof HForm> | null>;
  #callbacks;
  constructor(
    formConfig: MaybeRefOrGetter<FormConfig>,
    formRef: Ref<ComponentExposed<typeof HForm> | null>,
    callbacks?: {
      get: () => Promise<{
        [key in keyof FormConfig]: FormConfig[key]["initialValue"];
      }>;
      submit: (formData: FormDataType<FormConfig>) => Promise<void>;
    }
  ) {
    this.#formRef = formRef;
    this.#callbacks = callbacks;
    const formData = Object.fromEntries(
      Object.entries(toValue(formConfig)).map(([key, value]) => [
        key,
        value.initialValue,
      ])
    );

    Object.assign(this, formData);

    if (isRef(formConfig)) {
      this.#formConfig = formConfig;
    } else if (typeof formConfig === "function") {
      this.#formConfig = toRef(formConfig);
      watch(formConfig, () => {
        this.#formConfig.value = formConfig();
      });
    } else {
      this.#formConfig = toRef(formConfig);
    }
  }
  async get() {
    Object.assign(this, await toRaw(this).#callbacks?.get());
  }
  async submit() {
    return this.validate().then(() => {

      return toRaw(this).#callbacks?.submit(this as any);
    })
  }
  async validate(callback?: FormValidateCallback) {
    const formRef = unref(toRaw(this).#formRef);
    return formRef?.elFormRef?.validate(callback);
    // return toRaw(this).#formRef.value?.elFormRef?.validate(callback);
  }
  resetFields(props?: Arrayable<FormItemProp>) {
    const formRef = unref(toRaw(this).#formRef);
    return formRef?.elFormRef?.resetFields(props);
  }
  getFormConfig() {
    return toRaw(this).#formConfig;
  }
}

export type FormDataType<T extends FormConfig> = {
  [key in keyof T]: T[key]["initialValue"];
} & {
  getFormConfig: () => Ref<T>;
} & HFormData;

export const useForm = <T extends FormConfig>(
  formConfig: MaybeRefOrGetter<T>,
  callbacks?: {
    get: () => Promise<{
      [key in keyof T]: T[key]["initialValue"];
    }>;
    submit: (formData: FormDataType<T>) => Promise<void>;
  }
) => {
  const formRef = ref<ComponentExposed<typeof HForm<T>> | null>(null);

  const formData = reactive(
    new HFormData(formConfig, formRef, callbacks)
  ) as FormDataType<T>;

  formData.get();
  // interface A extends FormDataType<T> {

  // }
  return { formData, formRef };
};
