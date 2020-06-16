<template>
  <div class="article-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>

      <!-- 数据表单 -->
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelID" placeholder="请选择">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="localArticle(1)">筛选</el-button>
        </el-form-item>
      </el-form>
    <!-- /数据表单 -->
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        根据筛选条件共查询到 {{ total_count }} 条结果
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb> -->
        <!-- /面包屑路径导航 -->
      </div>

      <!-- 数据表格 -->
      <el-table
        size="small"
        :data="articles"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="date"
          label="封面"
          width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <!-- <img
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              class="article-awart"
            >
            <img
              v-else
              src="./no-cover.gif"
              class="article-awart"
            > -->
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <!-- 自定义列模板 -->
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.status === 5">草稿</el-button> -->
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleArticle(scope.row.id)"
            ></el-button>
          </template>
          </el-table-column>
    </el-table>
    <!-- /数据表格 -->
    <!-- 分页 -->
      <el-pagination
        class="page"
        background
        layout="prev, pager, next"
        :total="total_count"
        :page-size="pageSize"
        :current-page.sync="page"
        :disabled="loading"
        @current-change="onChange"
      >
      </el-pagination>
    <!-- /分页 -->
    </el-card>
  </div>
</template>

<script>
import { getArticle, getArticleChannels, getDeleArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value1: '',
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: '' },
        { status: 1, text: '待审核', type: 'warning' },
        { status: 2, text: '审核成功', type: 'success' },
        { status: 3, text: '审核失败', type: 'info' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      total_count: 0, // 总数据条数
      pageSize: 10, // 每页显示条数
      status: null, // 查询文章的状态
      channels: [], // 文章频道
      channelID: null,
      date: null, // 日期
      loading: false, // 数据加载中 loading
      page: 1 // 当前页数
    }
  },
  computed: {},
  watch: {},
  created () {
    this.localArticle()
    this.localChannels()
  },
  mounted () {},
  methods: {
    localArticle (page = 1) {
      // 开启loading
      this.loading = true
      getArticle({
        page,
        per_page: 10, // 每页显示数据条数
        status: this.status,
        channel_id: this.channelID,
        begin_pubdate: this.date ? this.date[0] : null,
        end_pubdate: this.date ? this.date[1] : null
      }).then(res => {
        // console.log(res)
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.total_count = totalCount

        // 关闭loading
        this.loading = false
      })
    },
    // 分页
    onChange (page) {
      this.localArticle(page)
    },
    onSubmit () {
      console.log('submit!')
    },
    localChannels () {
      getArticleChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onDeleArticle (articleID) {
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getDeleArticle(articleID.toString()).then(res => {
          this.localArticle(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.box-card {
  width: 100%;
  margin-bottom: 20px;
}
.el-col-11{
  width: 30%;
}
.line{
  text-align: center;
}
.page{
  margin-top:20px;
  text-align: right;
}
.article-awart{
  width: 100px;
  // height: 60px;
  background-size: cover;
}
</style>
