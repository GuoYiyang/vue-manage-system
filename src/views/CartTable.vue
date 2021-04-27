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
        <el-table-column label="商品图片(查看大图)" align="center">
          <template #default="scope">
            <el-image
              style="width: 50px; height: 50px"
              class="table-td-thumb"
              :src="scope.row.productImg"
              :preview-src-list="[scope.row.productImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="productId" label="商品ID"></el-table-column>
        <el-table-column prop="productName" label="商品名"></el-table-column>
        <el-table-column prop="salePrice" label="价格"></el-table-column>
        <el-table-column prop="productNum" label="数量"></el-table-column>

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
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="form.productId"></el-input>
        </el-form-item>
        <el-form-item label="商品名" prop="productName">
          <el-input v-model="form.productName"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="productImg">
          <el-input v-model="form.productImg"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="salePrice">
          <el-input v-model="form.salePrice"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="productNum">
          <el-input v-model="form.productNum"></el-input>
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
import {getCartList, editCart, deleteCart} from "../api/index";

export default {
  data() {
    return {
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
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        productId: [{required: true, message: '请输入商品ID', trigger: 'blur'}],
        productName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        productImg: [{required: true, message: '请输入商品图片', trigger: 'blur'}],
        salePrice: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
        productNum: [{required: true, message: '请输入商品数量', trigger: 'blur'}]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getCartList(this.query).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.cartList
          this.pageTotal = res.data.totalCnt || 0;
          this.$message.success(`获取购物车数据成功`);
        } else {
          this.$message.error(`获取购物车数据失败`);
        }
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.getData();
      this.$set(this.query, "pageIndex", 1);
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        let param = {
          id: row.id
        }
        deleteCart(param).then(res => {
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
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      editCart(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success(`修改第 ${this.idx + 1} 行成功`);
          this.$set(this.tableData, this.idx, this.form);
        } else {
          this.$message.error(`修改第 ${this.idx + 1} 行失败`);
        }
      })
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
