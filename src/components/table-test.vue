<template>
  <div class="table-test-container">
    <ElForm ref="formRef" :model="form" :rules="formRules">
      <HTable :columns="columns" :data="tableData" allow-drag-last-column>
        <template #header="{ is, ...scope }">
          <component :is="is" v-bind="scope" @add="handleAdd"> </component>
        </template>
        <template #cell="{ is, row, column, index }">
          <component
            :is="is"
            :row
            :column
            :index
            :isEditing="row.id === editingRowId"
            :isDeleting
            v-model="form[column['property']]"
            @edit="handleEdit"
            @editCancel="handleEditCancel"
            @editConfirm="handleEditConfirm"
            @delete="handleDelete"
          />
        </template>
      </HTable>
    </ElForm>
  </div>
</template>

<script lang="tsx" setup>
import { ElForm, ElTable, ElTableColumn, type FormRules } from "element-plus";
// import type { Column } from "./HTable.vue";
import HTable from "./HTable.vue";
import { onMounted, reactive, ref, useTemplateRef } from "vue";
import { columns } from "./table-columns-config.tsx";
import { apiClient } from "../api.ts";
import type { Person } from "../../server/index.ts";
import { nanoid } from "nanoid";
const formRef = useTemplateRef("formRef");
const form = reactive({});
const formRules = reactive<FormRules<Person>>({
  name: [{ required: true, message: "请输入姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  age: [{ required: true, message: "请输入年龄" }],
  // pass: [{ validator: validatePass, trigger: 'blur' }],
  // checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  // age: [{ validator: checkAge, trigger: 'blur' }],
});
const editingRowId = ref<Person["id"] | null>(null);

const tableData = ref<Person[]>([
{
  age: 1,
},{
  age: 1,
}]);
const query = async () => {
  const res = await apiClient.persons.$get().then((res) => res.json());
  tableData.value = res;
};
const addPerson = async (data) => {
  const res = await apiClient.persons
    .$post({ json: data })
    .then((res) => res.json);
  console.log(res);
};
onMounted(() => {
  query();
});
const handleEdit = async ({ row, column }: any) => {
  if (isAdding.value) {
    tableData.value.shift();
  }
  isAdding.value = false;

  editingRowId.value = row.id;

  Object.assign(form, row);
};
const isAdding = ref(false);

const handleAdd = () => {
  if (isAdding.value) return;
  const addingId = nanoid();
  tableData.value.unshift({
    id: addingId,
  });
  editingRowId.value = addingId;
  isAdding.value = true;
  Object.assign(form, {
    name: undefined,
    gender: undefined,
    age: undefined,
  });
};
const handleEditConfirm = async (props) => {
  await formRef.value?.validate();
  if (isAdding.value) {
    await addPerson(form).finally(() => {
      isAdding.value = false;
      editingRowId.value = null;
      query();
    });
    return;
  }
  await apiClient.persons[":id"]
    .$patch({
      param: {
        id: props.row.id as string,
      },
      json: form,
    })
    .finally(() => {
      editingRowId.value = null;
      query();
    });

  // form
};
const handleEditCancel = async () => {
  if (isAdding.value) {
    isAdding.value = false;
    tableData.value.shift();
  }
  editingRowId.value = null;
};
const isDeleting = ref(false)
const handleDelete = async ({ row }) => {
  isDeleting.value = true
  await apiClient.persons[":id"].$delete({
    param: {
      id: row.id,
    },
  }).catch(() => {
    isDeleting.value = false
  });
  query().then(() => {
    isDeleting.value = false
  });
};
</script>
<style lang="scss" scoped>
.table-test-container {
  :deep(.el-form) {
    .el-form-item {
      margin: 0;
    }
    .el-form-item__error {
      position: absolute;
    }
  }
  :deep(.el-table) {
    .cell {
      overflow: visible;
      &:has(.el-form-item) {
        padding: 0;
      }
      .el-input__wrapper {
        padding: 0 12px;
      }
    }
  }
}
</style>
