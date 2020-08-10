<template>
  <div class="member-form">
    <div class="member-form-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col>
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

        <h3>个人信息</h3>
        <!--
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="address"
              label="详细地址"
              :rules="[
                { required: true, message: '请填写详细地址', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.address" placeholder="请填写详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="airQualityReportImg"
              label="空气质量报告"
              :rules="[
                { required: true, message: '请填写空气质量报告', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.airQualityReportImg" placeholder="请填写空气质量报告" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <!--
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="applyDate"
              label="申请时间"
              :rules="[
                { required: true, message: '请选择申请时间', trigger: 'blur' }
              ]"
            >
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                placeholder="请选择训练结束时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="applyDate"
              label="申请年度"
              :rules="[
                { required: true, message: '请填写申请年度', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.applyDate" placeholder="请填写申请年度" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <!--
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="businessLicense"
              label="营业执照"
              :rules="[
                { required: true, message: '请上传营业执照', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.businessLicense" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="city"
              label="市"
              :rules="[
                { required: true, message: '请填写所在市', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.city" placeholder="请填写所在市" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="name"
              label="请填写场馆名称"
              :rules="[
                { required: true, message: '请填写场馆名称', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.name" placeholder="请填写场馆名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="county"
              label="省市区"
              :rules="[
                { message: '请选择省市区', trigger: 'blur' }
              ]"
            >
              <el-select
                v-model="form.province"
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
              <el-select v-model="form.city" filterable placeholder="请选择" @change="selectCity2">
                <el-option v-for="item in cityOptions2" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="form.county" filterable placeholder="请选择">
                <el-option v-for="item in countyOptions2" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="address"
              label="请填写详细地址"
              :rules="[
                { message: '请填写详细地址', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.address" placeholder="请填写详细地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="longitude"
              label="精度"
              :rules="[
                { message: '请填写精度', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.longitude" placeholder="请填写精度" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="latitude"
              label="纬度"
              :rules="[
                { message: '请填写纬度', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.latitude" placeholder="请填写纬度" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="company"
              label="经营公司"
              :rules="[
                { message: '请输入经营公司', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.company" placeholder="请输入经营公司" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="businessLicense"
              label="营业执照"
              :rules="[
                { required: true, message: '请上传营业执照', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.businessLicense" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="legalPersonName"
              label="法人姓名"
              :rules="[
                { message: '请填写法人姓名', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.legalPersonName" placeholder="请填写法人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="legalPersonIdCard"
              label="法人身份证号"
              :rules="[
                { message: '请填写法人身份证号', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.legalPersonIdCard" placeholder="请填写法人身份证号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item
              prop="organizationCode"
              label="组织机构代码"
              :rules="[
                { message: '请填写组织机构代码', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.organizationCode" placeholder="请填写组织机构代码" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="contactPhone"
              label="请填写场馆联系电话"
              :rules="[
                { message: '请填写场馆联系电话', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.contactPhone" placeholder="请填写场馆联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="waterQualityReportImg"
              label="水质报告图片"
              :rules="[
                { message: '请上传水质报告图片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.waterQualityReportImg" :multiple="true" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="airQualityReportImg"
              label="空气报告图片"
              :rules="[
                { message: '请上传空气报告图片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.airQualityReportImg" :multiple="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              prop="venuesType"
              label="场馆类型"
              :rules="[
                { message: '请填写场馆类型', trigger: 'blur' }
              ]"
            >
              <el-select v-model="form.venuesType" placeholder="请填写场馆类型">
                <el-option
                  v-for="(item, index) in venuesType"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="venuesSize"
              label="请填写场馆大小"
              :rules="[
                { message: '请填写场馆大小', trigger: 'blur' }
              ]"
            >
              <el-select v-model="form.venuesSize" placeholder="请填写场馆大小">
                <el-option
                  v-for="(item, index) in venuesSize"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item
              prop="venuesPhotos"
              label="场馆照片"
              :rules="[
                { required: true, message: '请上传场馆照片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.venuesPhotos" :multiple="true" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item
              prop="highRiskCertificate"
              label="请上传高危证照片"
              :rules="[
                { message: '请上传高危证照片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.highRiskCertificate" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="heathCertificate"
              label="请上传卫生证照片"
              :rules="[
                { message: '请上传卫生证照片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.heathCertificate" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 救生员 -->
        <div class="second-form-legend">
          <span class="title">添加救生员</span>
          <el-button icon="el-icon-plus" circle size="small" @click="addLifeGuards" />
        </div>
        <div v-for="(v, i) in form.lifeguards" :key="i+Math.random()" class="workexp-line">
          <el-form ref="tab" :model="v" label-width="120px" :disabled="action === 'examine'">
            <el-row>
              <el-col :span="23">
                <!-- 表单内容 -->
                <el-row :gutter="20">
                  <el-col :span="10">
                    <el-form-item
                      prop="name"
                      label="救生员名字"
                      :rules="[
                        { message: '请填写救生员名字', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="v.name" placeholder="请填写救生员名字" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      prop="lifeCertificateNumber"
                      label="救生证编号(必填)"
                      :rules="[
                        { message: '请填写救生证编号', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="v.lifeCertificateNumber" placeholder="请填写救生证编号" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="10">
                    <el-form-item
                      prop="lifeCertificateImage"
                      label="救生证上传"
                      :rules="[
                        { message: '请上传救生证', trigger: 'blur' }
                      ]"
                    >
                      <Uploader v-model="v.lifeCertificateImage" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      prop="photo"
                      label="救生员照片"
                      :rules="[
                        { message: '请上传救生员照片', trigger: 'blur' }
                      ]"
                    >
                      <Uploader v-model="v.photo" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <!-- 减去历任教练员 -->
              <el-col :span="1">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeLifeGuards(i)"
                />
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 师资 -->
        <div class="second-form-legend">
          <span class="title">添加师资</span>
          <el-button icon="el-icon-plus" circle size="small" @click="addTeachers" />
        </div>
        <div v-for="(v, i) in form.teachers" :key="i+Math.random()" class="workexp-line">
          <el-form ref="tab" :model="v" label-width="120px" :disabled="action === 'examine'">
            <el-row>
              <el-col :span="23">
                <!-- 表单内容 -->
                <el-row :gutter="20">
                  <el-col :span="10">
                    <el-form-item
                      prop="name"
                      label="名字"
                      :rules="[
                        { message: '请填写名字', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="v.name" placeholder="请填写名字" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      prop="certificateNumber"
                      label="资格证编号(必填)"
                      :rules="[
                        { message: '请填写资格证编号', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="v.certificateNumber" placeholder="请填写资格证编号" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="10">
                    <el-form-item
                      prop="certificateImage"
                      label="资格证上传"
                      :rules="[
                        { message: '请上传资格证上传', trigger: 'blur' }
                      ]"
                    >
                      <Uploader v-model="v.certificateImage" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      prop="photo"
                      label="照片"
                    >
                      <Uploader v-model="v.photo" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <!-- 减去师资 -->
              <el-col :span="1">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeTeachers(i)"
                />
              </el-col>
            </el-row>
          </el-form>
        </div>

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
        <el-col :span="10">
          <el-form :model="form" size="mini">
            <el-form-item prop="rejectReason" label="审核未通过原因">
              <el-input v-model="form.rejectReason" placeholder="请输入审核未通过原因" />
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </div>
    <div style="height:60px;" />
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
import Uploader from '@/views/components/Uploader.vue'
import registerApi from '@/api/register'
import appUserApi from '@/api/appUser'
import { getAutoExpiredTime } from '@/utils'

const { mapState } = createNamespacedHelpers('options')
const mapState2 = createNamespacedHelpers('area').mapState
export default {
  components: {
    Uploader
  },
  data() {
    return {
      venuesSize: [
        '长50米。8条泳道及以上',
        '长25米，6条泳道及以下',
        '长25米，5条泳道及以下'
      ],
      venuesType: ['室内', '室外'],
      action: 'examine',
      projectTabIndex: 0,
      historyCoachesIndex: 0,
      nowCoachesIndex: 0,
      // 状态： 0-未注册 1-未支付 2-注册中 3-已注册 4-已过期 5-已退款
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
      relationship: ['父亲', '母亲', '亲属', '朋友', '其他'],
      provinceLevel: ['AAAA', 'AAA', 'AA', 'A', 'BB', 'B'],
      form: {
        registerType: '',
        lifeguards: [],
        teachers: [{}],
        applyYear: '2020',
        userInfo: {
          sex: '男',
          birthday: '',
          englishName: ''
        }
      },
      userList: [],
      cityOptions: [],
      countyOptions: []
    }
  },
  beforeMount() {
    this.action = this.$route.query.action
    this.form.registerType = this.$route.query.registerType

    if (this.action !== 'insert') {
      registerApi
        .getInfoByID(this.form.registerType, this.$route.query.id)
        .then(res => {
          // 回显数据
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
  computed: {
    ...mapState2(['province_list', 'city_list', 'county_list']),
    ...mapState([
      'eduBackgrounds',
      'applyProjectNames',
      'refereeLevels',
      'refereeJobs',
      'athleteNationalLevels',
      'guidanceLevel',
      'nations'
    ])
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
    selectCity(value) {
      delete this.form.userInfo.county
      this.countyOptions = []
      let targetCode = ''
      for (const k in this.city_list) {
        if (this.city_list[k] === value) {
          targetCode = k.substr(0, 4)
        }
      }
      console.log(targetCode)
      const options = []
      for (const k in this.county_list) {
        if (k.substr(0, 4) === targetCode) {
          options.push(this.county_list[k])
        }
      }
      console.log(options)
      this.countyOptions = options
    },

    selectProvince2(value) {
      delete this.form.city
      delete this.form.county
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
    selectCity2(value) {
      delete this.form.county
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
    // handleProjectTabsEdit(targetName, action) {
    //   if (action === "add") {
    //     this.form.projects.push({});
    //   }
    //   if (action === "remove") {
    //     this.form.projects.splice(targetName, 1);
    //   }
    // },
    addLifeGuards() {
      this.form.lifeguards.push({})
    },
    removeLifeGuards(i) {
      this.form.lifeguards.splice(i, 1)
    },
    // addWorkExp() {
    //   const projectItem = this.form.projects[this.projectTabIndex];
    //   projectItem.nowCoaches.push({});
    // },
    // addWorkExpAther() {
    //   const projectItem = this.form.projects[this.projectTabIndex];
    //   projectItem.historyCoaches.push({});
    // },
    addTeachers() {
      this.form.teachers.push({})
    },
    removeTeachers(i) {
      this.form.teachers.splice(i, 1)
    },
    // removeWorkExp(workExpIndex) {
    //   const projectIndex = this.projectTabIndex;
    //   const projectItem = this.form.projects[projectIndex];
    //   projectItem.historyCoaches.splice(workExpIndex, 1);
    //   this.form.projects.splice(projectIndex, 1, { ...projectItem });
    // },
    // removeWorkExpAther(workExpIndex) {
    //   const projectIndex = this.projectTabIndex;
    //   const projectItem = this.form.projects[projectIndex];
    //   projectItem.nowCoaches.splice(workExpIndex, 1);
    //   this.form.projects.splice(projectIndex, 1, { ...projectItem });
    // },
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
    async submitForm(action, tag) {
      if (this.form.vipNumber && this.form.vipNumber.substr(0, 4) !== 'SSA5') {
        this.form.vipNumber = 'SSA5' + this.form.vipNumber
      }
      if (action === 'insert') {
        this.form.id = '' // ID为空为添加
        this.form.applyYear = new Date().getFullYear() //	申请年度
        this.form.applyDate = this.getNowTime() // 申请时间
        this.form.orderNo = '' // 订单号  后端生成

        const tabs = this.$refs.tab
        const forms = this.$refs.form
        await this.formValidate(forms)

        // if (this.form.length <= 0) {
        //   this.$message({
        //     message: '至少添加一项项目',
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
            this.$router.go(-1)
            this.$message({
              message: '保存成功',
              type: 'success',
              onClose: () => {
                this.$store.dispatch('tagsView/delView', this.$route)
              }
            })
          })
      } else if (action === 'update') {
        const tabs = this.$refs.tab
        const forms = this.$refs.form
        await this.formValidate(forms)
        // if (this.form.projects.length <= 0) {
        //   this.$message({
        //     message: '至少添加一项项目',
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
            this.$router.go(-1)
            this.$message({
              message: '修改成功',
              type: 'success',
              onClose: () => {
                this.$store.dispatch('tagsView/delView', this.$route)
              }
            })
          })
      } else {
        // 审核
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
        console.log(data)
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
    getNowTime() {
      var time = new Date()
      return (
        time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
      )
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
