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
        <el-table-column prop="orderId" label="订单号"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="orderTotal" label="支付金额">
          <template v-slot="scope">
            <el-tag>{{scope.row.orderTotal}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="支付状态">
          <template v-slot="scope">
            <el-tag :type="getTypeStatus(scope.row.orderStatus)">{{getOrderStatus(scope.row.orderStatus)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="goodList" label="商品列表">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="handleGoodList(scope.row.orderId)"
            >查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="收货地址">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="handleOrderAddress(scope.row.addressId)"
            >查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
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

      <el-dialog title="商品列表" v-model="goodListVisible">
        <el-table :data="goodListData">
          <el-table-column property="productId" label="商品ID"></el-table-column>
          <el-table-column property="productName" label="商品名"></el-table-column>
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
          <el-table-column property="productNum" label="商品数量"></el-table-column>
          <el-table-column property="salePrice" label="价格"></el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog
        title="收货地址"
        v-model="addressVisible">
        <el-table :data="addressInfo">
          <el-table-column property="name" label="收件人姓名"></el-table-column>
          <el-table-column property="tel" label="收件人电话"></el-table-column>
          <el-table-column property="streetName" label="收件人地址"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getOrderList, deleteOrder, getOrderGoodList, getOrderAddress} from "../api/index";

export default {
  data() {
    return {
      query: {
        username: "",
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      goodListData: [],
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      goodListVisible: false,
      addressVisible: false,
      addressInfo: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getOrderList(this.query).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.orderList
          this.pageTotal = res.data.totalCnt || 0;
          this.$message.success(`获取订单数据成功`);
        } else {
          this.$message.error(`获取订单数据失败`);
        }
      })
    },
    getTypeStatus(status) {
      if (status === 0) {
        return ''
      } else if (status === 1) {
        return 'success'
      } else if (status === -1) {
        return 'danger'
      }
    },
    getOrderStatus (status) {
      if (status === 0) {
        return '待付款'
      } else if (status === 1) {
        return '已完成'
      } else if (status === -1) {
        return '已取消'
      }
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
          orderID: row.orderId
        }
        deleteOrder(param).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.tableData.splice(index, 1);
          } else {
            this.$message.error("删除失败");
          }
        })
      })
    },
    handleGoodList(orderID) {
      this.goodListVisible = true;
      let param = {
        orderID: orderID
      }
      getOrderGoodList(param).then(res => {
        if (res.code === 200) {
          this.goodListData = res.data
        } else {
          this.$message.error("获取数据失败");
        }
      })
    },
    handleOrderAddress(addressId) {
      this.addressVisible = true;
      let param = {
        addressID: addressId
      }
      getOrderAddress(param).then(res => {
        if (res.code === 200) {
          this.addressInfo = res.data
        } else {
          this.$message.error("获取数据失败");
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
