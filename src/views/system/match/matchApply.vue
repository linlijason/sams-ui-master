<template>
  <div class="member-form">
    <div class="member-form-content">
      <el-row :gutter="20" class="query">
        <el-select v-model="query.matchId" placeholder="选择赛事ID查询" class="input select">
          <el-option v-for="item in matchId" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="query.allInOne" style="width:300px;" placeholder="选择类型" class="input select">
          <el-option key="长征赛" label="长征赛" value="长征赛" />
          <el-option key="畅游赛-个人组-1000米" label="畅游赛-个人组-1000米" value="畅游赛-个人组-1000米" />
          <el-option key="畅游赛-个人组-2000米" label="畅游赛-个人组-2000米" value="畅游赛-个人组-2000米" />
          <el-option key="畅游赛-家庭组-3000米" label="畅游赛-家庭组-3000米" value="畅游赛-家庭组-3000米" />
          <el-option key="畅游赛-家庭组-5000米" label="畅游赛-家庭组-5000米" value="畅游赛-家庭组-5000米" />
        </el-select>
        <div>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="warning" @click="reset">重置</el-button>
        </div>
      </el-row>
      <div>
        <el-button type="primary" @click="exportData">导出</el-button>
      </div>
    </div>
    <div style="padding:10px">
      <el-table
        ref="tableData"
        v-loading="loading"
        :data="tableData"
        size="small"
        style="width: 100%;"
      >
        <el-table-column prop="matchName" label="赛事名称" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="vipNumber" label="VIP编号" />
        <el-table-column prop="formA.matchType" label="比赛类别" />
        <el-table-column prop="formA.applyGroup" label="参赛组别" />
        <el-table-column prop="formA.applyType" label="参赛类别" />
        <el-table-column prop="formA.groupName" label="家庭团队名称" />
        <el-table-column prop="applyDate" label="参赛时间" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="detail(scope.row)">详情</el-button>
            <el-button type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageNum"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
      />
    </div>
    <el-dialog title="参赛用户详情" :visible.sync="dialogTableVisible" width="90%">
      <el-table :data="user">
        <el-table-column property="address" label="地址" />
        <el-table-column property="age" label="年龄" />
        <el-table-column property="provinceCountyCity" label="省市" />
        <!-- <el-table-column property="city" label="市" />
        <el-table-column property="county" label="区" />
        <el-table-column property="province" label="省" /> -->
        <el-table-column property="fixedYears" label="运动年限" />
        <el-table-column property="idCard" label="身份证号码" />
        <el-table-column property="name" label="姓名" />
        <el-table-column property="partyMember" label="是否党员" />
        <el-table-column property="phone" label="手机号" />
        <el-table-column property="sex" label="年龄" />
        <el-table-column property="soldier" label="是否军人" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import matchApply from '@/api/matchApply'

export default {
  data() {
    return {
      loading: false,
      matchId: [],
      dialogTableVisible: false,
      query: {},
      tableData: [],
      user: [],
      pageNum: 10,
      currentPage: 1,
      total: 1
    }
  },
  beforeMount() {
    this.search()
    this.initMatchId()
  },
  methods: {
    currentChange(index) {
      this.currentPage = index
      this.search()
    },
    exportData() {
      matchApply
        .exportData(this.query)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], {
            type: 'application/x-xls;charset=utf-8'
          })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)

          link.download = '赛事报名信息.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
        .catch(error => {
          console.log(error)
        })
    },
    initMatchId() {
      matchApply.getMatchList({ size: 30, id: 'asc' }).then(res => {
        res.content.forEach(ele => {
          this.matchId.push({ id: ele.id, name: ele.name })
        })
      })
    },
    detail(row) {
      this.dialogTableVisible = true
      row.formA.users.forEach(ele => {
        ele.soldier = ele.soldier === true ? '是' : '否'
        ele.partyMember = ele.partyMember === true ? '是' : '否'
        ele.provinceCountyCity = ele.province + ele.city + ele.county
      })
      this.user = row.formA.users
    },
    del(row) {
      this.$confirm('删除赛事，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = []
          data.push(row.id)
          matchApply.del(data).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.search()
          })
        })
        .catch(() => {})
    },
    search() {
      this.loading = true
      this.query.size = this.pageNum
      this.query.page = this.currentPage - 1
      this.query.sort = 'id,asc'
      matchApply.list(this.query).then(res => {
        res.content.forEach(ele => {
          const time = new Date(ele.applyDate)
          ele.applyDate =
            time.toLocaleDateString().replace(/\//g, '-') +
            ' ' +
            time.toTimeString().substr(0, 8)
        })
        this.loading = false
        this.tableData = res.content
        this.total = res.totalElements
      })
    },
    reset() {
      this.query = {}
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.member-form {
  .member-form-content {
    padding: 10px;
  }
  .query {
    display: flex;
    div {
      padding: 10px;
    }
  }
  .input {
    padding: 10px;
    width: 200px;
  }
  .select {
    width: 200px;
  }
}
</style>
