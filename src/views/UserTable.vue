<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table
        stripe
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header">
        <el-table-column label="头像" align="center">
          <template #default="scope">
            <el-image
              style="width: 50px; height: 50px"
              class="table-td-thumb"
              :src="scope.row.file"
              :preview-src-list="[scope.row.file]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="sex" label="性别" width="50"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="description" label="简介"></el-table-column>
        <el-table-column prop="password" label="用户密码" width="120"></el-table-column>
        <el-table-column prop="role" label="用户角色" width="120">
          <template v-slot="scope">
            <el-tag>{{scope.row.role}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rmf" label="用户RMF">
          <template v-slot="scope">
            <el-tag type="success">{{scope.row.rfm}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="file">
          <el-input v-model="form.file"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-radio v-model="form.sex" label="男">男</el-radio>
            <el-radio v-model="form.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价值度" prop="rmf">
          <el-select v-model="form.rfm" placeholder="请选择">
            <el-option
              v-for="item in rfmOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getUserList, deleteUser, editUser} from "../api/index";

export default {
  data() {
    return {
      roleOptions: [{
        value: 'ROLE_ADMIN',
        label: 'ROLE_ADMIN'
      }, {
        value: 'ROLE_USER',
        label: 'ROLE_USER'
      }],
      rfmOptions: [{
        value: '高价值',
        label: '高价值'
      }, {
        value: '中高价值',
        label: '中高价值'
      }, {
        value: '中价值',
        label: '中价值'
      }, {
        value: '中低价值',
        label: '中低价值'
      }, {
        value: '低价值',
        label: '低价值'
      }],
      query: {
        username: "",
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      ruleForm: {
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getUserList(this.query).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.userList
          this.pageTotal = res.data.totalCnt || 0;
          this.$message.success(`获取用户数据成功`);
        } else {
          this.$message.error(`获取用户数据失败`);
        }
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.getData();
      this.$set(this.query, "pageIndex", 1);
    },
    saveEdit() {
      this.editVisible = false;
      editUser(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success(`修改第 ${this.idx + 1} 行成功`);
          this.$set(this.tableData, this.idx, this.form);
        } else {
          this.$message.error(`修改第 ${this.idx + 1} 行失败`);
        }
      })
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        let param = {
          username: row.username
        }
        deleteUser(param).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.tableData.splice(index, 1);
          } else {
            this.$message.error("删除失败");
          }
        })
      })
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getData();
    }

  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
