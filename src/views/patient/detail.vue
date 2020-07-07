<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <div class="card-header">
        <div class="card-title">
          <mallki class-name="mallki-text" text="患者详情" />
        </div>
        <el-button class="card-button" icon="el-icon-edit" size="small" type="primary" @click="goToPatientEdit()">
          编辑
        </el-button>
      </div>
      <el-row>
        <el-col :lg="4" :xs="8">
          <div style="text-align: center;margin-top: 42px">
            <el-avatar
              v-if="patient.photo_url"
              :size="128"
              :src="staticHost+patient.photo_url"
            />

            <el-upload
              v-else
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
              <div class="el-upload__text"><em>上传患者照片</em></div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png的图片，且不超过500kb</div>
            </el-upload>
          </div>

        </el-col>
        <el-col :span="16">
          <div>姓名： {{ patient.name }}</div>
          <el-divider />
          <div>年龄： {{ patient.age }}</div>
          <el-divider />
          <div>性别： {{ patient.sex | sexFilter }}</div>
          <el-divider />
          <div>病人备注： {{ patient.comments }}</div>
          <el-divider />
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div class="card-header">
        <div class="card-title">
          <mallki :text="patient.name+'的病例'" class-name="mallki-text" />

        </div>
        <el-button
          class="card-button"
          icon="el-icon-plus"
          size="small"
          type="success"
          @click="goToCreateCase(patient.id)"
        >
          新病例
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="patient.patient_cases"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="病例编号" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="就诊时间" width="180px">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="症状描述">
          <template slot-scope="scope">
            <span v-html="scope.row.features" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="病例进度" width="120px">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | stateColorFilter">
              {{ scope.row.state | stateFilter }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="small" type="primary" @click="goToCaseEdit(scope.row.id)">
              编辑
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { fetchPatient } from '@/api/doctor'
import { getToken } from '@/utils/auth'
import { formatTimeToStr } from '@/utils/date'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  name: 'PatientDetail',
  components: {
    Mallki
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: '',
      patient: {
        id: null,
        created_at: null,
        updated_at: null,
        name: null,
        age: null,
        sex: null,
        comments: null,
        patient_cases: null
      },
      loading: true,
      headers: {
        Authorization: ''
      },
      apiHost: process.env.VUE_APP_BASE_API,
      staticHost: process.env.VUE_APP_STATIC_FILE_HOST
    }
  },
  created() {
    this.headers.Authorization = 'Bearer ' + getToken()
    this.id = this.$route.params && this.$route.params.id
    const patientList = this.$store.state.patientList
    if (patientList === null) {
      this.fetchData(this.id)
    } else {
      const index = patientList.findIndex(v => v.id === this.id)
      this.patient = patientList[index]
      const patientCases = this.patient.patient_cases
      for (let i = 0; i < patientCases.length; i++) {
        patientCases[i].created_at = patientCases[i].created_at ? formatTimeToStr(patientCases[i].created_at) : '未定义'
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
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
      this.patient.photo_url = process.env.VUE_APP_STATIC_FILE_HOST + resp.photo_url
      this.$message.success(resp.message)
    },
    fetchData(id) {
      fetchPatient(id).then(response => {
        this.patient = response.data
        const patientCases = this.patient.patient_cases
        for (let i = 0; i < patientCases.length; i++) {
          patientCases[i].created_at = patientCases[i].created_at ? formatTimeToStr(patientCases[i].created_at) : '未定义'
        }
        this.loading = false
      }).catch(err => {
        console.error('Error while loading patient detail', err)
        this.$notify({
          title: '未找到',
          message: '未找到该ID的患者',
          type: 'error',
          duration: 2000
        })
        this.$router.replace('/patient')
      })
    },
    goToPatientEdit() {
      this.$router.push('/patient/' + this.patient.id + '/edit')
    },
    goToCreateCase(id) {
      this.$router.push('/patientCase/create/' + id)
    },
    goToCaseEdit(id) {
      this.$router.push('/patientCase/edit/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .el-card {
    margin-bottom: 16px;
  }

</style>
