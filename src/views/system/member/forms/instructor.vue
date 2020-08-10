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
              <el-input
                v-model="form.userInfo.englishName"
                placeholder="请输入英文姓名"
              />
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
                {
                  required: true,
                  pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                  message: '请输入合法的身份证号',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                v-model="form.userInfo.idCard"
                placeholder="请输入身份证号"
                @blur="changeIdCard"
              />
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
              <el-select
                v-model="form.userInfo.nation"
                filterable
                placeholder="请选择"
              >
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
                <el-option
                  v-for="item in cityOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-select
                v-model="form.userInfo.county"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in countyOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
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
              <el-input
                v-model="form.userInfo.address"
                placeholder="请输入详细地址"
              />
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
                :disabled="
                  (action === 'insert' || action === 'update') &&
                    form.status !== 3
                "
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
              <el-select
                v-model="form.status"
                placeholder="请选择会员状态"
                @change="onAdultStatusChange"
              >
                <el-option
                  v-for="(v, k) in membeStatus"
                  :key="k"
                  :label="v.name"
                  :value="v.value"
                />
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
                  {
                    required: true,
                    message: '请选择会员证书过期时间',
                    trigger: 'blur'
                  }
                ]"
              />
              <el-date-picker
                v-if="action !== 'examine'"
                v-model="form.certificateExpireTime"
                type="date"
                placeholder="请选择会员证书过期时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :disabled="form.status !== 3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <h3>技能信息</h3>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              prop="certificateName"
              label="证书名字"
              :rules="[
                { required: true, message: '请填写证书名字', trigger: 'blur' }
              ]"
            >
              <el-select
                v-model="form.certificateName"
                placeholder="请选择证书名字"
              >
                <el-option label="教练员证" value="教练员证" />
                <el-option label="社会指导员证" value="社会指导员证" />
                <el-option label="教师资格证" value="教师资格证" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="certifiedNumber"
              label="证书编号"
              :rules="[
                { required: true, message: '请填写证书编号', trigger: 'blur' }
              ]"
            >
              <el-input
                v-model="form.certifiedNumber"
                placeholder="请输入证书编号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item v-if="form.certificateName == '社会指导员证'" prop="level" label="职业资格">
              <el-select v-model="form.level" placeholder="请选择职业资格">
                <el-option
                  v-for="(item, index) in guidanceLevel"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item v-if="form.certificateName == '教练员证'" prop="coachGrade" label="教练员运动等级">
              <el-select
                v-model="form.coachGrade"
                placeholder="请选择教练员运动等级"
              >
                <el-option
                  v-for="(item, index) in athleteNationalLevels"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.certificateName == '教师资格证'" :gutter="20">
          <el-col :span="10">
            <el-form-item prop="coachGrade" label="教练员运动等级">
              <el-select
                v-model="form.coachGrade"
                placeholder="请选择教练员运动等级"
              >
                <el-option
                  v-for="(item, index) in coachLevels"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item prop="lifeCertificateImage" label="救生证上传">
              <Uploader v-model="form.lifeCertificateImage" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              prop="certifiedImage"
              label="资格证上传"
              :rules="[
                {
                  required: true,
                  message: '请上传资格证',
                  trigger: 'blur'
                }
              ]"
            >
              <Uploader v-model="form.certifiedImage" />
            </el-form-item>
          </el-col>
        </el-row>
        <h3>工作信息</h3>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item prop="company" label="现工作单位">
              <el-input v-model="form.company" placeholder="请输入现工作单位" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="partTimeCompany" label="兼职工作单位">
              <el-input
                v-model="form.partTimeCompany"
                placeholder="请输入兼职工作单位"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item prop="school" label="毕业院校">
              <el-input v-model="form.school" placeholder="请输入毕业院校" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="major" label="所属专业">
              <el-input v-model="form.major" placeholder="请输入所属专业" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item prop="record" label="最高学历">
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
              prop="photo"
              label="个人照片（两寸免冠证件照）"
              :rules="[
                { required: true, message: '请上传个人照片', trigger: 'blur' }
              ]"
            >
              <Uploader v-model="form.photo" />
            </el-form-item>
          </el-col>
        </el-row>
        <h3>职教经历</h3>
        <el-tabs
          v-model="vocationTabIndex"
          type="card"
          :editable="action !== 'examine'"
          @edit="handleVocationTabsEdit"
        >
          <el-tab-pane
            v-for="(tab, pindex) in form.teachingExps"
            :key="pindex"
            :label="tab.name || `经历${pindex + 1}`"
            :name="`${pindex}`"
          >
            <el-form
              ref="tab"
              :model="tab"
              label-width="120px"
              :disabled="action === 'examine'"
            >
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    prop="startDate"
                    label="执教开始时间"
                    :rules="[
                      {
                        required: true,
                        message: '请选择执教开始时间',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-date-picker
                      v-model="tab.startDate"
                      type="date"
                      placeholder="请选择颁奖时间"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item prop="endDate" label="执教结束时间">
                    <el-radio v-model="tab.endDate1" label="1">至今</el-radio>
                    <el-radio
                      v-model="tab.endDate1"
                      label="2"
                    >选择时间</el-radio>
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
                  <el-form-item prop="expDescription" label="经历及主要成绩">
                    <el-input
                      v-model="tab.expDescription"
                      placeholder="请输入经历及主要成绩"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="remark" label="备注">
                    <el-input v-model="tab.remark" placeholder="备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- 项目经验 -->
        <h3>项目经历</h3>
        <el-tabs
          v-model="projectTabIndex"
          type="card"
          :editable="action !== 'examine'"
          @edit="handleProjectTabsEdit"
        >
          <el-tab-pane
            v-for="(tab, pindex) in form.projects"
            :key="pindex"
            :label="tab.name || `经历${pindex + 1}`"
            :name="`${pindex}`"
          >
            <el-form
              ref="tab"
              :model="tab"
              label-width="120px"
              :disabled="action === 'examine'"
            >
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item prop="name" label="项目名称">
                    <el-select v-model="tab.name" placeholder="请选择项目名称">
                      <el-option
                        v-for="(item, index) in applyProjectNames"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="level" label="教练等级">
                    <el-select v-model="tab.level" placeholder="请选择教练等级">
                      <el-option
                        v-for="(item, index) in coachLevels"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item prop="certifiedNumber" label="教练员资格证编号">
                    <el-input
                      v-model="tab.certifiedNumber"
                      placeholder="请填写教练员资格证编号"
                      :rules="[
                        {
                          required: true,
                          message: '请填写教练员资格证编号',
                          trigger: 'blur'
                        }
                      ]"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    prop="certificateImage"
                    label="教练证上传"
                    :rules="[
                      {
                        required: true,
                        message: '请上传教练证照片',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <Uploader v-model="tab.certificateImage" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" />

              <!-- 第三级表单  第一项 -->
              <div class="second-form-legend">
                <span class="title">添加执教经历</span>
                <el-button
                  icon="el-icon-plus"
                  circle
                  size="small"
                  @click="addWorkExp"
                />
              </div>
              <div
                v-for="(workExp, workExpIndex) in tab.teachingExps"
                :key="workExpIndex + Math.random()"
                class="workexp-line"
              >
                <el-form
                  ref="tab"
                  :model="workExp"
                  label-width="120px"
                  :disabled="action === 'examine'"
                >
                  <el-row>
                    <el-col :span="23">
                      <!-- 表单内容 -->
                      <el-row :gutter="20">
                        <el-col :span="10">
                          <el-form-item prop="startDate" label="执教开始时间">
                            <el-date-picker
                              v-model="workExp.startDate"
                              type="date"
                              placeholder="请选择执教开始时间"
                              style="width: 100%;"
                              value-format="yyyy-MM-dd"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item prop="endDate" label="执教结束时间">
                            <el-radio
                              v-model="workExp.endDate1"
                              label="1"
                            >至今</el-radio>
                            <el-radio
                              v-model="workExp.endDate1"
                              label="2"
                            >选择时间</el-radio>
                            <el-date-picker
                              v-if="workExp.endDate1 === '2'"
                              v-model="workExp.endDate"
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
                          >
                            <el-input
                              v-model="workExp.expDescription"
                              type="textarea"
                              placeholder="请填写经历及主要成绩"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item prop="remark" label="备注">
                            <el-input
                              v-model="workExp.remark"
                              type="textarea"
                              placeholder="请填写备注"
                            />
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
                        @click="removeWorkExpAther(workExpIndex)"
                      />
                    </el-col>
                  </el-row>
                </el-form>
              </div>
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
                :disabled="
                  (action === 'insert' || action === 'update') &&
                    form.status !== 3
                "
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
              <el-select
                v-model="form.status"
                placeholder="请选择会员状态"
                @change="onAdultStatusChange"
              >
                <el-option
                  v-for="(v, k) in membeStatus"
                  :key="k"
                  :label="v.name"
                  :value="v.value"
                />
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
                  {
                    required: true,
                    message: '请选择会员证书过期时间',
                    trigger: 'blur'
                  }
                ]"
              />
              <el-date-picker
                v-if="action !== 'examine'"
                v-model="form.certificateExpireTime"
                type="date"
                placeholder="请选择会员证书过期时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :disabled="form.status !== 3"
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
              <el-input
                v-model="form.rejectReason"
                placeholder="请输入审核未通过原因"
              />
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
        @click="submitForm(action, 1)"
      >通过</el-button>
      <el-button
        v-if="action === 'examine'"
        style="width: 140px;"
        type="danger"
        @click="submitForm(action, 2)"
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
      action: 'examine',
      vocationTabIndex: 0,
      projectTabIndex: 0,
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
      form: {
        registerType: '',
        projects: [],
        teachingExps: [],
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
          res.result.projects.map(project => project.teachingExps.forEach(ele => {
            if (ele.endDate === null) {
              ele.endDate1 = '1'
            } else {
              ele.endDate1 = '2'
            }
          }))
          // res.result.certifiedNumber = res.result.projects[0].certifiedNumber
          // res.result.level = res.result.projects[0].level
          // res.result.name = res.result.projects[0].name
          // 从数字转义到汉字表示
          // this.membeStatus.forEach(v => {
          //   if (v.value === res.result.status) {
          //     res.result.status = v.name;
          //   }
          // });
          // 回显数据
          this.form = res.result
          this.form.teachingExps = res.result.teachingExps || []
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
      'nations',
      'coachLevels'
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
      const options = []
      for (const k in this.county_list) {
        if (k.substr(0, 4) === targetCode) {
          options.push(this.county_list[k])
        }
      }
      this.countyOptions = options
    },
    handleVocationTabsEdit(targetName, action) {
      if (action === 'add') {
        this.form.teachingExps.push({
          endDate1: '1'
        })
      }
      if (action === 'remove') {
        this.form.teachingExps.splice(targetName, 1)
      }
    },
    handleProjectTabsEdit(targetName, action) {
      if (action === 'add') {
        this.form.projects.push({ teachingExps: [] })
      }
      if (action === 'remove') {
        this.form.projects.splice(targetName, 1)
        this.projectTabIndex = this.form.projects.length - 1
      }
    },
    addWorkExp() {
      const projectItem = this.form.projects[this.projectTabIndex]
      projectItem.teachingExps.push({})
    },
    removeWorkExp(workExpIndex) {
      const projectIndex = this.projectTabIndex
      const projectItem = this.form.projects[projectIndex]
      projectItem.teachingExps.splice(workExpIndex, 1)
      this.form.projects.splice(projectIndex, 1, { ...projectItem })
    },
    removeWorkExpAther(workExpIndex) {
      const projectIndex = this.projectTabIndex
      const projectItem = this.form.projects[projectIndex]
      projectItem.teachingExps.splice(workExpIndex, 1)
      this.form.projects.splice(projectIndex, 1, { ...projectItem })
    },
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
      // this.form.projects[0].certifiedNumber = this.form.certifiedNumber
      // this.form.projects[0].level = this.form.level
      // this.form.projects[0].name = this.form.name
      if (this.form.vipNumber && this.form.vipNumber.substr(0, 3) !== 'SSA') {
        const tagN = this.form.userInfo.sex === '男' ? '1' : '2'
        this.form.vipNumber = 'SSA' + tagN + this.form.vipNumber
      }
      if (action === 'insert') {
        this.form.id = '' // ID为空为添加
        this.form.applyYear = new Date().getFullYear() //	申请年度
        this.form.applyDate = this.getNowTime() // 申请时间
        this.form.certifiedTime = '' // 颁证时间
        this.form.email = '' // 邮箱
        this.form.orderNo = '' // 订单号  后端生成
        this.form.projects.map(project => project.teachingExps.forEach(ele => {
          if (ele.endDate1 === '1') {
            // 如果选择的是至今  则执教结束时间填写为空
            ele.endDate = ''
          }
        }))
        const tabs = this.$refs.tab
        const forms = this.$refs.form
        await this.formValidate(forms)

        // if (this.form.projects[0].coachExps.length <= 0) {
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
        // if (this.form.projects[0].coachExps.length <= 0) {
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
        this.form.certificateExpireTime =
          this.form.certificateExpireTime || getAutoExpiredTime()
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
