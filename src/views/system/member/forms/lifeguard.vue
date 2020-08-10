<template>
  <div class="member-form">
    <div class="member-form-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <!-- 基础表单start -->
        <h3>基础信息</h3>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="userInfo.id"
              label="绑定app会员"
              :rules="[
                { required: true, message: '请选择app会员', trigger: 'blur' }
              ]"
            >
              <el-select
                v-model="form.userInfo.id"
                filterable
                remote
                :remote-method="inputUserPhone"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.phone"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="userInfo.phone"
              label="手机号"
              :rules="[
                { required: true, max: 11, message: '请输入手机号', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.userInfo.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="userInfo.chineseName"
              label="中文姓名"
              :rules="[
                { required: true, message: '请输入中文姓名', trigger: 'blur' }
              ]"
            >
              <el-input
                v-model="form.userInfo.chineseName"
                placeholder="请输入中文姓名"
                @blur="changeChineseName"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="userInfo.englishName"
              label="英文姓名"
              :rules="[
                { required: true, message: '请输入英文姓名', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.userInfo.englishName" placeholder="请输入英文姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="userInfo.sex"
              label="性别"
              :rules="[
                { required: true, message: '请选择性别', trigger: 'blur' }
              ]"
            >
              <el-radio v-model="form.userInfo.sex" label="男">男</el-radio>
              <el-radio v-model="form.userInfo.sex" label="女">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="userInfo.idCard"
              label="身份证"
              :rules="[
                { required: true, pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '请输入合法的身份证号', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.userInfo.idCard" placeholder="请输入身份证号" @blur="changeIdCard" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="userInfo.birthday"
              label="出生日期"
              :rules="[
                { required: true, message: '请选择出生日期', trigger: 'blur' }
              ]"
            >
              <el-date-picker
                v-model="form.userInfo.birthday"
                type="date"
                placeholder="请选择出生日期"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="userInfo.nation"
              label="民族"
              :rules="[
                { required: true, message: '请选择民族', trigger: 'blur' }
              ]"
            >
              <el-select v-model="form.userInfo.nation" filterable placeholder="请选择">
                <el-option
                  v-for="(item, index) in nations"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="userInfo.county"
              label="省市区"
              :rules="[
                { required: true, message: '请选择省市区', trigger: 'blur' }
              ]"
            >
              <el-select
                v-model="form.userInfo.province"
                filterable
                placeholder="请选择"
                @change="selectProvince"
              >
                <el-option
                  v-for="(value, key) in province_list"
                  :key="key"
                  :label="value"
                  :value="value"
                />
              </el-select>
              <el-select
                v-model="form.userInfo.city"
                filterable
                placeholder="请选择"
                @change="selectCity"
              >
                <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="form.userInfo.county" filterable placeholder="请选择">
                <el-option v-for="item in countyOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="userInfo.address"
              label="详细地址"
              :rules="[
                { required: true, message: '请输入详细地址', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.userInfo.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="applyYear"
              label="申请年度"
              :rules="[
                { required: true, message: '请输入申请年度', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.applyYear" placeholder="请输入申请年度" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 基础表单end -->
        <h3 v-if="action === 'insert' || action === 'update'">会员信息</h3>
        <el-row v-if="action === 'insert' || action === 'update'" :gutter="20">
          <el-col :span="10">
            <el-form-item prop="vipNumber" label="会员编号">
              <el-input
                v-model="form.vipNumber"
                placeholder="请填写会员编号(不填写系统自动生成)"
                :disabled="(action === 'insert' || action === 'update') && form.status !== 3"
              />
              <!-- <el-input v-if="action === 'update'" v-model="form.vipNumber" disabled /> -->
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="status"
              label="会员状态"
              :rules="[
                { required: true, message: '请选择会员状态', trigger: 'blur' }
              ]"
            >
              <el-select v-model="form.status" placeholder="请选择会员状态" @change="onAdultStatusChange">
                <el-option v-for="(v,k) in membeStatus" :key="k" :label="v.name" :value="v.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="action === 'insert' || action === 'update'" :gutter="20">
          <el-col v-if="action === 'update'" :span="10">
            <el-form-item prop="certificateImage" label="会员证书">
              <Uploader v-model="form.certificateImage" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="certificateExpireTime" label="会员证书过期时间">
              <el-date-picker
                v-if="action === 'examine'"
                v-model="form.certificateExpireTime"
                type="date"
                placeholder="请选择会员证书过期时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :rules="[
                  { required: true, message: '请选择会员证书过期时间', trigger: 'blur' }
                ]"
              />
              <el-date-picker
                v-if="action !== 'examine'"
                v-model="form.certificateExpireTime"
                type="date"
                placeholder="请选择会员证书过期时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :disabled="form.status !== 3 "
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 个人信息 -->
        <h3>个人信息</h3>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="regCertifiedNumber"
              label="注册证编号"
              :rules="[
                { required: true, message: '请输入注册证编号', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.regCertifiedNumber" placeholder="请输入注册证编号" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="regCertifiedTime"
              label="注册证颁证时间"
              :rules="[
                { message: '请选择注册证颁证时间', trigger: 'blur' }
              ]"
            >
              <el-date-picker
                v-model="form.regCertifiedTime"
                type="date"
                placeholder="请选择注册证颁证时间"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="level"
              label="资格证等级"
              :rules="[
                { message: '请选择资格证等级', trigger: 'blur' }
              ]"
            >
              <el-select v-model="form.level" placeholder="请选择资格证等级">
                <el-option
                  v-for="(item, index) in registerCertLevel"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="company"
              label="现工作单位"
              :rules="[
                { message: '请输入现工作单位', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.company" placeholder="请输入现工作单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="record"
              label="最高学历"
              :rules="[
                { message: '请选择最高学历', trigger: 'blur' }
              ]"
            >
              <el-select v-model="form.record" placeholder="请选择最高学历">
                <el-option
                  v-for="(item, index) in eduBackgrounds"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="certifiedTime"
              label="资格证颁证时间"
              :rules="[
                { message: '请上传单位照片', trigger: 'blur' }
              ]"
            >
              <el-date-picker
                v-model="form.certifiedTime"
                type="date"
                placeholder="请选择比赛时间"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="certifiedNumber"
              label="资格证编号"
              :rules="[
                { required: true, message: '请输入资格证编号', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.certifiedNumber" placeholder="请输入资格证编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="examCounty"
              label="省市区"
              :rules="[
                { message: '请选择省市区', trigger: 'blur' }
              ]"
            >
              <el-select
                v-model="form.examProvince"
                filterable
                placeholder="请选择"
                @change="selectProvince2"
              >
                <el-option
                  v-for="(value, key) in province_list"
                  :key="key"
                  :label="value"
                  :value="value"
                />
              </el-select>
              <el-select v-model="form.examCity" filterable placeholder="请选择" @change="selectCity2">
                <el-option v-for="item in cityOptions2" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="form.examCounty" filterable placeholder="请选择">
                <el-option v-for="item in countyOptions2" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="examAddress"
              label="详细地址"
              :rules="[
                { message: '请输入详细地址', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.examAddress" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="regCertifiedImage"
              label="注册证图片"
              :rules="[
                { required: true, message: '请上传注册证图片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.regCertifiedImage" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="zgCertifiedImage"
              label="资格证图片"
              :rules="[
                { required: true, message: '请上传资格证图片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.zgCertifiedImage" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="photo"
              label="个人照片"
              :rules="[
                { required: true, message: '请上传个人照片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.photo" />
            </el-form-item>
          </el-col>
        </el-row>
        <h3>工作经历</h3>
        <el-tabs
          v-model="projectTabIndex"
          type="card"
          :editable="action !== 'examine'"
          @edit="handleProjectTabsEdit"
        >
          <el-tab-pane
            v-for="(tab, pindex) in form.workExps"
            :key="pindex"
            :label="tab.name || `工作经历${pindex + 1}`"
            :name="`${pindex}`"
          >
            <el-form ref="tab" :model="tab" label-width="120px" :disabled="action === 'examine'">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    prop="startDate"
                    label="开始时间"
                    :rules="[
                      { message: '请选择开始时间', trigger: 'blur' }
                    ]"
                  >
                    <el-date-picker
                      v-model="tab.startDate"
                      type="date"
                      placeholder="请选择开始时间"
                      value-format="yyyy-MM-dd"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="endDate" label="结束时间">
                    <el-radio v-model="tab.endDate1" label="1">至今</el-radio>
                    <el-radio v-model="tab.endDate1" label="2">选择时间</el-radio>
                    <el-date-picker
                      v-if="tab.endDate1 === '2'"
                      v-model="tab.endDate"
                      type="date"
                      placeholder="请选择执教结束时间"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    prop="expDescription"
                    label="经历及主要成绩"
                    :rules="[
                      { message: '请输入经历及主要成绩', trigger: 'blur' }
                    ]"
                  >
                    <el-input
                      v-model="tab.expDescription"
                      type="textarea"
                      placeholder="请输入经历及主要成绩"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    prop="remark"
                    label="备注"
                    :rules="[
                      { message: '请输入备注', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model="tab.remark" type="textarea" placeholder="请输入备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <h3 v-if="action === 'examine'">会员信息</h3>
        <el-row v-if="action === 'examine'" :gutter="20">
          <el-col :span="10">
            <el-form-item prop="vipNumber" label="会员编号">
              <el-input
                v-model="form.vipNumber"
                placeholder="请填写会员编号(不填写系统自动生成)"
                :disabled="(action === 'insert' || action === 'update') && form.status !== 3"
              />
              <!-- <el-input v-if="action === 'update'" v-model="form.vipNumber" disabled /> -->
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="status"
              label="会员状态"
              :rules="[
                { required: true, message: '请选择会员状态', trigger: 'blur' }
              ]"
            >
              <el-select v-model="form.status" placeholder="请选择会员状态" @change="onAdultStatusChange">
                <el-option v-for="(v,k) in membeStatus" :key="k" :label="v.name" :value="v.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="action === 'examine'" :gutter="20">
          <el-col v-if="action === 'update'" :span="10">
            <el-form-item prop="certificateImage" label="会员证书">
              <Uploader v-model="form.certificateImage" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="certificateExpireTime" label="会员证书过期时间">
              <el-date-picker
                v-if="action === 'examine'"
                v-model="form.certificateExpireTime"
                type="date"
                placeholder="请选择会员证书过期时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :rules="[
                  { required: true, message: '请选择会员证书过期时间', trigger: 'blur' }
                ]"
              />
              <el-date-picker
                v-if="action !== 'examine'"
                v-model="form.certificateExpireTime"
                type="date"
                placeholder="请选择会员证书过期时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :disabled="form.status !== 3 "
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="action === 'examine'">
        <h3>其他</h3>
        <el-col :span="24">
          <span>未通过原因:</span>
          <el-input v-model="form.rejectReason" placeholder="请输入审核未通过原因" style="width: auto" />
        </el-col>
      </div>
    </div>
    <footer />
    <div class="fixed-bottom-bar">
      <el-button
        v-if="action === 'update'"
        style="width: 140px;"
        type="primary"
        @click="submitForm(action)"
      >修改</el-button>
      <el-button
        v-if="action === 'insert'"
        style="width: 140px;"
        type="primary"
        @click="submitForm(action)"
      >添加</el-button>
      <el-button
        v-if="action === 'examine'"
        style="width: 140px;"
        type="primary"
        @click="submitForm(action,1)"
      >通过</el-button>
      <el-button
        v-if="action === 'examine'"
        style="width: 140px;"
        type="danger"
        @click="submitForm(action,2)"
      >拒绝</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { getAutoExpiredTime } from '@/utils'
import Uploader from '@/views/components/Uploader.vue'
const { mapState } = createNamespacedHelpers('options')
const mapState2 = createNamespacedHelpers('area').mapState
import registerApi from '@/api/register'
import appUserApi from '@/api/appUser'

export default {
  components: {
    Uploader
  },
  data() {
    return {
      action: 'insert',
      userList: [],
      projectTabIndex: '0',
      membeStatus: [
        {
          value: 0,
          name: '未注册'
        },
        {
          value: 1,
          name: '未支付'
        },
        {
          value: 2,
          name: '注册中'
        },
        {
          value: 3,
          name: '已注册'
        },
        {
          value: 4,
          name: '已过期'
        },
        {
          value: 5,
          name: '已退款'
        }
      ],
      form: {
        workExps: [],
        applyYear: '2020',
        userInfo: {
          sex: '男',
          englishName: '',
          birthday: ''
        }
      },
      cityOptions: [],
      countyOptions: [],
      cityOptions2: [],
      countyOptions2: []
    }
  },
  computed: {
    ...mapState2(['province_list', 'city_list', 'county_list']),
    ...mapState([
      'eduBackgrounds',
      'applyProjectNames',
      'refereeLevels',
      'refereeJobs',
      'registerCertLevel',
      'nations'
    ])
  },
  beforeMount() {
    this.action = this.$route.query.action || this.action
    this.form.registerType = this.$route.query.registerType

    if (this.action !== 'insert') {
      registerApi
        .getInfoByID(this.form.registerType, this.$route.query.id)
        .then(res => {
          this.form = res.result
          appUserApi
            .get({
              id: this.form.userInfo.id,
              size: 10,
              page: 0
            })
            .then(res => {
              this.userList = res.content
            })
        })
    }
  },
  methods: {
    inputUserPhone(e) {
      appUserApi
        .get({
          phone: e,
          size: 10,
          page: 0
        })
        .then(res => {
          this.userList = res.content
        })
    },
    // 身份证改变获取出生日期
    changeIdCard(e) {
      const birthday = e.target.value.substr(6, 8)
      this.form.userInfo.birthday =
        birthday.substr(0, 4) +
        '-' +
        birthday.substr(4, 2) +
        '-' +
        birthday.substr(6, 2)
    },
    // 中文名改变获取英文名
    changeChineseName(e) {
      registerApi.chineseName2Pinyin(e.target.value).then(res => {
        this.form.userInfo.englishName = res
      })
    },
    changeChineseName2(e) {
      registerApi.chineseName2Pinyin(e.target.value).then(res => {
        this.form.userInfo.englishName = res
      })
    },
    // 选择省，改变市选项
    selectProvince(value) {
      delete this.form.userInfo.city
      delete this.form.userInfo.county
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
    selectProvince2(value) {
      delete this.form.examCity
      delete this.form.examCounty
      this.cityOptions2 = []
      this.countyOptions2 = []
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
      this.cityOptions2 = options
    },
    // 选择市改变区选项
    selectCity(value) {
      delete this.form.userInfo.county
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
    },
    selectCity2(value) {
      delete this.form.examCounty
      this.countyOptions2 = []
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
      this.countyOptions2 = options
    },
    handleProjectTabsEdit(targetName, action) {
      if (action === 'add') {
        const forms = this.$refs
        // let targetForm = null;
        // if (forms && !forms.length) {
        //   targetForm = forms;
        // } else {
        //   targetForm = forms[this.projectTabIndex];
        // }

        // console.log(forms, targetForm, this.projectTabIndex, targetName);
        // if (!targetForm || targetForm.validate) {
        //   this.form.workExps.push({});
        //   this.projectTabIndex === '0' ? (this.projectTabIndex += 1) + '' : false;
        //   return;
        // }
        // this.formValidate(targetForm).then(res => {
        //   if (res) return this.form.workExps.push({});
        //   this.$message.error("请完善当前教练员信息");
        // });
        console.log(forms)
        this.form.workExps.push({})
      }
      if (action === 'remove') {
        this.form.workExps.splice(targetName, 1)
      }
    },
    // 验证方法
    formValidate(form) {
      return new Promise((resolve, reject) => {
        form.validate(valid => {
          if (valid) {
            resolve(true)
          } else {
            reject(false)
            return false
          }
        })
      })
    },
    // 提交表单
    async submitForm(action, tag) {
      if (this.form.vipNumber && this.form.vipNumber.substr(0, 3) !== 'SSA') {
        const tagN = this.form.userInfo.sex === '男' ? '1' : '2'
        this.form.vipNumber = 'SSA' + tagN + this.form.vipNumber
      }
      if (action === 'insert' || action === 'update') {
        const tabs = this.$refs.tab
        const forms = this.$refs.form
        await this.formValidate(forms)
        // if (this.form.workExps.length <= 0) {
        //   this.$message({
        //     message: '至少添加一项工作经历',
        //     type: 'error'
        //   })
        //   return
        // }
        for (let index = 0; index < (tabs || []).length; index++) {
          const form = tabs[index]
          await this.formValidate(form)
        }
        registerApi
          .saveMember(this.form.registerType, {
            ...this.form
          })
          .then(res => {
            const tig = action === 'insert' ? '新增' : '修改'
            this.$router.go(-1)
            this.$message({
              message: tig + '成功',
              type: 'success',
              onClose: () => {
                this.$store.dispatch('tagsView/delView', this.$route)
              }
            })
          })
      } else {
        const data = {}
        data.certificateExpireTime = this.form.certificateExpireTime
        data.id = this.form.id
        data.registerType = this.form.registerType
        data.result = tag === 1
        data.vipNumber = this.form.vipNumber
        data.rejectReason = this.form.rejectReason
        if (!data.result && !data.rejectReason) {
          this.$message({
            message: '审核未通过必需填写未通过原因',
            type: 'error'
          })
          return
        }
        if (data.result && !this.form.certificateExpireTime) {
          this.$message({
            message: '审核通过必需选择证书过期时间',
            type: 'error'
          })
          return
        }
        registerApi
          .review({
            ...data
          })
          .then(res => {
            this.$router.go(-1)
            this.$message({
              message: '操作成功',
              type: 'success',
              onClose: () => {
                this.$store.dispatch('tagsView/delView', this.$route)
              }
            })
          })
      }
    },
    onAdultStatusChange() {
      if (this.form.status === 3) {
        this.form.certificateExpireTime = this.form.certificateExpireTime || getAutoExpiredTime()
      } else {
        this.form.certificateExpireTime = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.member-form {
  width: 100%;
  display: flex;
  padding-bottom: 60px;
  padding-top: 100px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  &-content {
    width: 1000px;
  }
  h3 {
    font-size: 16px;
  }
  h4 {
    font-size: 14px;
  }
  .second-form-legend {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
  }
  footer {
    height: 60px;
  }
  .fixed-bottom-bar {
    position: fixed;
    left: 0;
    bottom: 32px;
    width: 100%;
    height: 60px;
    padding: 0 30px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px #e7e7e7 solid;
  }
}
</style>
