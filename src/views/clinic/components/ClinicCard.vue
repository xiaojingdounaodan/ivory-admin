<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>诊所资料</span>
    </div>

    <div class="clinic-profile">
      <div class="box-center">
        <el-image :src="clinic.image"></el-image>
      </div>
      <div class="box-center">
        <div class="clinic-name text-center">{{ clinic.name }}</div>
      </div>
    </div>

    <div class="clinic-bio">
      <div class="clinic-education clinic-bio-section">
        <div class="clinic-bio-section-header">
          <svg-icon icon-class="education"/>
          <span>地址</span></div>
        <div class="clinic-bio-section-body">
          <div class="text-muted">
            {{clinic.address}}
          </div>
        </div>
      </div>
    </div>

    <div class="clinic-bio">
      <div class="clinic-education clinic-bio-section">
        <div class="clinic-bio-section-header">
          <svg-icon icon-class="education"/>
          <span>简介</span></div>
        <div class="clinic-bio-section-body">
          <div class="text-muted">
            {{clinic.intro}}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import Mallki from '@/components/TextHoverEffect/Mallki'
  import checkPermission from "@/utils/permission";

  export default {
    components: {PanThumb, Mallki},
    props: {
      clinic: {
        type: Object,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #777;
  }

  .clinic-profile {
    .clinic-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .clinic-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .clinic-follow {
      padding-top: 20px;
    }
  }

  .clinic-bio {
    margin-top: 20px;
    color: #606266;

    span {
      padding-left: 4px;
    }

    .clinic-bio-section {
      font-size: 14px;
      padding: 15px 0;

      .clinic-bio-section-header {
        border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
</style>
