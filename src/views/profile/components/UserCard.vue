<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人资料</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <br/>
          {{ user.name }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted" v-if="user.roles[0]==='doctor'">医生</div>
        <div class="user-role text-center text-muted" v-else-if="user.roles[0]==='admin'">管理员</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education"/>
          <span>认证情况</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted" v-if="user.certificate_checked === 2">
            <mallki class-name="mallki-text" text="已认证" style="font-size: 20px"/>
          </div>
          <div class="text-muted" v-else-if="user.certificate_checked === 1">
            <router-link class="pan-btn light-blue-btn" to="/certificate">
              审核中
            </router-link>
          </div>
          <div class="text-muted" v-else>
            <router-link class="pan-btn green-btn" to="/certificate">
              立即认证
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education"/>
          <span>教育信息</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{user.school}}
            {{user.major}}
          </div>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education"/>
          <span>个人简介</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{user.introduction}}
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
      user: {
        type: Object,
        default: () => {
          return {
            name: '',
            email: '',
            avatar: '',
            role: '',
            introduction: '',
            school: '',
            certificate_checked: '',
          }
        }
      }
    },
    created() {
      console.log(this.user.roles)
    }
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

  .user-profile {
    .user-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
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

    .user-follow {
      padding-top: 20px;
    }
  }

  .user-bio {
    margin-top: 20px;
    color: #606266;

    span {
      padding-left: 4px;
    }

    .user-bio-section {
      font-size: 14px;
      padding: 15px 0;

      .user-bio-section-header {
        border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
</style>
