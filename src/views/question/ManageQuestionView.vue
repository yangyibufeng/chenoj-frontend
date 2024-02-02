<template>
  <div id="manageQuestionView"></div>
  <div>管理题目</div>
  <a-table
    :columns="columns"
    :data="dataList"
    :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.pageNum,
      total,
    }"
  >
    <template #optional="{ record }">
      <a-space>
        <a-button type="primary" @click="doUpdate(record)">修改</a-button>
        <a-button status="danger" @click="doDelete(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const show = ref(true);

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  pageNum: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    message.success("成功加载题目列表");
  } else {
    message.error("加载失败" + res.message);
  }
};

// 当页面加载出来的时候就会执行该方法
onMounted(() => {
  loadData();
});

// [{id: "1", title: "A+E", content: "新的题目", tags: ["二叉树"], submitNum: 0, acceptedNum: 0,…},…]

const columns = [
  {
    title: "题目编号",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "样例",
    dataIndex: "judgeCase",
  },
  {
    title: "创建题目时间",
    dataIndex: "createTime",
  },
  {
    title: "创建题目用户id",
    dataIndex: "userId",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const router = useRouter();

const doUpdate = (question: Question) => {
  // console.log(question);
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

const doDelete = async (question: Question) => {
  // console.error(question);

  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });

  if (res.code === 0) {
    message.success("删除成功，即将刷新页面");
    loadData();
  } else {
    message.error("删除失败" + res.message);
  }
};
</script>

<style scoped>
#manageQuestionView {
}
</style>
