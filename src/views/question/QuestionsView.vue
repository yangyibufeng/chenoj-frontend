<template>
  <div id="questionsView">
    <!--  <div>所有题目</div>-->
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="题目">
        <a-input
          v-model="searchParams.title"
          placeholder="请输入题目名称 ... "
          style="min-width: 280px"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请输入标签 ..."
          style="min-width: 280px"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">查询</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${record.submitNum ? record.acceptedNum / record.submitNum : "0"}%(${
            record.acceptedNum
          }/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)"
            >详情
          </a-button>
          <!--        <a-button status="danger" @click="doDelete(record)">删除</a-button>-->
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const show = ref(true);

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  // pageSize: 2,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    // message.success("成功加载题目列表");
  } else {
    message.error("加载失败" + res.message);
  }
};
/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
    //新建一个查询的时候将分页页码改到第一页
  };
  // 上面已经将searchParams的值改变，会被钩子函数监听到从而自动执行重新加载
  // loadData();
};
/**
 * 创建一个钩子函数，这个函数的作用是：当里面方法中有变量发生改变时，重新执行该方法
 * 这是当searchParams中的current改变时进行重新加载页面
 */
watchEffect(() => {
  loadData();
});

// 当页面加载出来的时候就会执行该方法
onMounted(() => {
  loadData();
});

// [{id: "1", title: "A+E", content: "新的题目", tags: ["二叉树"], submitNum: 0, acceptedNum: 0,…},…]

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "题目创建时间",
    slotName: "createTime",
  },
  {
    // title: "操作",
    slotName: "optional",
  },
];
/**
 * 当页面改变时触发此函数
 * 直接将searchParams的值进行修改，全局的页面状态维护都由searchParams来负责
 * 将原本的searchParams值拿过来，将current赋为新值
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到题目详情页
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
