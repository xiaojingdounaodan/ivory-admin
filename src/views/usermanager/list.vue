<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">创建新用户</el-button>

    <el-table v-loading="tableLoading" :data="rolesList" border style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="用户ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="手机号">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="证书状态">
        <template slot-scope="scope">
          {{ scope.row.certificate_checked | certificateFilter }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="诊所编号">
        <template slot-scope="scope">
          {{ scope.row.clinic_id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'创建新用户'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="用户ID">
          <el-input v-model="role.id" disabled />
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="role.username" placeholder="用户姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="role.email" placeholder="邮箱地址" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="role.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="头像地址">
          <el-input v-model="role.head_portrait" placeholder="头像地址" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-input v-model="role.type" placeholder="1是医生 2是专家/管理员" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-input v-model.number="role.certificate_checked" placeholder="1正在审核 2审核通过 3审核不通过" />
        </el-form-item>
        <el-form-item label="证书详情">
          <el-image
            style="width: 100px; height: 100px"
            :src="staticHost+role.certificate"
            :preview-src-list="[role.certificate]"
          />
        </el-form-item>
        <el-form-item label="用户描述">
          <el-input
            v-model="role.intro"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmRole">确认</el-button>
        <el-button type="danger" @click="dialogVisible=false">关闭</el-button>
        <el-button v-if="role.certificate_checked === 1" type="success" @click="isAudit(2)">通过审核</el-button>
        <el-button v-if="role.certificate_checked === 1" type="warning" @click="isAudit(3)">不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { addRole, deleteRole, getDoctors, updateDoctor } from '@/api/role'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  filters: {
    certificateFilter(certificate_checked) {
      switch (certificate_checked) {
        case 0:
          return '未上传'
        case 1:
          return '待审核'
        case 2:
          return '已认证'
        case 3:
          return '不通过'
      }
    }
  },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      tableLoading: true,
      apiHost: process.env.VUE_APP_BASE_API,
      staticHost: process.env.VUE_APP_STATIC_FILE_HOST
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getDoctors()
  },
  methods: {
    async getDoctors() {
      const res = await getDoctors(1, '')// state为空时获取所有doctor
      this.rolesList = res.data.data
      this.tableLoading = false
    },
    // 审核
    isAudit(state) {
      updateDoctor(this.role.id, state).then(resp => {
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `通过成功`,
          type: 'success'
        })
      })
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        // 更新用户信息
        await updateDoctor(this.role.id, this.role.certificate_checked).then(() => {
          const index = this.rolesList.findIndex(v => v.id === this.role.id)
          this.rolesList.splice(index, 1, this.role)
          this.dialogFormVisible = false
          this.dialogVisible = false
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `更新成功`,
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '更新失败'
          })
        })
      } else {
        const { data } = await addRole(this.role)
        this.role.key = data.key
        this.rolesList.push(this.role)
      }
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }

    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
