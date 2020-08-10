<template>
  <div class="query-result-detail">
    <div class="user-panel">
      <h3>用户信息</h3>
      <div class="cell-info">
        姓名：{{ formData.userInfo.chineseName }}
      </div>
      <div class="cell-info">
        性别：{{ formData.userInfo.sex }}
      </div>
      <div class="cell-info">
        民族：{{ formData.userInfo.nation }}
      </div>
      <div class="cell-info">
        身份证号：{{ formData.userInfo.idCard }}
      </div>
      <div class="cell-info">
        出生日期：{{ formData.userInfo.birthday }}
      </div>
      <div class="cell-info">
        居住地址：{{ formData.userInfo.province }}{{ formData.userInfo.city }}{{ formData.userInfo.county }}{{ formData.userInfo.address }}
      </div>
      <div class="cell-info">
        户籍地址：{{ formData.userInfo.nativeProvince }}{{ formData.userInfo.nativeCity }}{{ formData.userInfo.nativeCounty }}{{ formData.userInfo.nativeAddress }}
      </div>
    </div>
    <h3>申请信息</h3>
    <div class="cell-info">
      申请类型：{{ typeName }}
    </div>
    <div v-if="formData.vipNumber" class="cell-info">会员编号：<span style="font-weight: bold;">{{ formData.vipNumber }}</span></div>
    <div v-for="(cellItem, index) in cells" :key="index">
      <div v-if="cellItem.type === 'text'" class="cell-info">
        {{ cellItem.label }}：{{ cellItem.value }}
      </div>
      <div v-if="cellItem.type === 'array'" class="info-panel">
        <el-tabs>
          <el-tab-pane v-for="(childItem, childIndex) in cellItem.items || []" :key="`top_c_${childIndex}`" :label="childItem.title" :name="`top_c_${childIndex}`">
            <div
              v-for="(ccItem, ccIndex) in childItem.cells"
              :key="ccIndex"
            >
              <div v-if="ccItem.type === 'array'" class="cell-info">
                <el-tabs>
                  <el-tab-pane v-for="(cccItem, cccIndex) in ccItem.items || []" :key="`ccc_${cccIndex}`" :label="cccItem.title" :name="`top_cc_${childIndex}`">
                    <div v-for="(cccItemCell, cccellIndex) in cccItem.cells" :key="`cc_cell_${cccellIndex}`">
                      <div v-if="cccItemCell.type === 'image'">
                        <div class="cell-img">
                          {{ cccItemCell.label }}：<el-image style="width: 100px; height: 100px" :src="cccItemCell.value" :preview-src-list="[cccItemCell.value]" />
                        </div>
                      </div>
                      <div v-else class="cell-info">
                        {{ cccItemCell.label }}：{{ cccItemCell.value || '--' }}
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div v-else-if="ccItem.type === 'image'">
                <div v-if="Array.isArray(ccItem.value)" class="cell-img">
                  {{ ccItem.label }}：<el-image v-for="(ccImg, ccImgIndex) in ccItem.value" :key="ccImgIndex" style="width: 100px; height: 100px; margin-right: 10px;" :src="ccImg" :preview-src-list="ccItem.value" />
                </div>
                <div v-else class="cell-img">
                  {{ ccItem.label }}：<el-image style="width: 100px; height: 100px" :src="ccItem.value" :preview-src-list="[ccItem.value]" />
                </div>
              </div>
              <div v-else class="cell-info">
                {{ ccItem.label }}：{{ ccItem.value || '--' }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="cellItem.type === 'image'">
        <div v-if="Array.isArray(cellItem.value)" class="cell-img">
          {{ cellItem.label }}：<el-image v-for="(ccImg, ccImgIndex) in cellItem.value" :key="ccImgIndex" style="width: 100px; height: 100px; margin-right: 10px;" :src="ccImg" :preview-src-list="cellItem.value" />
        </div>
        <div v-else class="cell-img">
          {{ cellItem.label }}：<el-image style="width: 100px; height: 100px" :src="cellItem.value" :preview-src-list="[cellItem.value]" />
        </div>
      </div>
    </div>
    <div v-if="formData.certificateImage" class="cell-img">
      会员证书：<el-image style="width: 100px; height: 100px" :src="formData.certificateImage" :preview-src-list="[formData.certificateImage]" />
    </div>
    <div v-if="formData.status === 2" class="action-bar">
      <el-row>
        <div style="text-align:left;margin-bottom: 10px;">
          <el-input
            v-model.trim="vipNumber"
            placeholder="会员编号（不填写自动生成）"
            style="width:280px;"
          />
          <!-- <span>
            <el-button size="small" type="primary" round @click="generateVipNo">生成</el-button>
          </span> -->
        </div>
        <div style="text-align:left;margin-bottom: 10px;">
          <el-date-picker
            v-model="certificateExpireTime"
            type="date"
            placeholder="证书过期时间（审核通过必选）"
            style="width:280px;"
          />
        </div>
        <el-input
          v-model="rejectReason"
          type="textarea"
          :rows="2"
          placeholder="请输入审核不通过原因（审核不通过必填）"
        />
      </el-row>
      <el-row style="margin-top: 15px;">
        <el-button type="primary" :disabled="!certificateExpireTime" @click="reviewDetail(true)">审核通过</el-button>
        <el-button :disabled="!rejectReason" type="danger" @click="reviewDetail(false)">审核不通过</el-button>
      </el-row>
    </div>
    <el-dialog :visible.sync="previewImgVisible">
      <div class="preview-image-container">
        <div>
          <img width="100%" :src="previewImgUrl" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { detail, review, generateVipNumber } from '@/api/register'
export default {
  name: 'MemeberDetail',
  props: {
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    typeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      previewImgVisible: false,
      previewImgUrl: '',
      fieldLabelMap: {
        instructor: {
          lifeCertificateNumber: '救生证编号',
          lifeCertificateImage: '救生证',
          certifiedImage: '指导员资格证',
          coachGrade: '教练员运动等级',
          projects: {
            _name: '项目',
            name: '项目名称',
            certifiedNumber: '指导证书编号',
            level: '职业资格',
            teachingExps: {
              _name: '执教经历',
              startDate: '执教开始时间',
              endDate: '执教结束时间',
              expDescription: '经历及主要成绩',
              remark: '备注'
            }
          },
          company: '现工作单位',
          partTimeCompany: '兼职工作单位',
          school: '毕业院校',
          major: '所属专业',
          record: '最高学历',
          // email: '邮箱',
          photo: '个人照片(2寸免冠证件照)'
        },
        referee: {
          school: '毕业院校',
          major: '所属专业',
          record: '最高学历',
          foreignLevel: '外语水平',
          company: '现工作单位',
          title: '职务及职称',
          // email: '邮箱',
          projects: {
            _name: '项目',
            name: '项目名称',
            workExps: {
              _name: '工作履历',
              gameDate: '比赛时间',
              gameTitle: '比赛名称',
              workPosition: '执裁位置'
            },
            certifiedTime: '颁证时间',
            level: '裁判等级',
            refereeCertificateImage: '裁判证',
            workJobs: '裁判岗位',
            otherWorkJob: '其他裁判岗位'
          },
          photo: '个人照片(2寸免冠证件照)'
        },
        coach: {
          // email: '邮箱',
          certifiedTime: '救生资格证颁证时间',
          certifiedNumber: '救生资格证编号',
          company: '现⼯作单位',
          'companyProvince,companyCity,companyCounty,companyAddress': '现工作单位地址',
          partTimeCompany: '兼职工作单位',
          school: '毕业院校',
          major: '所属专业',
          record: '最高学历',
          projects: {
            _name: '项目',
            certificateNumber: '教练员资格证编号',
            certificateImage: '教练证',
            level: '教练等级',
            coachExps: {
              _name: '执教经历',
              startDate: '执教开始时间',
              endDate: '执教结束时间',
              expDescription: '经历及主要成绩',
              remark: '备注'
            }
          },
          coachGrade: '教练员运动等级',
          photo: '个人照片(2寸免冠证件照)'
        },
        lifeguard: {
          regCertifiedNumber: '注册证编号',
          regCertifiedImage: '注册证',
          regCertifiedTime: '注册证颁证时间',
          level: '注册证等级',
          company: '现工作单位',
          record: '最高学历',
          // email: '邮箱',
          workExps: {
            _name: '工作经历',
            startDate: '开始时间',
            endDate: '结束时间',
            expDescription: '经历及主要成绩',
            remark: '备注'
          },
          certifiedTime: '资格证颁证时间',
          certifiedNumber: '资格证编号',
          zgCertifiedImage: '资格证',
          'examProvince,examCity,examCounty,examAddress': '资格证考证地点',
          photo: '个人照片(2寸免冠证件照)'
        },
        teenagers: {
          height: '身高',
          weight: '体重',
          age: '年龄',
          projects: {
            _name: '项目',
            club: '所在俱乐部',
            level: '运动员国家等级',
            certificateLevel: '运动员国家等级证书',
            provinceLevel: '运动员省内等级',
            nowCoaches: {
              _name: '现任教练员',
              name: '教练员名字',
              club: '所在俱乐部',
              startDate: '执教开始日期',
              endDate: '执教结束日期'
            },
            historyCoaches: {
              _name: '历任教练员',
              name: '教练员名字',
              club: '所在俱乐部',
              startDate: '执教开始日期',
              endDate: '执教结束日期'
            }
          },
          school: '所在学校',
          grade: '年级',
          clazz: '班级',
          schoolRoll: '学籍号',
          contact: '联系人电话',
          relationship: '联系人与运动员关系',
          photo: '照片'
        },
        adult: {
          height: '身高',
          weight: '体重(支持小数点后一位)',
          age: '年龄',
          projects: {
            _name: '项目',
            club: '所在俱乐部',
            exerciseVenues: '常锻炼场馆',
            level: '运动员国家等级'
          },
          photo: '个人照片(2寸免冠证件照)'
        },
        venues: {
          name: '场馆名称',
          'province,city,county,address': '场馆地址',
          latitude: '场馆坐标经度',
          longitude: '场馆坐标纬度',
          company: '经营公司',
          businessLicense: '营业执照',
          legalPersonName: '法人姓名',
          legalPersonIdCard: '法人身份证',
          organizationCode: '组织机构代码',
          contactPhone: '场馆联系电话',
          venuesType: '场馆类型',
          venuesSize: '场馆大小',
          lifeCertificateNumber: '救生证编号',
          lifeCertificateImage: '救生证',
          lifeguards: {
            _name: '救生员',
            name: '救生员姓名',
            photo: '救生员照片(2寸免冠证件照)'
          },
          venuesPhotos: '场馆照片',
          highRiskCertificate: '高危证照片',
          heathCertificate: '卫生证照片',
          teachers: {
            _name: '师资',
            name: '姓名',
            certificateNumber: '资格证编号',
            certificateImage: '资格证',
            photo: '照片(2寸免冠证件照)'
          }
        },
        club: {
          name: '俱乐部名称',
          businessLicense: '营业执照',
          legalPersonName: '法人姓名',
          legalPersonIdCard: '法人身份证',
          organizationCode: '组织机构代码',
          contactPhone: '联系电话',
          'province,city,county,address': '地址',
          trainingVenues: '场馆',
          clubCoaches: {
            _name: '教练员',
            name: '姓名',
            certificateNumber: '教练资格证编号',
            certificateImage: '教练资格证照片',
            photo: '个人照片(2寸免冠照片)'
          },
          photo: '俱乐部照片'
        },
        equipment: {
          name: '装备单位名称',
          businessLicense: '营业执照',
          intro: '单位简介',
          mainProduct: '主营商品',
          contactPhone: '联系电话',
          photos: '单位照片',
          productPhotos: '商品照片',
          equipmentCoaches: {
            _name: '教练员',
            name: '姓名',
            certificateNumber: '教练资格证编号',
            certificateImage: '教练资格证照片',
            photo: '个人照片(2寸免冠照片)'
          }
        }
      },
      formData: {
        userInfo: {}
      },
      cells: [],
      certificateExpireTime: '',
      rejectReason: '',
      vipNumber: ''
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.formData = await detail({
        id: this.id,
        registerType: this.type
      })
      const fieldConfig = this.fieldLabelMap[this.type]
      const keys = Object.keys(fieldConfig)
      const cells = []
      keys.map(key => {
        cells.push(this.getCellValue(key, this.formData[key], fieldConfig))
      })
      this.cells = cells
      if (this.formData.certificateImage) {
        this.formData.certificateImage = `${process.env.VUE_APP_BASE_API}/${this.formData.certificateImage}`
      }
    },
    getCellValue(key, value, fieldConfig) {
      // 特殊处理
      if (this.type === 'instructor' && key === 'endDate' && !value) {
        return {
          type: 'text',
          label: fieldConfig[key].name || fieldConfig[key],
          value: '至今'
        }
      }
      if (typeof value !== 'object') {
        let type = 'text'
        if (value && /\d+\.(png|jpg|jpeg|webp)$/i.test(value)) {
          const prefix = `${process.env.VUE_APP_BASE_API}`
          value = `${prefix}/${value}`
          type = 'image'
        }
        return {
          type,
          label: fieldConfig[key].name || fieldConfig[key],
          value: value || ''
        }
      }
      if (Array.isArray(value)) {
        let aType = 'text'
        if (value.length > 0 && typeof value[0] !== 'object') {
          value = value.map(s => {
            if (s && /\d+\.(png|jpg|jpeg|webp)$/.test(s)) {
              const prefix = `${process.env.VUE_APP_BASE_API}`
              s = `${prefix}/${s}`
              aType = 'image'
            }
            return s
          })
          return {
            type: aType,
            label: fieldConfig[key]._name || fieldConfig[key],
            value: aType === 'image' ? value : value.join('')
          }
        } else {
          const childKeys = Object.keys(fieldConfig[key]).filter(ck => ck !== '_name')
          const newValue = []
          for (let index = 0; index < value.length; index++) {
            const childValue = value[index]
            const childCells = []
            childKeys.map(childKey => {
              childCells.push(this.getCellValue(childKey, childValue[childKey], fieldConfig[key]))
            })
            newValue.push({
              title: `${fieldConfig[key]._name || fieldConfig[key]}-${index + 1}`,
              cells: childCells
            })
          }
          return {
            type: 'array',
            label: fieldConfig[key]._name || fieldConfig[key],
            items: newValue
          }
        }
      } else {
        return {
          type: 'text',
          label: fieldConfig[key]._name || fieldConfig[key],
          value
        }
      }
    },
    previewImage(src) {
      this.previewImgVisible = true
      this.previewImgUrl = src
    },
    async reviewDetail(passed) {
      // if (passed && !this.vipNumber) {
      //   this.$message.error('请填写会员编码!')
      //   return
      // }
      await review({
        id: this.id,
        certificateExpireTime: this.certificateExpireTime,
        registerType: this.type,
        rejectReason: this.rejectReason,
        result: passed,
        vipNumber: (this.vipNumber || '').toUpperCase()
      })
      this.$message('审批完成！')
      this.$emit('statusChange')
    },
    async generateVipNo() {
      const { no } = await generateVipNumber(this.type)
      this.vipNumber = no
    }
  }
}
</script>

<style lang="scss" scoped>

.query-result-detail {
  padding: 15px;
  box-sizing: border-box;
  background: #fff;
  h3 {
    margin: 5px 0;
    padding: 0;
  }
}
.image-cell-value {
  display: inline-block;
}
.cell-img {
  width: 40vw;
  height: auto;
  img {
    width: 100%;
    height: auto;
  }
}
.info-panel {
  margin-bottom: 20px;
  background: #fff;
}
.cell-info {
  margin: 6px 0;
  font-size: 16px;
}
.action-bar {
  width: 100%;
  text-align: center;
  margin-top: 15px;
}
</style>
