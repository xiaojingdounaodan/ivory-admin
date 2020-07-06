<template>
  <div class="app-container">
    <el-card>
      <div class="card-header">{{ isEdit ? '编辑患者' : '创建患者' }}</div>
      <el-main>
        <el-form
          ref="patientForm"
          v-loading="loading"
          :model="patientForm"
          :rules="rules"
          class="demo-patientForm"
          label-width="100px"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="patientForm.name" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="patientForm.sex" placeholder="请选择性别">
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
              <el-option label="未知" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="patientForm.age" autocomplete="off" type="number" />
          </el-form-item>
          <el-form-item label="备注" prop="comments">
            <el-input v-model="patientForm.comments" type="textarea" />
          </el-form-item>

          <el-form-item>

            <el-upload
              v-if="isEdit"
              class="upload-demo"
              :multiple="false"
              :show-file-list="false"
              drag
              :action="apiHost+'doctor/patient/'+id+'/photo'"
              :before-upload="beforeUpload"
              :headers="headers"
              :on-success="uploadSuccess"
              name="photo"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text"><em>更换患者照片</em></div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png的图片，且不超过500kb</div>
            </el-upload>

          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-card>
  </div>
</template>

<script>
import { createPatient, fetchPatient, updatePatient } from '@/api/doctor'
import { getToken } from '@/utils/auth'

export default {
  name: 'PatientForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: '',
      loading: false,
      headers: {
        Authorization: ''
      },
      patientForm: {
        name: '',
        age: '0',
        sex: '2',
        comments: ''
      },
      rules: {
        name: { required: true, message: '请输入姓名' },
        sex: { required: true, message: '请选择性别', trigger: 'blur' },
        age: [
          { required: true, message: '年龄不能为空' },
          { type: 'number', message: '年龄必须为数字值' }
        ],
        comments: { required: true, message: '请输入备注', trigger: 'blur' }
      },
      apiHost: process.env.VUE_APP_BASE_API,
      staticHost: process.env.VUE_APP_STATIC_FILE_HOST
    }
  },
  created() {
    if (this.isEdit) {
      this.headers.Authorization = 'Bearer ' + getToken()
      this.id = this.$route.params && this.$route.params.id
      this.fetchData(this.id)
    }
  },
  methods: {
    beforeUpload(file) {
      const isImg = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式')
      }
      return isImg
    },
    uploadSuccess(resp) {
      this.$message.success(resp.message)
    },
    fetchData(id) {
      const that = this
      that.loading = true
      fetchPatient(id).then(res => {
        that.patientForm = res.data
        that.patientForm.sex = String(that.patientForm.sex)
        that.loading = false
      })
    },
    submit() {
      this.$refs.patientForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updatePatient(this.id, this.patientForm).then(() => {
              this.$notify({
                title: '成功',
                message: '更新患者成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
            }).catch(err => {
              this.$notify({
                title: '失败',
                message: '更新患者失败',
                type: 'error',
                duration: 2000
              })
              console.log(err)
              this.loading = false
            })
          } else {
            createPatient(this.patientForm).then(resp => {
              this.$notify({
                title: '成功',
                message: '创建患者成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push('/patient/' + resp.data.id)
            }).catch(err => {
              this.$notify({
                title: '失败',
                message: '创建患者失败',
                type: 'error',
                duration: 2000
              })
              console.log(err)
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>

