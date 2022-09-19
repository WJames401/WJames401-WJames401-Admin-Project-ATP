<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0" />
    </el-card>
    <el-card>
      <!-- 展示spu列表的结构 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%" :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加SPU"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看当前SPU全部列表"
                @click="lookSku(row)"
              ></hint-button>
              <el-popconfirm
                :title="`确定删除${row.spuName}`"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :current-page="page"
          layout=" prev, pager, next, jumper,->, sizes,total"
          :total="total"
          :pager-count="7"
          @current-change="getSpuList"
          @size-change="currentChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene === 1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene === 2" @changeScenes="changeScenes" ref="sku" />
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" border style="width: 100%" v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
        ></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              style="width: 100px; height: 100px" /></template
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm/index.vue";
import SkuForm from "./SkuForm/index.vue";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: 0,
      category2Id: 0,
      category3Id: 0,
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0, //0为展示SPU列表，1为添加或者修改SPU，2位添加SKU
      dialogTableVisible: false, //控制对话框的显示与隐藏
      spu: {},
      skuList: [], //存储sku列表的数据,
      loading: true, //显示正在加载
    };
  },
  mounted() {
    this.getSpuList();
  },
  methods: {
    //三级联动自定义事件回调
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //清除二三级id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        //清除三级id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //获取spu列表
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //改变当页展示数据的回调
    currentChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加SPU
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改SPU
    updateSpu(row) {
      this.scene = 1;
      // console.log(this.$refs.spu);
      this.$refs.spu.initSpuData(row);
    },
    //删除SPU
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code === 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //自定义事件回调，添加SPU回到SPU列表
    changeScene({ scene, flag }) {
      this.scene = scene;
      console.log(flag);
      if (flag === "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //自定义事件回调，添加SKU回到SKU列表
    changeScenes(scene) {
      this.scene = scene;
    },
    //添加SKU
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getSkuData(this.category1Id, this.category2Id, row);
    },
    //查看SKU的按钮的回调
    async lookSku(spu) {
      this.loading = true;
      this.dialogTableVisible = true;
      this.spu = spu;
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code === 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    //关闭会话框的回调
    close(done) {
      this.skuList = [];
      //关闭对话框
      done();
    },
  },
};
</script>

<style>
</style>