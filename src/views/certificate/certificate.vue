<template>
  <div class="app-container" style="text-align: center">

    <el-steps :active="step" align-center style="margin-top: 20px" finish-status="success">
      <el-step description="请准确填写个人信息" title="步骤1" />
      <el-step description="请上传医生执照和诊所的营业执照" title="步骤2" />
      <el-step description="请等待审核" title="步骤3" />
    </el-steps>

    <transition name="fade-transform" mode="out-in">
      <el-form v-show="step === 0" ref="user" :model="user" :rules="rules" label-width="80px" style="margin-top: 40px">

        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" comments />
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="user.age" comments />
        </el-form-item>

        <el-form-item label="毕业院校" prop="school">
          <el-input v-model="user.school" comments />
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="user.mobile" comments />
        </el-form-item>

        <el-form-item label="所学专业" prop="major">
          <el-input v-model="user.major" comments />
        </el-form-item>

        <el-form-item label="个人简介" prop="introduction">
          <el-input v-model="user.introduction" comments />
        </el-form-item>

      </el-form>

    </transition>

    <transition name="fade-transform" mode="out-in">
      <div v-show="step === 1" class="upload-container">
        <aside>
          温馨提示：医生执照必须上传，如需修改，可以点击右侧预览图删除或者重新上传
        </aside>

        <el-upload
          :multiple="false"
          :show-file-list="false"
          :on-success="handleDoctorImageSuccess"
          class="image-uploader"
          drag
          :action="apiHost + 'doctor/certificate/upload'"
          :before-upload="beforeUpload"
          name="certificate"
          :headers="headers"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            此处上传<span style="color: green;font-weight: bold;">医生执照</span>，将文件拖到此处，或<em>点击上传</em>
          </div>
        </el-upload>
        <div class="image-preview">
          <div v-show="user.certificate!==''" class="image-preview-wrapper">
            <img :src="user.certificate">
            <div class="image-preview-action">
              <i class="el-icon-delete" @click="rmImage(user.certificate)" />
            </div>
          </div>
        </div>

        <el-upload
          :multiple="false"
          :show-file-list="false"
          :on-success="handleBusinessImageSuccess"
          class="image-uploader"
          drag
          :action="apiHost + 'doctor/certificate/upload'"
          :before-upload="beforeUpload"
          name="certificate"
          :headers="headers"
          style="margin-top: 20px"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            此处上传<span style="color: blue;font-weight: bold">营业执照</span>，将文件拖到此处，或<em>点击上传</em>
          </div>
        </el-upload>
        <div class="image-preview">
          <div v-show="businessLicense!==''" class="image-preview-wrapper">
            <img :src="businessLicense">
            <div class="image-preview-action">
              <i class="el-icon-delete" @click="rmImage(businessLicense)" />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <img v-if="step===2" src="https://schoolgezhi.cn/cdn/img/submitSuccess.png" style="margin-top: 150px;">

    <el-button v-show="step>0 && isButtonShow" style="margin-top: 20px" @click="prevStep">上一步</el-button>
    <el-button v-show="step<3 && isButtonShow" style="margin-top: 20px" type="primary" @click="nextStep">下一步</el-button>

  </div>

</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'Certification',
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此处是必填项'))
      } else {
        callback()
      }
    }
    return {
      step: 0,
      rules: {
        name: [{ validator: validateRequire }],
        age: [{ validator: validateRequire }, { type: 'number', message: '年龄必须为数字值' }],
        school: [{ validator: validateRequire }],
        mobile: [{ validator: validateRequire }],
        major: [{ validator: validateRequire }]
      },
      user: {
        username: '',
        age: 0,
        school: '',
        major: '',
        intro: '',
        mobile: '',
        certificate: ''
      },
      tempUrl: '',
      headers: {
        Authorization: ''
      },
      businessLicense: '',
      isButtonShow: true,
      apiHost: process.env.VUE_APP_BASE_API,
      staticHost: process.env.VUE_APP_STATIC_FILE_HOST
    }
  },
  created() {
    this.user = this.$store.getters.user
    this.headers.Authorization = 'Bearer ' + getToken()

    if (this.user.certificate_checked === 1) {
      this.step = 2
      this.isButtonShow = false
    }
  },
  methods: {
    // 下一步
    nextStep() {
      if (this.step === 0) {
        this.$refs.user.validate(valid => {
          if (valid) {
            this.step = 0.5
            this.isButtonShow = false
            setTimeout(() => {
              this.step = 1
              this.isButtonShow = true
            }, 550)
          } else {
            this.$message.error('请填写必填输入框!')
          }
        })
      } else if (this.step === 1) {
        if (this.user.certificate_checked === 2) {
          if (confirm('您的审核已经通过，您确定要重新提交吗？')) {
            if (this.user.certificate !== '') {
              this.isButtonShow = false
              this.step = 1.5
              setTimeout(() => {
                this.step = 2
              }, 550)
            }
          }
        } else {
          if (this.user.certificate !== '') {
            this.isButtonShow = false
            this.step = 1.5
            setTimeout(() => {
              this.step = 2
            }, 550)
          }
        }
      }
    },
    prevStep() {
      this.step = -1
      this.isButtonShow = false
      setTimeout(() => {
        this.step = 0
        this.isButtonShow = true
      }, 550)
    },
    rmImage(url) {
      if (confirm('您确定要删除吗？')) {
        this.user.certificate = ''
        this.$message.warning('删除成功')
      }
    },
    beforeUpload(file) {
      const isImg = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式')
      }
      return isImg
    },
    handleDoctorImageSuccess(resp) {
      this.user.certificate = this.staticHost + resp.path
      this.$message.success(resp.message)
    },
    // 营业执照位置，待开发
    handleBusinessImageSuccess(resp) {
      this.$message.success(resp.message)
    }
  }
}
</script>

<style scoped lang="scss">

  @import '~@/styles/mixin.scss';

  .upload-container {
    width: 100%;
    margin-top: 20px;
    @include clearfix;

    .image-uploader {
      width: 60%;
      display: inline-block;
    }

    .image-preview {
      width: 200px;
      height: 200px;
      border: 1px dashed #d9d9d9;
      display: inline-block;
      margin-left: 10px;

      .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        cursor: pointer;
        line-height: 200px;

        .el-icon-delete {
          font-size: 36px;
        }
      }

      &:hover {
        .image-preview-action {
          opacity: 1;
        }
      }
    }
  }
</style>
