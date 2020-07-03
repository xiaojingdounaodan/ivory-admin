<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="32">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
              style="margin-bottom:30px;">
        <box-card/>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 18}"
              style="background:#fff;padding:35px 16px 35px 16px;">
        <line-chart :chart-data="lineChartData"/>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}"
              style="margin-bottom:30px;" v-loading="casesLoading">
        <el-card class="box-card">
          <div slot="header">
            <mallki class-name="mallki-text" text="待处理病例"/>
            <el-button style="float: right; padding: 3px 0" type="text">查看全部</el-button>
          </div>
          <el-table :data="casesList">
            <el-table-column label="病例编号" prop="id" align="center">
              <template slot-scope="scope">
                {{scope.row.patient_id}}
              </template>
            </el-table-column>
            <el-table-column label="患者名称" align="center">
              <template slot-scope="scope" style="text-overflow:ellipsis">
                {{scope.row.patient.name}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="turnToEdit(scope.row.id)">
                  立即处理
                </el-button>
              </template>

            </el-table-column>
          </el-table>

        </el-card>
      </el-col>

      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}"
              style="margin-bottom:30px;" v-loading="casesLoading">
        <el-card class="box-card">
          <div slot="header">
            <mallki class-name="mallki-text" text="待确认方案"/>
            <el-button style="float: right; padding: 3px 0" type="text">查看全部</el-button>
          </div>
          <el-table :data="waitConfirmPlanList">
            <el-table-column label="病人名称" prop="id" align="center">
              <template slot-scope="scope">
                {{scope.row.patient.name}}
              </template>
            </el-table-column>
            <el-table-column label="方案状态" align="center" prop="state">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state  | caseStateFilter">{{scope.row.state | stateNameFilter}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <el-button type="warning" size="mini">
                立即处理
              </el-button>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}"
              style="margin-bottom:30px;">
        <el-card class="box-card">
          <div slot="header">
            <mallki class-name="mallki-text" text="Make it"/>
            <el-button style="float: right; padding: 3px 0" type="text">查看全部</el-button>
          </div>
          <el-table>
            <el-table-column></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col style="padding-right:8px;margin-bottom:30px;">
        <transaction-table/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TransactionTable from './components/TransactionTable'
  import TodoList from './components/TodoList'
  import BoxCard from './components/BoxCard'
  import {fetchCase, fetchCases, fetchPatient} from "@/api/doctor";
  import Mallki from '@/components/TextHoverEffect/Mallki'
  import LineChart from './components/LineChart'

  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  }
  export default {
    name: 'DashboardDoctor',
    components: {
      TransactionTable,
      TodoList,
      BoxCard,
      Mallki,
      LineChart
    },
    data() {
      return {
        lineChartData: lineChartData.newVisitis,
        casesList: [],
        waitConfirmPlanList: [],
        casesLoading: true,
      }
    },
    created() {

      fetchCases().then(resp => {
        //病例列表
        this.casesList = resp.data.data
        this.$store.dispatch('setCasesList', this.casesList)
        this.casesLoading = false
        for (let i = 0; i < this.casesList.length; i++) {
          switch (this.casesList[i].state) {
            case 2 || 4:
              this.waitConfirmPlanList.push(this.casesList[i]);
              break;
          }
        }
      })
    },
    methods: {
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },
      turnToEdit(id) {
        this.$router.push('/patientCase/edit/' + id)
      }
    },
    filters: {
      caseStateFilter(state) {
        switch (state) {
          case 0 || 1:
            return 'info'
          case 4:
            return 'warning'
          case 3 || 7 || 10:
            return 'success'
          case 5 || 6:
            return 'primary'
          default:
            return 'danger'
        }
      },
      stateNameFilter(state) {
        switch (state) {
          case -1:
            return '已取消'
          case 0:
            return '资料已创建'
          case 1:
            return '资料已提交'
          case 2:
            return '资料需修改'
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
