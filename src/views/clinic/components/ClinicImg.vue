<template>
  <el-upload
    drag
    :action="apiHost+'doctor/clinic/image'"
    :before-upload="beforeUpload"
    :on-success="uploadSuccess"
    :headers="headers"
    name="image"
  >
    <i class="el-icon-upload" />
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'ClinicImg',
  data() {
    return {
      headers: {
        Authorization: ''
      },
      apiHost: process.env.VUE_APP_BASE_API,
      staticHost: process.env.VUE_APP_STATIC_FILE_HOST
    }
  },
  created() {
    this.headers.Authorization = 'Bearer ' + getToken()
  },
  methods: {
    beforeUpload(file) {
      const isImg = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isImg) {
        this.$message.error('上传的图片只能是 JPG或PNG 格式')
      }
      return isImg
    },
    uploadSuccess(resp) {
      this.$message.success(resp.message)
    }
  }
}
</script>

<style scoped>

</style>
