<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="关注时间" prop="focusDate">
            <el-input v-model="form.focusDate" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('fromAvatar')" prop="fromAvatar" label="用户头像" />
        <el-table-column v-if="columns.visible('fromUsername')" prop="fromUsername" label="用户昵称" />
        <el-table-column v-if="columns.visible('fromSign')" prop="fromSign" label="用户签名" />
        <el-table-column v-if="columns.visible('toUsername')" prop="toUsername" label="关注对象名称" />
        <el-table-column v-if="columns.visible('toSign')" prop="toSign" label="关注对象签名" />
        <el-table-column v-if="columns.visible('toAvatar')" prop="toAvatar" label="关注对象头像" />
        <el-table-column v-if="columns.visible('focusEachOther')" prop="focusEachOther" label="是否互相关注" />
        <el-table-column v-if="columns.visible('focusDate')" prop="focusDate" label="关注时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.focusDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','focusInfo:edit','focusInfo:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
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
import crudFocusInfo from '@/api/focusInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '粉丝关注', url: 'api/focusInfo', sort: 'id,desc', crudMethod: { ...crudFocusInfo }})
const defaultForm = { id: null, fromUserId: null, fromAvatar: null, fromUsername: null, fromSign: null, toUserId: null, toUsername: null, toSign: null, toAvatar: null, focusEachOther: null, focusDate: null }
export default {
  name: 'FocusInfo',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'focusInfo:add'],
        edit: ['admin', 'focusInfo:edit'],
        del: ['admin', 'focusInfo:del']
      },
      rules: {
        focusDate: [
          { required: true, message: '关注时间不能为空', trigger: 'blur' }
        ]
      }}
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
