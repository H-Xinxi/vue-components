import {
  computed,
  defineComponent,
  inject,
  onMounted,
  watchEffect,
  type PropType,
} from "vue";
import type { Column, ColumnCtx } from "./HTable.vue";
import {
  ElButton,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElSpace,
} from "element-plus";
import { TABLE_INJECTION_KEY } from "element-plus/es/components/table/src/tokens.mjs";
import type { Person } from "../../server";
import { Plus } from "@element-plus/icons-vue";

type Data = Person;
type Props = {
  isEditing: boolean;
  row: Data;
  column: ColumnCtx<Data>;
  index: number;
  modelValue: string;
};
// const props = ['isEditing', 'row', 'column', 'index', 'modelValue'] as (keyof Props)[];
const props = {
  isEditing: {
    type: Boolean,
    default: false,
  },
  row: { type: Object as PropType<Data>, required: true as const },
  column: {
    type: Object as PropType<ColumnCtx<Data>>,
    required: true as const,
  },
  index: { type: Number, require: true },
  modelValue: [String, Number],
};
const emits = {
  "update:modelValue"(value: string | number) {
    return true;
  },
};
export const columns = [
  {
    prop: "name" as const,
    label: "姓名",
    width: 180,

    slots: {
      default: defineComponent({
        setup: (props, { emit }) => {
          const cellValue = computed(() => props.row[props.column["property"]]);
          return () =>
            props.isEditing ? (
              <ElFormItem prop={props.column["property"]}>
                <ElInput
                  modelValue={props.modelValue}
                  onUpdate:modelValue={(value) =>
                    emit("update:modelValue", value)
                  }
                ></ElInput>
              </ElFormItem>
            ) : (
              cellValue.value
            );
        },
        inheritAttrs: false,
        props,
        emits,
      }),
    },
  },
  {
    prop: "gender" as const,
    label: "性别" as const,
    width: 180,
    slots: {
      // header: () => {
      //   return <div>123</div>;
      // },
      default: defineComponent(
        (props, { emit }) => {
          const cellValue = computed(() => props.row[props.column["property"]]);
          return () => {
            return props.isEditing ? (
              <ElFormItem prop={props.column["property"]}>
                <ElSelect
                  modelValue={props.modelValue}
                  // onChange={(value) => emit("update:modelValue", value)}
                  onUpdate:modelValue={(value) =>
                    emit("update:modelValue", value)
                  }
                >
                  <ElOption value="男" label="男"></ElOption>
                  <ElOption value="女" label="女"></ElOption>
                </ElSelect>
              </ElFormItem>
            ) : (
              props.row[props.column["property"]]
            );
          };
        },
        {
          inheritAttrs: false,
          props,
          emits,
        }
      ),
    },
  },
  {
    prop: "age" as const,
    label: "年龄",
    width: 180,
    slots: {
      default: defineComponent(
        (props, { emit }) => {
          const cellValue = computed(() => props.row[props.column["property"]]);
          return () => {
            return props.isEditing ? (
              <ElFormItem prop={props.column["property"]}>
                <ElInputNumber
                  modelValue={props.modelValue as number}
                  // onChange={(value) => emit("update:modelValue", value!)}
                  onUpdate:modelValue={(value) =>
                    emit("update:modelValue", value!)
                  }
                ></ElInputNumber>
              </ElFormItem>
            ) : (
              props.row[props.column["property"]]
            );
          };
        },
        {
          inheritAttrs: false,
          props,
          emits,
        }
      ),
    },
  },
  {
    key: "actions" as const,
    label: "操作",
    slots: {
      header: (props, { emit }) => {
        return (
          <div>
            操作
            <ElButton
              icon={Plus}
              size="small"
              circle
              type="primary"
              onClick={() => emit("add")}
            ></ElButton>
          </div>
        );
      },
      default: defineComponent(
        (props, { emit }) => {
          return () => {
            return (
              <ElSpace>
                {props.isEditing ? (
                  <ElButton onClick={() => emit("editConfirm", props)}>
                    确定
                  </ElButton>
                ) : (
                  <ElButton
                    onClick={() => emit("edit", props)}
                  >
                    编辑
                  </ElButton>
                )}
                {props.isEditing ? (
                  <ElButton onClick={() => emit("editCancel", props)}>
                    取消
                  </ElButton>
                ) : (
                  <ElButton
                    onClick={() => emit("delete", props)}
                  >
                    删除
                  </ElButton>
                )}
              </ElSpace>
            );
          };
        },
        {
          inheritAttrs: false,
          props: ["row", "column", "index", "isEditing", "isDeleting"],
          emits: ["edit", "editConfirm", "editCancel", "delete"],
        }
      ),
    },
  },
] satisfies Column<Person>[];
