<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select
          v-model="query.type"
          clearable
          size="small"
          placeholder="跳转类型"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in dict.banner_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.bannerPosition"
          clearable
          size="small"
          placeholder="Banner位置"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in dict.banner_position"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建时间"
          end-placeholder=""
        />
        <el-date-picker
          v-model="query.updateTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="修改时间"
          end-placeholder=""
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="图片" prop="image">
            <el-upload
              drag
              :action="uplaodUrl"
              :data="uploadExtData"
              :headers="uploadHeaders"
              list-type="picture"
              :file-list="bannerList"
              :auto-upload="false"
              :on-remove="handleBannerRemove"
              :on-change="changeUpload"
              :multiple="false"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="Banner位置" prop="bannerPosition">
            <el-select v-model="form.bannerPosition" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.banner_position"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="跳转类型" prop="targetType">
            <el-select v-model="form.targetType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.banner_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="跳转目标">
            <el-input v-if="form.targetType != 'news'" v-model="form.targetValue" :readonly="form.targetType === 'none'" style="width: 370px;" />
            <el-select
              v-else
              v-model="form.targetValue"
              filterable
              remote
              reserve-keyword
              placeholder="请输入文章标题"
              :remote-method="doSearchNews"
              :loading="loadingNews"
            >
              <el-option
                v-for="item in newsList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="ID" />
        <el-table-column v-if="columns.visible('image')" prop="image" label="图片">
          <template slot-scope="scope">
            <div class="banner-img" @click="previewImage(scope.row.image)">
              <img v-if="scope.row.image" :src="scope.row.image" alt="banner">
              <span v-else>暂无图片</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('bannerPosition')" prop="bannerPosition" label="Banner位置">
          <template slot-scope="scope">
            {{ dict.label.banner_position[scope.row.bannerPosition] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('targetType')" prop="targetType" label="跳转类型">
          <template slot-scope="scope">
            {{ dict.label.banner_type[scope.row.targetType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('targetValue')" prop="targetValue" label="跳转目标" />
        <el-table-column v-if="columns.visible('title')" prop="title" label="标题" />
        <el-table-column v-if="columns.visible('sort')" prop="sort" label="排序" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','appBanner:edit','appBanner:del']" label="操作" width="150px" align="center">
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
    <el-dialog :visible.sync="previewImgVisible">
      <div class="preview-image-container">
        <div>
          <img width="100%" :src="previewImgUrl" alt="">
        </div>
      </div>
    </el-dialog>
    <el-dialog title="图片剪裁" :visible.sync="cropperDialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <!-- @realTime="realTime" -->
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :center-box="option.centerBox"
            :info-true="option.infoTrue"
            :fixed-box="option.fixedBox"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropperDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="uploading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudAppBanner from '@/api/appBanner'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'
import { searchTop } from '@/api/appNews'
// import { compress } from '@/utils/image'
import { upload } from '@/utils/upload'
// crud交由presenter持有
const defaultCrud = CRUD({ title: 'AppBanner', url: 'api/appBanner', sort: 'id,desc', crudMethod: { ...crudAppBanner }})
const defaultForm = { id: null, image: null, bannerPosition: null, targetType: null, targetValue: null, title: null, sort: null, publishUser: null, createTime: null, updateUser: null, updateTime: null }
export default {
  name: 'AppBanner',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['banner_type', 'banner_position'],
  data() {
    return {
      uplaodUrl: `${process.env.VUE_APP_BASE_API}/api/localStorage`,
      uploadExtData: {
        name: 'file.png'
      },
      uploadHeaders: {
        Authorization: getToken()
      },
      previewImgVisible: false,
      previewImgUrl: '',

      selectNewsVisble: false,
      newsList: [],
      loadingNews: false,

      bannerList: [],
      permission: {
        add: ['admin', 'appBanner:add'],
        edit: ['admin', 'appBanner:edit'],
        del: ['admin', 'appBanner:del']
      },
      rules: {
        image: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ],
        bannerPosition: [
          { required: true, message: 'Banner位置不能为空', trigger: 'blur' }
        ],
        targetType: [
          { required: true, message: '跳转类型不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'targetType', display_name: '跳转类型' }
      ],

      cropperDialogVisible: false,
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [25, 14], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      uploading: false
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
    [CRUD.HOOK.afterToEdit]() {
      this.bannerList = [
        {
          url: this.form.image,
          name: 'banner.png'
        }
      ]
    },
    handleBannerRemove() {
      this.bannerList = []
      this.form.image = ''
    },
    handleBannerSuccess(response, file, fileList) {
      this.form.image = `${process.env.VUE_APP_BASE_API}/${response.relativePath}`
      this.bannerList = [
        {
          url: this.form.image,
          name: 'banner.png'
        }
      ]
    },
    previewImage(imageUrl) {
      this.previewImgUrl = imageUrl
      this.previewImgVisible = true
    },
    changeUpload(file, fileList) {
      this.option.img = URL.createObjectURL(file.raw)
      this.cropperDialogVisible = true
    },
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        this.uploading = true
        upload(`${this.uplaodUrl}?storeCdn=true`, data).then(res => {
          this.uploading = false
          this.form.image = `${res.data.fullPath}`
          this.bannerList = [
            {
              url: this.form.image,
              name: 'banner.png'
            }
          ]
          this.cropperDialogVisible = false
        })
      })
    },
    async doSearchNews(query) {
      const { content } = await searchTop(query)
      this.newsList = content || []
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-img {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: auto;
  }
}
.preview-image-container {
  width: 100%;
  max-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  >div {
    width: 500px;
    img {
      width: 100%;
      height: auto;
    }
  }
}
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 600px;
  }
}
</style>
