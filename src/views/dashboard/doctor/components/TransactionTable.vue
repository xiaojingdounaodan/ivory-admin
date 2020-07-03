<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;" v-loading="listLoading">
    <el-table-column label="订单编号" prop="id" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column label="物流号" align="center" prop="tracking_number">
      <template slot-scope="scope">
        <span>{{scope.row.tracking_number}}</span>
      </template>
    </el-table-column>

    <el-table-column label="交易号" align="center" prop="pay_number">
      <template slot-scope="scope">
        <span>{{scope.row.pay_number}}</span>
      </template>
    </el-table-column>

    <el-table-column label="订单价格" align="center" prop="total_price">
      <template slot-scope="scope">
        <span>{{scope.row.total_price}}</span>
      </template>
    </el-table-column>

    <el-table-column label="实付款" align="center" prop="payment_price">
      <template slot-scope="scope">
        <span>{{scope.row.payment_price}}</span>
      </template>
    </el-table-column>

    <el-table-column label="备注" align="center" prop="comments">
      <template slot-scope="scope">
        <span>{{scope.row.comments}}</span>
      </template>
    </el-table-column>

    <el-table-column label="订单状态" align="center" prop="state">
      <template slot-scope="scope">
        <el-tag :type="scope.row.state  | statusFilter">{{scope.row.state | stateNameFilter}}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleView(scope.row)">
          查看详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {transactionList} from '@/api/remote-search'
  import {getOrders} from "@/api/doctor";

  export default {
    filters: {
      statusFilter(status) {
        switch (status) {
          case -1:
            return "info"
          case 0:
            return "danger"
          case 1:
            return "success"
          case 2:
            return ""
          case 3:
            return "success"
          case 4:
            return "warning"
          case 5:
            return "info"
          default:
            return "info"
        }
      },
      stateNameFilter(state) {
        switch (state) {
          case -1:
            return "取消交易"
          case 0:
            return "未付款"
          case 1:
            return "已付款"
          case 2:
            return "已发货"
          case 3:
            return "已签收"
          case 4:
            return "退货申请"
          case 5:
            return "退货中"
          case 6:
            return "已退货"
        }
      }
    },
    data() {
      return {
        list: null,
        listLoading: true,
      }
    },
    created() {
      getOrders().then((resp) => {
        this.list = resp.data.data
        this.listLoading = false
      })
    },
    methods: {
      handleView() {
        this.$router.push('/table/order-table')
      }
    }
  }
</script>
