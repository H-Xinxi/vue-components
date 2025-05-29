<script setup lang="tsx" generic="T, Col extends Column<T>">
import { ElTable, ElTableColumn, type TableProps } from "element-plus";
import elTableDefaultProps from "element-plus/es/components/table/src/table/defaults";
import type { TableColumnCtx } from "element-plus/lib/components/index.js";
import { computed, type Component } from "vue";
import ElTableContextmenus from "./el-table-contextmenus/el-table-contextmenus.vue";
// console.log('a',a)
// defaultProps
export type Column<D> = InstanceType<typeof ElTableColumn>["$props"] & {
  prop?: keyof D;
  slots?: {
    default?: Component;
    header?: Component;
  };
};
export type ColumnCtx<T> = TableColumnCtx<T> & { property: keyof T };
// type A = TableProps
// const { columns, ...tableProps } = defineProps<
defineSlots<{
  cell(props: {
    is: Component;
    row: T;
    column: ColumnCtx<T>;
    index: number;
  }): unknown;
  header(props: {
    is: Component;
    column: ColumnCtx<T>;
    index: number;
  }): unknown;
}>();
const props = withDefaults(
  defineProps<
    {
      columns: Col[];
      allowDragLastColumn?: boolean;
    } & TableProps<T>
  >(),
  Object.fromEntries(
    Object.entries(elTableDefaultProps)
      .filter((entry) => "default" in entry[1])
      .map(([key, value]) => {
        return [key, (value as any).default];
      })
  ) as {}
);
const tableProps = computed(() => ({ ...props, column: undefined }));
</script>
<template>
  <ElTable  v-bind="tableProps">
    <ElTableContextmenus/>
    <ElTableColumn
      v-for="{ slots, ...col } of props.columns"
      :key="col.key ?? col.prop"
      v-bind="col"
    >
      <template v-if="slots?.header" #header="{ column, $index: index }">
        <slot
          name="header"
          v-bind="{
            is: slots.header,
            // is: (props) => h(slots.default as any, { row, column, index, ...props }),
            column,
            index,
          }"
        >
          <component :is="slots.header" v-bind="{ column, index }"></component>
        </slot>
      </template>
      <template v-if="slots?.default" #default="{ row, column, $index: index }">
        <slot
          name="cell"
          v-bind="{
            is: slots.default,
            // is: (props) => h(slots.default as any, { row, column, index, ...props }),
            row,
            column,
            index,
          }"
        >
          <component
            :is="slots.default"
            v-bind="{ row, column, index }"
          ></component>
        </slot>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<style scoped></style>
