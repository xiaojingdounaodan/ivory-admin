<template>
  <el-form>
    <el-form-item label="邮箱（账号）">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: '更新成功',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
