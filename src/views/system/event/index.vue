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
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" />
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('matchName')" prop="matchName" label="参与赛事名称" />
        <el-table-column v-if="columns.visible('groupName')" prop="groupName" label="团队名称" />
        <el-table-column v-if="columns.visible('content')" prop="content" label="内容" />
        <el-table-column v-if="columns.visible('photos')" prop="photos" label="图片">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="getFirstPhoto(baseApi, scope.row.photos)"
              :preview-src-list="getAllPhotos(baseApi, scope.row.photos)"
            >
              <div slot="error">
                <i class="el-icon-document">
                  无图片
                </i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('username')" prop="username" label="发布人昵称" />
        <el-table-column v-if="columns.visible('meters')" prop="meters" label="米数" />
        <el-table-column v-if="columns.visible('city')" prop="city" label="所在城市" />
        <el-table-column v-if="columns.visible('likeCount')" prop="likeCount" label="点赞数量" />
        <el-table-column v-if="columns.visible('createDate')" prop="createDate" label="发布时间">
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
import crudEvent from '@/api/event'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { mapGetters } from 'vuex'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '朋友圈', url: 'api/event', sort: 'id,desc', crudMethod: { ...crudEvent }})
const defaultForm = { id: null, content: null, userId: null, matchId: null, username: null, matchName: null, meters: null, province: null, city: null, county: null, address: null, latitude: null, longitude: null, photos: null, likeCount: null, createDate: null }
export default {
  name: 'Event',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        del: ['admin', 'event:del']
      },
      rules: {
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '发布人不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '发布人昵称不能为空', trigger: 'blur' }
        ],
        likeCount: [
          { required: true, message: '点赞数量不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'content', display_name: '内容' },
        { key: 'username', display_name: '发布人昵称' },
        { key: 'matchName', display_name: '赛事名称' }
      ]
    }
  },
  computed: {
    ...mapGetters(['baseApi'])
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: true,
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
    },
    getAllPhotos(baseApi, data) {
      var result = []
      var photos = data.split(',')
      for (var index in photos) {
        result.push(baseApi + '/' + photos[index])
      }
      return result
    },
    getFirstPhoto(baseApi, data) {
      var photos = data.split(',')
      for (var index in photos) {
        return baseApi + '/' + photos[index]
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
