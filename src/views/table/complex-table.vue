<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入交易号搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="orderList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="订单ID"
        prop="id"
        sortable="custom"
        align="center"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单数量" align="center" prop="product_count">
        <template slot-scope="scope">
          <span>{{ scope.row.product_count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单价格" align="center" prop="total_price">
        <template slot-scope="scope">
          <span>{{ scope.row.total_price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实付款" align="center" prop="payment_price">
        <template slot-scope="scope">
          <span>{{ scope.row.payment_price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" prop="comments">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" align="center" prop="state">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ scope.row.state | stateNameFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            查看详情/编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        v-loading="formLoading"
        :model="temp"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        label-position="left"
      >
        <el-form-item label="医生" prop="username">
          <el-input v-model="temp.doctor.username" />
        </el-form-item>
        <el-form-item label="诊所" prop="clinic">
          <el-input v-model="temp.clinic.name" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="temp.state" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in statusOptions" :key="index" :label="item.name" :value="item.state" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单数量" prop="product_count">
          <el-input v-model.number="temp.product_count" />
        </el-form-item>
        <el-form-item label="订单价格" prop="total_price">
          <el-input v-model.number="temp.total_price" />
        </el-form-item>
        <el-form-item label="物流号" prop="tracking_number">
          <el-input v-model="temp.tracking_number" />
        </el-form-item>
        <el-form-item label="交易号" prop="pay_number">
          <el-input v-model="temp.pay_number" />
        </el-form-item>
        <el-form-item label="运费" prop="shipping_fee">
          <el-input v-model.number="temp.shipping_fee" />
        </el-form-item>
        <el-form-item label="付款时间" prop="pay_time">
          <el-input v-model="temp.pay_time" disabled />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address.street" />
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model="temp.comments" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?'':updateData(temp.id)">
          确定
        </el-button>
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders } from '@/api/doctor'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getDoctorById } from '@/api/role'
import { getOrderByIdFromProfessor, updateOrderByIdFromProfessor } from '@/api/professor'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(state) {
      switch (state) {
        case -1:
          return 'info'
        case 0:
          return 'danger'
        case 1:
          return 'success'
        case 2:
          return ''
        case 3:
          return 'success'
        case 4:
          return 'warning'
        case 5:
          return 'info'
        default:
          return 'info'
      }
    },
    stateNameFilter(state) {
      switch (state) {
        case -1:
          return '取消交易'
        case 0:
          return '未付款'
        case 1:
          return '已付款'
        case 2:
          return '已发货'
        case 3:
          return '已签收'
        case 4:
          return '退货申请'
        case 5:
          return '退货中'
        case 6:
          return '已退货'
      }
    },
    doctorFilter(id) {
      getDoctorById(id).then(resp => {
        return resp.data.username
      })
    }
  },
  data() {
    return {
      tableKey: 0,
      orderList: null,
      total: 0,
      listLoading: true,
      formLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      currentStatus: '',
      statusOptions: [
        {
          state: -1,
          name: '取消交易'
        },
        {
          state: 0,
          name: '未付款'
        },
        {
          state: 1,
          name: '已付款'
        },
        {
          state: 2,
          name: '已发货'
        },
        {
          state: 3,
          name: '已签收'
        },
        {
          state: 4,
          name: '退货申请'
        },
        {
          state: 5,
          name: '退货中'
        },
        {
          state: 6,
          name: '已退货'
        }],
      // 初始化弹出窗数据
      temp: {
        doctor: {
          username: null
        },
        clinic: {
          name: null
        },
        address: {
          street: null
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '查看/编辑订单',
        create: '创建订单'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOrders(this.listQuery.page).then(response => {
        this.orderList = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: 1,
        created_at: null,
        updated_at: null,
        clinic_id: 1,
        professor_id: 1,
        doctor_id: 2,
        patient_case_id: 1,
        is_first: 1,
        state: 0,
        product_count: 0,
        total_price: 0,
        payment_price: 0,
        shipping_fee: 0,
        pay_number: '',
        pay_time: '',
        tracking_number: '',
        address_id: 1,
        comments: '',
        doctor: {
          username: null
        },
        clinic: {
          name: null
        },
        address: {
          street: null
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      this.formLoading = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.formLoading = true
      getOrderByIdFromProfessor(row.id).then(resp => {
        this.temp = resp.data
        this.formLoading = false
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(id) {
      const orderData = Object.assign({}, this.temp)
      updateOrderByIdFromProfessor(id, orderData).then(() => {
        const index = this.orderList.findIndex(v => v.id === this.temp.id)
        this.orderList.splice(index, 1, this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
