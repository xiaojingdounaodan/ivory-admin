<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="病例编号" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="就诊时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.patient.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="照片">
        <template slot-scope="scope">
          <el-image
            :src="staticHost+scope.row.patient.photo_url"
            style="width: 60px;height: 60px"
          />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="病例进度" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | stateColorFilter">
            {{ scope.row.state | stateFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="症状概述">
        <template slot-scope="scope">
          <span v-html="scope.row.features" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="turnToEdit(scope.row.id)">
            编辑
          </el-button>

          <el-button type="danger" size="small" icon="el-icon-edit">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="page" limit.sync="15" @pagination="getList" />
  </div>
</template>

<script>
import { fetchCases } from '@/api/doctor'
import Pagination from '@/components/Pagination/index'
import { formatTimeToStr } from '@/utils/date'

export default {
  name: 'CasesList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    stateFilter(state) {
      switch (state) {
        case -1:
          return '已取消'
        case 0:
          return '资料已创建'
        case 1:
          return '资料已提交'
        case 2:
          return '资料待修改'
        case 3:
          return '方案已制定'
        case 4:
          return '方案待修改'
        case 5 || 6:
          return '方案已确定'
        case 7:
          return '已下单'
        case 8:
          return '订单已确认'
        case 10:
          return '已存档'
      }
    },
    stateColorFilter(state) {
      switch (state) {
        case 0:
        case 1:
          return 'primary'
        case 4:
          return 'warning'
        case 3:
        case 7:
        case 5:
        case 6:
        case 10:
          return 'success'
        case -1:
          return 'info'
        default:
          return 'danger'
      }
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      page: 1,

      staticHost: process.env.VUE_APP_STATIC_FILE_HOST
    }
  },
  created() {
    const casesList = this.$store.state.casesList
    if (casesList === null) {
      this.getList()
    } else {
      this.list = casesList
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].created_at = this.list[i].created_at ? formatTimeToStr(this.list[i].created_at) : '未定义'
      }
      this.listLoading = false
    }
  },
  methods: {
    getList() {
      fetchCases().then(response => {
        this.list = response.data.data
        this.$store.dispatch('setCasesList', this.list)
        this.total = response.data.total
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].created_at = this.list[i].created_at ? formatTimeToStr(this.list[i].created_at) : '未定义'
        }
        this.listLoading = false
      }).catch(() => {
        this.$message.error('您没有权限使用此功能，请先通过个人认证')
      })
    },
    turnToEdit(id) {
      this.$router.push('/patientCase/edit/' + id)
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
