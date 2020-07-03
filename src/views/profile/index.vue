<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user"/>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="用户评论" name="activity" v-if="roles[0]==='doctor'">
                <activity/>
              </el-tab-pane>
              <el-tab-pane label="账户资料" name="account">
                <account :user="user"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import UserCard from './components/UserCard'
  import Activity from './components/Activity'
  import Account from './components/Account'

  export default {
    name: 'Profile',
    components: {UserCard, Activity, Account},
    data() {
      return {
        user: {},
        activeTab: 'activity'
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'roles',
        'introduction',
        'school',
        'major',
        'certificate_checked'
      ])
    },
    created() {
      this.user = this.$store.getters.user;
      let roles = this.$store.getters.roles;
      roles[0] === 'doctor' ? this.activeTab = 'activity' : this.activeTab = 'account'
    },
    methods: {}
  }
</script>
