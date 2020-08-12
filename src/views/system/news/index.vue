<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.title"
          clearable
          placeholder="标题"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select
          v-model="query.type"
          clearable
          size="small"
          placeholder="文章类型"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in dict.news_type"
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
          end-placeholder
        />
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
        width="800px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.news_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="列表图片" prop="image">
            <!-- <el-input v-model="form.image" style="width: 370px;" /> -->
            <!-- list-type="picture"
            :file-list="imageList"
            :before-upload="compressImage"
            :on-remove="handleImageRemove"
            :on-success="handleImageSuccess" -->
            <el-upload
              drag
              :action="uploadUrl"
              :data="uploadExtData"
              :headers="uploadHeaders"
              :auto-upload="false"
              list-type="picture"
              :file-list="imageList"
              :on-change="changeUpload"
              :multiple="false"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="外部链接" prop="url">
            <el-input v-model.trim="form.url" placeholder="填写外部链接可不用填写新闻内容" style="width: 500px;" />
          </el-form-item>
          <el-form-item label="新闻内容" prop="content">
            <!-- <el-input v-model="form.content" :rows="3" type="textarea" style="width: 370px;" /> -->
            <div ref="editor" style="text-align:left" />
            <vue-ueditor-wrap v-model="form.content" :config="myConfig" />
          </el-form-item>
          <el-form-item label="排序值">
            <el-input v-model="form.sort" placeholder="数值越大越靠前,可不填" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('title')" prop="title" label="标题">
          <template slot-scope="scope">
            <span v-if="scope.row.url">
              <a :href="scope.row.url" type="_blank">{{ scope.row.title }}</a>
            </span>
            <span v-else>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('image')" prop="image" label="列表图片">
          <template slot-scope="scope">
            <div class="banner-img" @click="previewImage(scope.row.image)">
              <img v-if="scope.row.image" :src="scope.row.image" alt="banner">
              <span v-else>暂无图片</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('sort')" prop="sort" label="排序值" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('type')" prop="type" label="类型">
          <template slot-scope="scope">{{ dict.label.news_type[scope.row.type] }}</template>
        </el-table-column>
        <el-table-column
          v-permission="['admin','appNews:edit','appNews:del']"
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
    <el-dialog :visible.sync="previewImgVisible">
      <div class="preview-image-container">
        <div>
          <img width="100%" :src="previewImgUrl" alt>
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
            :max-img-size="option.maxImgSize"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropperDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="uploading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
    <div id="preview-box">
      <div id="preview-content">
        <iframe id="preview" src="/preview.html" />
      </div>
    </div>
  </div>
</template>

<script>
import crudAppNews from '@/api/appNews'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'
import { compress } from '@/utils/image'
import { mapGetters } from 'vuex'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { upload } from '@/utils/upload'

// crud交由presenter持有
const defaultCrud = CRUD({
  title: '新闻文章',
  url: 'api/appNews',
  sort: 'id,desc',
  crudMethod: { ...crudAppNews }
})
const defaultForm = {
  id: null,
  title: null,
  image: null,
  content: null,
  sort: null,
  publishUser: null,
  createTime: null,
  updateUser: null,
  updateTime: null,
  type: null
}
export default {
  name: 'AppNews',
  components: {
    pagination,
    crudOperation,
    rrOperation,
    udOperation,
    VueUeditorWrap
  },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['news_type'],
  data() {
    return {
      contents: '',
      myConfig: {
        autoHeightEnabled: false, // 编辑器不自动被内容撑高

        initialFrameHeight: 240, // 初始容器高度

        initialFrameWidth: '100%', // 初始容器宽度

        // serverUrl: "http://35.201.165.105:8000/controller.php", // 上传文件接口

        UEDITOR_HOME_URL: '/UEditor/', // UEditor 资源文件的存放路径
        serverUrl: `${process.env.VUE_APP_BASE_API}/ueditor.do`,
        allowLinkProtocols: [
          'http:',
          'https:',
          '#',
          '/',
          'ftp:',
          'mailto:',
          'tel:',
          'git:',
          'svn:'
        ]
      },
      uploadUrl: `${process.env.VUE_APP_BASE_API}/api/localStorage`,
      permission: {
        add: ['admin', 'appNews:add'],
        edit: ['admin', 'appNews:edit'],
        del: ['admin', 'appNews:del']
      },
      uploadExtData: {
        name: 'file.png'
      },
      uploadHeaders: {
        Authorization: getToken()
      },
      imageList: [],

      previewImgVisible: false,
      previewImgUrl: '',

      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        image: [
          { required: true, message: '列表图片不能为空', trigger: 'blur' }
        ],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
      },
      queryTypeOptions: [{ key: 'title', display_name: '标题' }],

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
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        maxImgSize: 1024
      },
      uploading: false
    }
  },
  computed: {
    ...mapGetters(['fileUploadApi'])
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
      this.imageList = [
        {
          url: this.form.image,
          name: 'news.png'
        }
      ]
      return true
    },

    handleImageRemove() {
      this.imageList = []
      this.form.image = ''
    },
    async compressImage(file) {
      return await compress(file)
    },
    changeUpload(file, fileList) {
      // function createObjectURL(blob){
      //   if (window.URL) {
      //     return window.URL.createObjectURL(blob)
      //   } else if (window.webkitURL) {
      //     return window.webkitURL.createObjectURL(blob)
      //   } else {
      //     return null
      //   }
      // }
      // this.option.img = createObjectURL(file)
      // this.cropperDialogVisible = true
      this.option.img = URL.createObjectURL(file.raw)
      this.cropperDialogVisible = true
    },
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        this.uploading = true
        upload(`${this.uploadUrl}?storeCdn=true`, data).then(res => {
          this.uploading = false
          this.form.image = `${res.data.fullPath}`
          this.imageList = [
            {
              url: this.form.image,
              name: 'news.png'
            }
          ]
          this.cropperDialogVisible = false
        })
      })
    },
    handleImageSuccess(response, file, fileList) {
      this.form.image = `${process.env.VUE_APP_BASE_API}/${response.relativePath}`
      this.imageList = [
        {
          url: this.form.image,
          name: 'news.png'
        }
      ]
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
  > div {
    width: 500px;
    img {
      width: 100%;
      height: auto;
    }
  }
}
#preview-box {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(33, 33, 33, 0.6);
  z-index: 4000;
}
#preview-content {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px 20px;
  width: 415px;
  height: 840px;
  overflow: hidden;
  background: #eee;
  border-radius: 10px;
}
#preview {
  width: 100%;
  height: 100%;
  border: 1px solid #333;
  border-radius: 8px;
}
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 600px;
  }
}
</style>
