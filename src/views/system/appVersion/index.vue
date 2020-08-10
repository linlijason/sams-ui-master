<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="版本号">
            <el-input v-model="form.version" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="系统类型">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.client_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="更新地址">
            <el-input v-model="form.url" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否强制">
            <el-input v-model="form.forceUpdate" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('version')" prop="version" label="版本号" />
        <el-table-column v-if="columns.visible('type')" prop="type" label="系统类型">
          <template slot-scope="scope">
            {{ dict.label.client_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('url')" prop="url" label="更新地址" />
        <el-table-column v-if="columns.visible('forceUpdate')" prop="forceUpdate" label="是否强制" />
        <el-table-column v-if="columns.visible('createDate')" prop="createDate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','appVersion:edit','appVersion:del']" label="操作" width="150px" align="center">
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
import crudAppVersion from '@/api/appVersion'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'APP版本', url: 'api/appVersion', sort: 'id,desc', crudMethod: { ...crudAppVersion }})
const defaultForm = { id: null, version: null, type: null, url: null, forceUpdate: null, createDate: null }
export default {
  name: 'AppVersion',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['client_type'],
  data() {
    return {
      permission: {
        add: ['admin', 'appVersion:add'],
        edit: ['admin', 'appVersion:edit'],
        del: ['admin', 'appVersion:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'version', display_name: '版本号' },
        { key: 'type', display_name: '系统类型' }
      ]
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
