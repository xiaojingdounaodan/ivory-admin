<template>
  <div class="createPost-container">
    <el-form v-loading="editLoading" class="form-container">

      <sticky :class-name="'sub-navbar '" :z-index="10">
        <el-button v-if="!isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          创建
        </el-button>
        <el-button v-if="isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          修改
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">

            <div class="postInfo-container">
              <el-row>
                <el-col :lg="8" :sm="12" :xs="24">
                  <el-form-item class="postInfo-container-item" label="患者名称:" label-width="74px">
                    <el-input v-model="cases.patient.name" disabled placeholder="患者名称" />

                  </el-form-item>
                </el-col>

                <el-col :lg="8" :sm="12" :xs="24">
                  <el-form-item class="postInfo-container-item" label="患者性别:" label-width="74px">
                    <el-select v-model="cases.patient.sex" disabled placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :lg="8" :sm="12" :xs="24">
                  <el-form-item class="postInfo-container-item" label="年龄:" label-width="74px">
                    <el-input v-model="cases.patient.age" disabled placeholder="年龄" />
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item prop="comments" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="cases.features" :height="400" />
        </el-form-item>
        <el-upload
          v-if="isEdit"
          :file-list="fileList"
          :headers="headers"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          :action="apiHost+'doctor/patientCaseFile'"
          class="image-uploader"
          drag
          name="file"
          list-type="picture"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">请在此处上传医学图片，<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>

    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce/index'
import Sticky from '@/components/Sticky/index' // 粘性header组件
import { createCase, fetchCase, fetchPatient, updateCase } from '@/api/doctor'
import { getToken } from '@/utils/auth'

export default {
  name: 'CaseDetail',
  components: { Tinymce, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cases: {
        id: '',
        patient: {
          name: '',
          sex: '',
          age: ''
        },
        features: ''
      },
      headers: {
        Authorization: ''
      },
      loading: false,
      userListOptions: [],
      editLoading: false,
      tempRoute: {},
      options: [{
        value: 0,
        label: '男'
      }, {
        value: 1,
        label: '女'
      }, {
        value: 2,
        label: '其他'
      }],
      fileList: [],
      filename: '',
      apiHost: process.env.VUE_APP_BASE_API,
      staticHost: process.env.VUE_APP_STATIC_FILE_HOST
    }
  },
  created() {
    // 请求头携带Authorization
    this.headers.Authorization = 'Bearer ' + getToken()
    const id = this.$route.params && this.$route.params.id
    this.cases.id = id
    if (this.isEdit) {
      const casesList = this.$store.state.casesList
      if (casesList !== null) {
        const index = casesList.findIndex(value => value.id === parseInt(id))
        this.cases = casesList[index]
        this.fileList = JSON.parse(this.cases.files)
        this.setTagsViewTitle()
        this.setPageTitle()
        this.editLoading = false
      } else {
        fetchCase(id).then(resp => {
          this.cases = resp.data
          // 文件列表需解析Json格式
          this.fileList = JSON.parse(this.cases.files)
        }).then(() => {
          this.setTagsViewTitle()
          this.setPageTitle()
          setTimeout(() => {
            this.editLoading = false
          }, 1500)
        })
      }
    } else {
      // 病人缓存是否存在
      const patientList = this.$store.state.patientList
      if (patientList === null) {
        fetchPatient(id).then(resp => {
          this.cases.patient = resp.data
        })
      } else {
        const index = patientList.findIndex(v => v.id === id)
        this.cases.patient = patientList[index]
      }
    }

    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    beforeUpload(file) {
      const isImg = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isImg) {
        this.$message.error('上传的图片只能是 JPG或PNG 格式')
      }
      this.filename = file.name
      return isImg
    },
    handleRemove(file) {
      const index = this.fileList.findIndex(v => v.id === file.fid)
      this.fileList.splice(index, 1)
      updateCase(this.cases.id, {
        files: JSON.stringify(this.fileList)
      }).then(() => {
        this.$store.dispatch('clearCasesList')
      })
    },
    uploadSuccess(resp, file) {
      if (this.cases.id === null || this.cases.id === '') {
        this.$message.error('病例id为空')
        return
      }
      // 添加文件
      this.fileList.push({
        'fid': file.uid.toString(),
        'name': this.filename.toString(),
        'url': process.env.VUE_APP_STATIC_FILE_HOST + resp.path.toString()
      })
      // 更新病例文件
      updateCase(this.cases.id, {
        files: JSON.stringify(this.fileList)
      }).then(() => {
        this.$store.dispatch('clearCasesList')
        this.$message.success(resp.message)
      }).catch(() => {
        this.$message.error('资料上传失败')
      })
    },
    setTagsViewTitle() {
      const title = '病例编号'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.cases.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '病例编号'
      document.title = `${title} - ${this.cases.id}`
    },
    submitForm() {
      if (this.cases.features !== '' && this.cases.patient.name !== '' && this.cases.patient.age !== '') {
        this.loading = true
        if (!this.isEdit) {
          createCase({
            patient_id: this.cases.id,
            features: this.cases.features
          }).then(resp => {
            console.log(resp)
            this.$notify({
              title: '成功',
              message: '创建病例成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
          }).catch(() => {
            this.$notify({
              title: '错误',
              message: '创建病例失败',
              type: 'error',
              duration: 2000
            })
          })
        } else if (this.isEdit) {
          updateCase(this.cases.id, {
            features: this.cases.features
          }).then(() => {
            // 重置缓存
            this.$store.dispatch('clearCasesList')
            this.$store.dispatch('clearPatientList')
            this.loading = false
            this.$notify({
              title: '成功',
              message: '更新病例成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.$notify({
              title: '错误',
              message: '更新病例失败',
              type: 'error',
              duration: 2000
            })
          })
        }
      } else {
        this.$notify({
          title: '错误',
          message: '请填写所有输入框',
          type: 'error',
          duration: 2000
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
