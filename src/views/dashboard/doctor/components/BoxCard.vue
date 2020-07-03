<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img :src="clinicImg">
    </div>
    <div style="position:relative;">
      <pan-thumb :image="user.avatar" class="panThumb"/>
      <mallki class-name="mallki-text" :text="user.name"/>
      <div style="padding-top:35px;" class="progress-item">
        <span>未提交方案</span>
        <el-progress :percentage="35"/>
      </div>

      <div class="progress-item">
        <span>待审核方案</span>
        <el-progress :percentage="45"/>
      </div>

      <div class="progress-item">
        <span>已下单方案</span>
        <el-progress :percentage="20"/>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import Mallki from '@/components/TextHoverEffect/Mallki'
  import {getClinicByDoctor} from "@/api/doctor";

  export default {
    components: {PanThumb, Mallki},

    filters: {
      statusFilter(status) {
        const statusMap = {
          success: 'success',
          pending: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        statisticsData: {
          article_count: 1024,
          pageviews_count: 1024
        },
        user: {},
        clinicImg: '',
      }
    },
    created() {
      this.user = this.$store.getters.user
      const clinic = this.$store.state.clinic;
      if (clinic !== null && clinic !== '') {
        this.clinicImg = clinic.image
      } else {
        getClinicByDoctor().then(resp => {
          this.$store.dispatch("setClinic", resp.data)
          this.clinicImg = resp.data.image
        })
      }

    }
  }
</script>

<style lang="scss">
  .box-card-component {
    .el-card__header {
      padding: 0px !important;
    }
  }
</style>
<style lang="scss" scoped>
  .box-card-component {
    .box-card-header {
      position: relative;
      height: 220px;

      img {
        width: 100%;
        height: 100%;
        transition: all 0.2s linear;

        &:hover {
          transform: scale(1.1, 1.1);
          filter: contrast(130%);
        }
      }
    }

    .mallki-text {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      font-weight: bold;
    }

    .panThumb {
      z-index: 100;
      height: 70px !important;
      width: 70px !important;
      position: absolute !important;
      top: -45px;
      left: 0px;
      border: 5px solid #ffffff;
      background-color: #fff;
      margin: auto;
      box-shadow: none !important;

      ::v-deep .pan-info {
        box-shadow: none !important;
      }
    }

    .progress-item {
      margin-bottom: 10px;
      font-size: 14px;
    }

    @media only screen and (max-width: 1510px) {
      .mallki-text {
        display: none;
      }
    }
  }
</style>
