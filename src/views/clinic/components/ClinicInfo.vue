<template>
  <el-form>
    <el-form-item label="诊所名称">
      <el-input v-model.trim="clinic.name" />
    </el-form-item>
    <el-form-item label="诊所介绍">
      <el-input v-model.trim="clinic.intro" />
    </el-form-item>
    <el-form-item label="位置坐标">
      <el-input v-model.trim="clinic.position" />
    </el-form-item>
    <el-form-item label="所在城市">
      <el-input v-model.trim="clinic.city" />
    </el-form-item>
    <el-form-item label="具体位置">
      <el-input v-model.trim="clinic.address" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    clinic: {
      type: Object,
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
