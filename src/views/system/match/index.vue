<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-if="query.type !== 'city'"
          v-model="query.value"
          clearable
          placeholder="输入搜索内容"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select
          v-if="query.type === 'city'"
          v-model="query.value"
          clearable
          filterable
          placeholder="请选择"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in dict.cities"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.type"
          clearable
          placeholder="类型"
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in queryTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="赛事名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="项目标签" prop="label">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>
          <el-form-item
            prop="avatar"
            label="赛事列表图片"
            :rules="[
              { required: true, message: '请上传赛事列表图片', trigger: 'blur' }
            ]"
          >
            <Uploader v-model="form.avatar" />
          </el-form-item>
          <el-form-item label="主办单位" prop="company">
            <el-input v-model="form.company" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="datetime"
              style="width: 370px;"
              :picker-options="startTime"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="datetime"
              style="width: 370px;"
              :picker-options="endTime"
            />
          </el-form-item>
          <el-form-item label="报名开始时间" prop="applyStartDate">
            <el-date-picker
              v-model="form.applyStartDate"
              type="datetime"
              style="width: 370px;"
              :picker-options="signUpStart"
            />
          </el-form-item>
          <el-form-item label="报名结束时间" prop="applyEndDate">
            <el-date-picker
              v-model="form.applyEndDate"
              type="datetime"
              style="width: 370px;"
              :picker-options="signUpEnd"
            />
          </el-form-item>
          <el-form-item
            prop="photo"
            label="赛事封面"
            :rules="[
              { required: true, message: '请上传赛事封面图片', trigger: 'blur' }
            ]"
          >
            <Uploader v-model="form.photo" />
          </el-form-item>
          <el-form-item label="举办城市" prop="city">
            <el-select v-model="form.city" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.cities"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序值(数值越大显示越靠前)" prop="sort">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否banner" prop="banner">
            <el-radio v-model="form.banner" label="true">是</el-radio>
            <el-radio v-model="form.banner" label="false">否</el-radio>
          </el-form-item>
          <el-form-item
            prop="bannerImage"
            label="banner图片"
            :rules="[
              { required: true, message: '请上传banner图片', trigger: 'blur' }
            ]"
          >
            <Uploader v-model="form.bannerImage" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="赛事名称" />
        <el-table-column v-if="columns.visible('label')" prop="label" label="项目标签" />
        <el-table-column v-if="columns.visible('avatar')" prop="avatar" label="赛事列表图片">
          <template slot-scope="{row}">
            <el-image
              style="width: 100px;"
              :src="baseApi + '/' + row.avatar"
              :preview-src-list="[baseApi + '/' + row.avatar]"
            >
              <div slot="error">
                <i class="el-icon-document" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('company')" prop="company" label="主办单位" />
        <el-table-column v-if="columns.visible('city')" prop="city" label="举办城市">
          <template slot-scope="scope">{{ dict.label.cities[scope.row.city] }}</template>
        </el-table-column>
        <el-table-column
          v-if="columns.visible('applyStartDate')"
          prop="applyStartDate"
          label="报名开始时间"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.applyStartDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('applyEndDate')" prop="applyEndDate" label="报名结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.applyEndDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('startDate')" prop="startDate" label="开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('endDate')" prop="endDate" label="结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('sort')" prop="sort" label="排序值" />
        <el-table-column prop="banner" label="是否banner">
          <template slot-scope="scope">
            <span>{{ scope.row.banner?"是":"否" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-permission="['admin','match:edit','match:del']"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudMatch from '@/api/match'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import { mapGetters } from 'vuex'
import pagination from '@crud/Pagination'
import Uploader from '@/views/components/Uploader.vue'
// crud交由presenter持有
const defaultCrud = CRUD({
  title: '赛事',
  url: 'api/match',
  sort: 'id,desc',
  crudMethod: { ...crudMatch }
})
const defaultForm = {
  id: null,
  name: null,
  label: null,
  avatar: null,
  company: null,
  startDate: null,
  endDate: null,
  applyStartDate: null,
  applyEndDate: null,
  photo: null,
  city: null
}
export default {
  name: 'Match',
  components: { pagination, crudOperation, rrOperation, udOperation, Uploader },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['cities'],
  data() {
    return {
      signUpEnd: {
        disabledDate: time => {
          return new Date(this.form.applyStartDate).getTime() > time.getTime()
        }
      },
      signUpStart: {
        disabledDate: time => {
          if (this.form.applyEndDate === null) {
            return false
          } else {
            return new Date(this.form.applyEndDate).getTime() < time.getTime()
          }
        }
      },
      endTime: {
        disabledDate: time => {
          return new Date(this.form.startDate).getTime() > time.getTime()
        }
      },
      startTime: {
        disabledDate: time => {
          if (this.form.endDate === null) {
            return false
          } else {
            return new Date(this.form.endDate).getTime() < time.getTime()
          }
        }
      },
      permission: {
        add: ['admin', 'match:add'],
        edit: ['admin', 'match:edit'],
        del: ['admin', 'match:del']
      },
      rules: {
        name: [
          { required: true, message: '赛事名称不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '项目标签不能为空', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '赛事列表图片不能为空', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '主办单位不能为空', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ],
        applyStartDate: [
          { required: true, message: '报名开始时间不能为空', trigger: 'blur' }
        ],
        applyEndDate: [
          { required: true, message: '报名结束时间不能为空', trigger: 'blur' }
        ],
        photo: [
          { required: true, message: '赛事封面不能为空', trigger: 'blur' }
        ],
        banner: [
          { required: true, message: '必须选择是否是banner', trigger: 'blur' }
        ],
        city: [{ required: true, message: '举办城市不能为空', trigger: 'blur' }]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '赛事名称' },
        { key: 'label', display_name: '项目标签' },
        { key: 'city', display_name: '举办城市' }
      ]
    }
  },
  computed: {
    ...mapGetters(['baseApi'])
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
