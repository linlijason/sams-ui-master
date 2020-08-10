<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.value"
          clearable
          placeholder="输入搜索内容"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select
          v-model="query.status"
          clearable
          size="small"
          placeholder="申请状态"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in dict.register_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.registerType"
          size="small"
          placeholder="申请类型"
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
          end-placeholder
        />
        <el-select
          v-model="query.province"
          filterable
          placeholder="请选择省"
          @change="selectProvince"
        >
          <el-option
            v-for="(value, key) in province_list"
            :key="key"
            :label="value"
            :value="value"
          />
        </el-select>
        <el-select v-model="query.city" filterable placeholder="请选择市" @change="selectCity">
          <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="query.county" filterable placeholder="请选择区">
          <el-option v-for="item in countyOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-date-picker
          v-model="query.refundDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="退款时间"
          end-placeholder
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
          end-placeholder
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template slot="left">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="transfer(query.registerType,'insert')"
          >添加</el-button>
        </template>
      </crudOperation>
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" />
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="编号" />
        <el-table-column v-if="columns.visible('chineseName')" prop="chineseName" label="姓名" />
        <el-table-column v-if="columns.visible('vipNumber')" prop="vipNumber" label="会员编号">
          <template slot-scope="scope">
            <span
              class="link-prop"
              @click="previewImage(scope.row.certificateImage)"
            >{{ scope.row.vipNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('idCard')" prop="idCard" label="身份证号" />
        <el-table-column v-if="columns.visible('province')" prop="province" label="省市区">
          <template slot-scope="scope">
            <span>{{ scope.row.province }}-{{ scope.row.city }}-{{ scope.row.county }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('phone')" prop="phone" label="手机号" />
        <el-table-column v-if="columns.visible('sex')" prop="sex" label="性别" />
        <el-table-column v-if="columns.visible('registerType')" prop="registerType" label="申请类型">
          <template slot-scope="scope">{{ dict.label.register_type[scope.row.registerType] }}</template>
        </el-table-column>
        <!-- <el-table-column v-if="columns.visible('payType')" prop="payType" label="支付方式">
          <template slot-scope="scope">
            {{ dict.label.pay_type[scope.row.payType] }}
          </template>
        </el-table-column>-->
        <el-table-column v-if="columns.visible('status')" prop="status" label="申请状态">
          <template slot-scope="scope">{{ dict.label.register_status[scope.row.status] }}</template>
        </el-table-column>
        <!-- <el-table-column v-if="columns.visible('payDate')" prop="payDate" label="支付时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.payDate) }}</span>
          </template>
        </el-table-column>-->
        <el-table-column v-if="columns.visible('applyDate')" prop="applyDate" label="申请时间" />
        <el-table-column
          v-permission="['admin','member:view']"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="top">
              <el-button size="mini" icon="el-icon-link" @click="toDetail(scope.row)" />
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button size="mini" icon="el-icon-edit" @click="transfer(scope.row,'update')" />
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="审核" placement="top">
              <el-button
                v-if="scope.row.status === 2"
                size="mini"
                icon="el-icon-s-check"
                @click="transfer(scope.row,'examine')"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
    <el-dialog top="5vh" width="90%" :visible.sync="showDetail">
      <MemberDetail
        v-if="showDetail"
        :id="detailInfo.id"
        :type="detailInfo.registerType"
        :type-name="dict.label.register_type[detailInfo.registerType]"
        @statusChange="statusChange"
      />
    </el-dialog>
    <el-dialog :visible.sync="previewImgVisible">
      <div class="preview-image-container">
        <div>
          <img width="400px" :src="previewImgUrl" alt>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudRegister from '@/api/register'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import MemberDetail from './detail'
import { createNamespacedHelpers } from 'vuex'
const mapState = createNamespacedHelpers('area').mapState
// crud交由presenter持有
const defaultCrud = CRUD({
  title: '会员',
  url: 'api/register/review/list',
  query: { registerType: 'instructor' },
  sort: 'createDate,desc',
  crudMethod: { ...crudRegister }
})
const defaultForm = {
  id: null,
  title: null,
  relationId: null,
  registerType: 'instructor',
  status: null,
  thirdOrderNo: null,
  thirdCallback: null,
  payDate: null,
  refundDate: null,
  refundReason: null,
  createDate: null
}
export default {
  name: 'MemberList',
  components: { pagination, crudOperation, rrOperation, MemberDetail },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['register_type', 'register_status', 'pay_type'],
  data() {
    return {
      showDetail: false,
      previewImgVisible: false,
      previewImgUrl: '',
      detailInfo: {
        id: '',
        registerType: ''
      },
      permission: {
        view: ['admin', 'member:view']
      },
      rules: {
        id: [{ required: true, message: '订单编号不能为空', trigger: 'blur' }]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '订单编号' },
        { key: 'username', display_name: '用户' },
        { key: 'thirdOrderNo', display_name: '第三方订单号' }
      ],
      cityOptions: [],
      countyOptions: []
    }
  },
  computed: {
    ...mapState(['province_list', 'city_list', 'county_list'])
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: false
    }
    if (!this.query.registerType) {
      this.query.registerType = 'instructor'
      this.statusChange()
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
    },
    toDetail(row) {
      this.detailInfo = row
      this.showDetail = true
    },
    transfer(row, action) {
      // TODO  新增必须要把类型传过来  但是新增没有  row属性
      if (action === 'insert') {
        this.$router.push({
          path: `/member/edit/` + row,
          query: { id: '', action: action, registerType: row }
        })
      } else {
        this.$router.push({
          path: `/member/edit/${row.registerType}`,
          query: { id: row.id, action: action, registerType: row.registerType }
        })
      }
      this.$store.dispatch('tagsView/addView', this.$route)
    },
    previewImage(src) {
      this.previewImgVisible = true
      if (!/^(http|https)\:.*/.test(src)) {
        src = `${process.env.VUE_APP_BASE_API}/${src}`
      }
      this.previewImgUrl = src
    },
    statusChange() {
      this.showDetail = false
      this.crud.refresh()
    },
    // 选择省，改变市选项
    selectProvince(value) {
      this.cityOptions = []
      this.countyOptions = []
      let targetCode = ''
      for (const k in this.province_list) {
        if (this.province_list[k] === value) {
          targetCode = k.substr(0, 2)
        }
      }
      const options = []
      for (const k in this.city_list) {
        if (k.substr(0, 2) === targetCode) {
          options.push(this.city_list[k])
        }
      }
      this.cityOptions = options
    },
    // 选择市改变区选项
    selectCity(value) {
      this.countyOptions = []
      let targetCode = ''
      for (const k in this.city_list) {
        if (this.city_list[k] === value) {
          targetCode = k.substr(0, 4)
        }
      }
      const options = []
      for (const k in this.county_list) {
        if (k.substr(0, 4) === targetCode) {
          options.push(this.county_list[k])
        }
      }
      this.countyOptions = options
    }
  }
}
</script>

<style scoped>
.link-prop {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.preview-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
