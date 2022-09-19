<template>
  <div>
    <el-table border style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column
      ><el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column
      ><el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template> </el-table-column
      ><el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column
      ><el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column
      ><el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-sort-up"
            v-if="row.isSale === 0"
            @click="sale(row)"
            title="上架SKU"
          ></el-button>
          <el-button
            type="success"
            size="mini"
            icon="el-icon-sort-down"
            v-else
            @click="cancel(row)"
            title="下架SKU"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="edit"
            title="编辑SKU"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="getSkuInfo(row)"
            title="查看详情"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.skuName}`"
            @onConfirm="deleteSku(row)"
          >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除SKU"
              slot="reference"
              style="margin-left: 10px"
            ></el-button>
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
      @current-change="getSkuList"
      @size-change="currentChange"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="show"
      :show-close="false"
      size="30%"
      style="font-size: 16px"
    >
      <el-row>
        <el-col :span="5">SKU名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">SKU描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格(元)</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">重量(千克)</el-col>
        <el-col :span="16">{{ skuInfo.weight }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16"
          ><el-tag
            type="warning"
            size="mini"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin: 5px; padding: 0px 5px"
            >{{ attr.attrName }}:{{ attr.valueName }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            size="mini"
            v-for="(saleAttr, index) in skuInfo.skuSaleAttrValueList"
            :key="saleAttr.id"
            style="margin: 5px; padding: 0px 5px"
            >{{ saleAttr.saleAttrName }}:{{
              saleAttr.saleAttrValueName
            }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="320px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" style="width: 320px; height: 320px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      skuInfo: [],
      show: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    //改变当页展示数据的回调
    currentChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //上架商品
    async sale(sku) {
      let result = await this.$API.sku.reqSale(sku.id);
      if (result.code === 200) {
        sku.isSale = 1;
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
    },
    //下架商品
    async cancel(sku) {
      let result = await this.$API.sku.reqCancel(sku.id);
      if (result.code === 200) {
        sku.isSale = 0;
        this.$message({
          type: "success",
          message: "下架成功",
        });
      }
    },
    //编辑的回调
    edit() {
      this.$message({
        type: "warning",
        message: "功能待开发",
      });
    },
    //获取SKU详细信息
    async getSkuInfo(row) {
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
        this.show = true;
      }
    },
    //删除SKU
    async deleteSku(row) {
      let result = await this.$API.sku.reqDeleteSku(row.id);
      if (result.code === 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getSkuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
  },
};
</script>


<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 320px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>