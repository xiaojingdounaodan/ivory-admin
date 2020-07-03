<template>
  <div class="app-container">
    <div v-if="clinic">
      <el-row :gutter="20" v-loading="dataLoading">

        <el-col :span="6" :xs="24">
          <clinic-card :clinic="clinic"/>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="用户评论" name="activity">
                <activity/>
              </el-tab-pane>
              <el-tab-pane label="诊所资料" name="account">
                <account :clinic="clinic"/>
              </el-tab-pane>
              <el-tab-pane label="诊所照片" name="image">
                <clinic-img/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
  import ClinicCard from './components/ClinicCard'
  import Activity from './components/Activity'
  import Account from './components/ClinicInfo'
  import {getClinicByDoctor} from "@/api/doctor";
  import ClinicImg from "@/views/clinic/components/ClinicImg";

  export default {
    name: 'Clinic',
    components: {ClinicImg, ClinicCard, Activity, Account},
    data() {
      return {
        clinic: {},
        activeTab: 'activity',
        dataLoading: true
      }
    },
    created() {
      getClinicByDoctor().then(resp => {
        this.clinic = resp.data
        this.dataLoading = false
      }).catch(() => {
        this.$message.error("您没有权限使用此功能，请先通过个人认证")
      })
    },
    methods: {}
  }
</script>
