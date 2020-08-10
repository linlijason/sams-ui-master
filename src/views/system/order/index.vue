<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="搜索类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select
          v-model="query.status"
          clearable
          size="small"
          placeholder="订单状态"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
        <el-option
            v-for="item in dict.order_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.relationType"
          clearable
          size="small"
          placeholder="关联类型"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
        <el-option
            v-for="item in dict.register_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="query.payDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="支付时间"
          end-placeholder=""
        />
        <el-date-picker
          v-model="query.refundDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="退款时间"
          end-placeholder=""
        />
        <el-date-picker
          v-model="query.createDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建时间"
          end-placeholder=""
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="订单编号" />
        <el-table-column v-if="columns.visible('title')" prop="title" label="订单标题" />
        <el-table-column v-if="columns.visible('username')" prop="username" label="用户" />
        <el-table-column v-if="columns.visible('amount')" prop="amount" label="金额" />
        <el-table-column v-if="columns.visible('payType')" prop="payType" label="支付方式">
          <template slot-scope="scope">
            {{ dict.label.pay_type[scope.row.payType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('status')" prop="status" label="订单状态">
          <template slot-scope="scope">
            {{ dict.label.order_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('thirdOrderNo')" prop="thirdOrderNo" label="第三方订单号" />
        <el-table-column v-if="columns.visible('payDate')" prop="payDate" label="支付时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.payDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('refundDate')" prop="refundDate" label="退款时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.refundDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('refundReason')" prop="refundReason" label="退款原因" />
        <el-table-column v-if="columns.visible('createDate')" prop="createDate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudPayOrder from '@/api/payOrder'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '订单', url: 'api/payOrder', sort: 'createDate,desc', crudMethod: { ...crudPayOrder }})
const defaultForm = { id: null, title: null, relationId: null, relationType: null, status: null, thirdOrderNo: null, thirdCallback: null, payDate: null, refundDate: null, refundReason: null, createDate: null }
export default {
  name: 'PayOrder',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['register_type', 'order_status', 'pay_type'],
  data() {
    return {
      permission: {
        add: ['admin', 'payOrder:add'],
        edit: ['admin', 'payOrder:edit'],
        del: ['admin', 'payOrder:del']
      },
      rules: {
        id: [
          { required: true, message: '订单编号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '订单编号' },
        { key: 'username', display_name: '用户' },
        { key: 'thirdOrderNo', display_name: '第三方订单号' }
      ]
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
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
