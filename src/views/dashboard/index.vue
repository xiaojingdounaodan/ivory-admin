<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import adminDashboard from './admin'
  import editorDashboard from './editor'
  import doctorDashboard from './doctor'

  export default {
    name: 'Dashboard',
    components: {adminDashboard, editorDashboard,doctorDashboard},
    data() {
      return {
        currentRole: 'adminDashboard'
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    created() {
      if (!this.roles.includes('admin') && !this.roles.includes('professor')) {
        this.currentRole = 'doctorDashboard'
      }
    }
  }
</script>
