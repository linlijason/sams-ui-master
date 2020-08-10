<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.id"
          clearable
          size="small"
          placeholder="注册类型"
          class="filter-item"
          style="width: 160px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in dict.register_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="缴费金额">
            <el-input v-model="form.amount" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="注册类型">
          <template slot-scope="scope">
            <span v-if="scope.row.id == 'referee_student'">
              裁判员-学生
            </span>
            <span v-else-if="scope.row.id == 'referee_normal'">
              裁判员-普通
            </span>
            <span v-else>
              {{ dict.label.register_type[scope.row.id] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('amount')" prop="amount" label="缴费金额" />
        <el-table-column v-if="columns.visible('updatetime')" prop="updatetime" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updatetime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','costConfig:edit']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
              :disabled-dle="true"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudCostConfig from '@/api/costConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '会费配置', url: 'api/costConfig', sort: 'id,desc', crudMethod: { ...crudCostConfig }})
const defaultForm = { id: null, amount: null, updatetime: null }
export default {
  name: 'CostConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['register_type'],
  data() {
    return {
      permission: {
        add: ['admin', 'costConfig:add'],
        edit: ['admin', 'costConfig:edit'],
        del: ['admin', 'costConfig:del']
      },
      rules: {
        amount: [
          { required: true, message: '费用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '注册类型' }
      ]
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: true,
      del: false,
      download: true
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
