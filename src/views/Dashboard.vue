<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <h2>说明</h2>
          <p> 欢迎使用Kayn后台管理系统，本系统只用于毕业设计，请勿商用，欢迎交流！</p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h2>联系作者</h2>
          <el-link href="https://github.com/guoyiyang" target="primary">https://github.com/guoyiyang</el-link>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../assets/img/img.jpg" class="user-avator" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            当前时间：
            <span>{{nowDate}}</span>
          </div>
          <div class="user-info-list">
            当前地点：
            <span>江苏徐州</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height:252px;">
          <template #header>
            <div class="clearfix">
              <span>语言详情</span>
            </div>
          </template>
          Java
          <el-progress :percentage="71.3" color="#42b983"></el-progress>
          Vue
          <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
          Scala
          <el-progress :percentage="13.7"></el-progress>
          JavaScript
          <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{userCnt}}</div>
                  <div>用户总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-message-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{orderCnt}}</div>
                  <div>订单总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">￥{{orderTotal}}</div>
                  <div>订单总金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height:403px;">
          <template #header>
            <div class="clearfix">
              <span>待办事项</span>
            </div>
          </template>

          <el-table :show-header="false" :data="todoList" style="width:100%;">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                  class="todo-item"
                  :class="{'todo-item-del': scope.row.status,}"
                >{{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getOrderCnt, getOrderTotal, getUserCnt} from "@/api";

export default {
  name: "dashboard",
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      nowDate: "", // 当前日期
      userCnt: 0,
      orderCnt: 0,
      orderTotal: 0.0,
      todoList: [
        {
          title: "Kayn商城前端开发",
          status: true
        },
        {
          title: "Kayn商城后台开发",
          status: true
        },
        {
          title: "Kayn商城后台管理系统开发",
          status: true
        },
        {
          title: "TF-IDF词频算法、KMeans聚类算法开发",
          status: true
        },
        {
          title: "项目整合与部属",
          status: false
        },
        {
          title: "论文撰写",
          status: false
        }
      ],
    };
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  created() {
    this.handleUserCnt();
    this.handleOrderCnt();
    this.handleOrderTotal();
  },
  mounted() {
    this.currentTime();
  },
  methods: {
    handleUserCnt() {
      getUserCnt().then(res => {
        if (res.code === 200) {
          this.userCnt = res.data;
        } else {
          this.$message.error("获取用户总数失败")
        }
      })
    },
    handleOrderCnt() {
      getOrderCnt().then(res => {
        if (res.code === 200) {
          this.orderCnt = res.data;
        } else {
          this.$message.error("获取订单总数失败")
        }
      })
    },
    handleOrderTotal() {
      getOrderTotal().then(res => {
        if (res.code === 200) {
          this.orderTotal = res.data;
        } else {
          this.$message.error("获取订单总金额失败")
        }
      })
    },
    currentTime() {
      setInterval(this.formatDate, 500);
    },
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let week = date.getDay(); // 星期
      let weekArr = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `${year}/${month}/${day} ${hour}:${minute}:${second} ${weekArr[week]}`;
    }
  }
};
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
