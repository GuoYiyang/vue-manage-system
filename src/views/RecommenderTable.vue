<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-likefill" @click="handleSlide">轮播图管理</el-button>
      </div>
      <el-table
        stripe
        empty-text="请使用搜索框检索用户标签"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="preferQuery" label="检索词推荐">
          <template v-slot="scope">
            <el-tag>{{scope.row.preferQuery}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="queryScore" label="检索词得分">
          <template v-slot="scope">
            <el-tag type="success">{{scope.row.queryScore}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="preferCat" label="类别推荐">
          <template v-slot="scope">
            <el-tag>{{scope.row.preferCat}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="catScore" label="类别得分">
          <template v-slot="scope">
            <el-tag type="success">{{scope.row.catScore}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rmf" label="用户RMF价值度">
          <template v-slot="scope">
            <el-tag>{{scope.row.rfm}}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-card shadow="hover">
        <div class="schart-box">
          <schart class="schart" canvasId="querybar" :options="queryOptions"></schart>
        </div>
        <div class="schart-box">
          <schart class="schart" canvasId="catbar" :options="catOptions"></schart>
        </div>
      </el-card>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="slideVisible" width="30%">
      <el-form ref="form" :model="slideForm" :rules="ruleForm" label-width="70px">
        <el-form-item label="价值度" prop="rmf">
          <el-select v-model="slideForm.rfm" placeholder="请选择">
            <el-option
              v-for="item in rfmOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接" prop="username">
          <el-input v-model="slideForm.url"></el-input>
        </el-form-item>
        <el-form-item label="图片url" prop="username">
          <el-input v-model="slideForm.pic"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="slideVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveSlide">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getRecommenderList, deleteRecommender, addOrUpdateSlide} from "../api/index";
import Schart from 'vue-schart';
export default {
  components: {
    Schart
  },
  data() {
    return {
      queryOptions: {
        type: 'bar',
        title: {
          text: '关键词检索得分详细数据'
        },
        labels: [],
        datasets: []
      },
      catOptions: {
        type: 'bar',
        title: {
          text: '推进类别得分详细数据'
        },
        labels: [],
        datasets: []
      },
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
        username: ""
      },
      slideVisible: false,
      slideForm: {},
      tableData: [],
      idx: -1,
      id: -1,
    };
  },
  methods: {
    getData() {
      getRecommenderList(this.query).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.recDto;
          this.queryOptions.labels = res.data.queryLabelList;
          this.queryOptions.datasets = res.data.queryDataSetList;
          this.catOptions.labels = res.data.catLabelList;
          this.catOptions.datasets = res.data.catDataSetList;
          console.log(res.data)
          this.$message.success(`获取标签数据成功`);
        } else {
          this.$message.error(`获取标签数据失败`);
        }
      })
    },
    handleSlide() {
      this.slideVisible = true;
    },
    saveSlide() {
      addOrUpdateSlide(this.slideForm).then(res => {
        if (res.code === 200) {
          this.$message.success(`更新轮播图数据成功`);
        } else {
          this.$message.error(`更新轮播图数据失败`);
        }
      });
      this.slideVisible = false;
      this.slideForm = {};
    },
    // 触发搜索按钮
    handleSearch() {
      this.getData();
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
        deleteRecommender(param).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.tableData.splice(index, 1);
          } else {
            this.$message.error("删除失败");
          }
        })
      })
    },
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.schart {
  height: 400px;
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

</style>
