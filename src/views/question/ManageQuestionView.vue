<template>
  <div id="manageQuestionView">
    <!--    <div>管理题目</div>-->
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      :hoverable="true"
      :show-header="true"
      :stripe="true"
      @page-change="onPageChange"
    >
      <!--设置点击题目id能跳转到题目界面-->
      <template #id="{ record }">
        <a
          href="#"
          class="link-like-text"
          @click="() => toQuestionPage(record)"
          >{{ record.id }}</a
        >
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <!--          <a-button type="primary" @click="toQuestionPage(record)"-->
          <!--            >详情-->
          <!--          </a-button>-->
          <a-button type="primary" @click="doUpdate(record)">修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();
const show = ref(true);

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  // pageSize: 2,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    message.success("成功加载题目列表");
    console.log(dataList.value);
  } else {
    message.error("加载失败" + res.message);
  }
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
    title: "题目编号",
    slotName: "id",
    align: "center",
  },
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "内容",
    dataIndex: "content",
    ellipsis: true,
    align: "center",
  },
  {
    title: "标签",
    dataIndex: "tags",
    align: "center",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
    align: "center",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    align: "center",
  },
  /**
   {
   title: "判题配置",
   dataIndex: "judgeConfig",
   ellipsis: true,
   align: "center",
   },
   {
   title: "样例",
   dataIndex: "judgeCase",
   ellipsis: true,
   align: "center",
   },
   */
  {
    title: "创建题目时间",
    slotName: "createTime",
    align: "center",
  },
  {
    title: "创建题目用户id",
    dataIndex: "userId",
    align: "center",
  },
  {
    title: "操作",
    slotName: "optional",
    align: "center",
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

const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};
</script>

<style scoped>
#manageQuestionView {
}
.link-like-text {
  color: black; /* 设置文本颜色为黑色 */
  text-decoration: none; /* 去掉下划线 */
}

/* 如果您想在鼠标悬停时改变样式，可以添加如下代码 */
.link-like-text:hover {
  color: #ffbeae; /* 鼠标悬停时的颜色，这里仍然是黑色 */
  text-decoration: greenyellow; /* 鼠标悬停时去掉下划线 */
}
</style>
