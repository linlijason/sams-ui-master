<template>
  <div class="uploader">
    <el-upload
      action="#"
      :auto-upload="false"
      list-type="picture-card"
      :file-list="fileList"
      :on-change="changeUpload"
      :on-remove="handleRemove"
    >
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in" />
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
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
        <el-button @click="closeCropper">取 消</el-button>
        <el-button type="primary" :loading="uploading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { compress } from '@/utils/image'
import { upload } from '@/utils/upload'

export default {
  name: 'Uploader',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      default: () => ''
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      uplaodUrl: `${process.env.VUE_APP_BASE_API}/api/localStorage`,
      uploadExtData: {
        name: 'file.png'
      },
      uploadHeaders: {
        Authorization: getToken()
      },
      fileList: [],
      cropperDialogVisible: false,
      option: {
        filename: '',
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        outputType: 'jpeg',
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
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
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if ((newVal || []).length <= 0) {
          this.fileList = []
          return
        }
        if (this.multiple) {
          if (typeof newVal === 'string' && newVal) {
            newVal = [newVal]
          }
          this.fileList = (newVal || []).map((file, index) => ({
            originUrl: file,
            url: `${process.env.VUE_APP_BASE_API}/${file}`,
            name: `file${index + 1}.jpg`
          }))
        } else {
          this.fileList = [
            {
              originUrl: newVal,
              url: `${process.env.VUE_APP_BASE_API}/${newVal}`,
              name: `file.jpg`
            }
          ]
        }
      }
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      if (this.multiple) {
        const newVals = [...this.value]
        const index = newVals.findIndex(s => s === file.originUrl)
        if (index > -1) {
          newVals.splice(index, 1)
        }
        this.$emit('change', newVals)
      } else {
        this.$emit('change', '')
      }
    },
    handleSuccess(response, file, fileList) {
      const image = `${process.env.VUE_APP_BASE_API}/${response.relativePath}`
      const newFile = {
        originUrl: response.relativePath,
        url: image,
        name: file.name || 'file.jpg'
      }
      if (!this.multiple) {
        this.$emit('change', newFile.originUrl)
      } else {
        if (fileList.every(v => v.status === 'success')) {
          const newFiles = fileList.map(f => {
            if (f.originUrl) {
              return f.originUrl
            }
            if (f.response && f.response.relativePath) {
              return f.response.relativePath
            }
            return null
          }).filter(f => !!f)
          this.$emit(
            'change',
            newFiles
          )
        }
      }
    },
    previewImage(imageUrl) {
      this.previewImgUrl = imageUrl
      this.previewImgVisible = true
    },
    changeUpload(file) {
      this.option.filename = file.name
      this.option.outputType = file.raw.type.split('/')[1]
      this.option.img = URL.createObjectURL(file.raw)
      this.cropperDialogVisible = true
      return false
    },
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        this.uploading = true
        upload(this.uplaodUrl, data).then(res => {
          this.uploading = false
          const image = `${process.env.VUE_APP_BASE_API}/${res.data.relativePath}`
          if (this.multiple) {
            const newFiles = [...this.value, res.data.relativePath]
            this.$emit('change', newFiles)
          } else {
            this.fileList = [
              {
                originUrl: res.data.relativePath,
                url: image,
                name: 'banner.png'
              }
            ]
            this.$emit('change', res.data.relativePath)
          }

          this.cropperDialogVisible = false
        })
      })
    },
    closeCropper() {
      if (this.multiple && this.fileList.length > 0 && !this.value) {
        this.fileList = []
      } else {
        this.$emit('change', [...(this.value || [])])
      }
      this.cropperDialogVisible = false
    },
    async compressImage(file) {
      return await compress(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.uploader {
  >>> .el-upload--picture-card {
    width: auto;
    height: auto;
    background: none;
    border: none;
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
