<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="患者编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="照片">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.photo_url"
            style="width: 60px; height: 60px"
            :src="staticHost+scope.row.photo_url"
          />
        </template>
      </el-table-column>

      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sexFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年龄">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button icon="el-icon-plus" size="small" type="success" @click="goToCreateCase(scope.row.id)">
            新病例
          </el-button>
          <el-button icon="el-icon-more-outline" size="small" type="primary" @click="goToDetail(scope.row.id)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :page.sync="page" :total="total" limit.sync="15" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/doctor'
import Pagination from '@/components/Pagination'
import { formatTimeToStr } from '@/utils/date'

export default {
  name: 'PatientList',
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
    sexFilter(sex) {
      switch (sex) {
        case 0:
          return '男'
        case 1:
          return '女'
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.$store.state.patientList === null) {
        fetchList(this.page).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].created_at = this.list[i].created_at ? formatTimeToStr(this.list[i].created_at) : '未定义'
          }
          this.$store.dispatch('setPatientList', this.list)
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        }).catch(() => {
          this.$message.error('您没有权限使用此功能，请先通过个人认证')
        })
      } else {
        this.list = this.$store.state.patientList
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      }
    },
    goToDetail(id) {
      this.$router.push('/patient/' + id)
    },
    goToCreateCase(id) {
      this.$router.push('/patientCase/create/' + id)
    }
  }
}
</script>

<style scoped>

</style>
