<template>
  <div id="questionSubmitView">
    <!--  <div>所有题目</div>-->
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="题号">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题目编号 ... "
          style="min-width: 280px"
        />
      </a-form-item>
      <a-form-item field="language" label="编程语言">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="请选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>c</a-option>
        </a-select>
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
      <!--      <template #judgeInfo="{ record }">-->
      <!--        {{ JSON.stringify(record.judgeInfo) }}-->
      <!--      </template>-->

      <template #judgeInfoMessage="{ record }">
        {{
          record.judgeInfo.message !== null ? record.judgeInfo.message : "NULL"
        }}
      </template>
      <template #judgeInfoTime="{ record }">
        {{
          record.judgeInfo.time !== null ? record.judgeInfo.time + "ms" : "NULL"
        }}
      </template>
      <template #judgeInfoMemory="{ record }">
        {{
          record.judgeInfo.memory !== null
            ? record.judgeInfo.memory + "MB"
            : "NULL"
        }}
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>

      <!--设置点击题目id能跳转到题目界面-->
      <template #questionId="{ record }">
        <a
          href="#"
          class="link-like-text"
          @click="() => toQuestionPage(record)"
          >{{ record.questionId }}</a
        >
      </template>

      <template #status="{ record }">
        {{ getStatusText(record.status) }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  // pageSize: 2,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
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

const columns = [
  {
    title: "题目提交编号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfoMessage",
  },
  {
    title: "消耗时间",
    slotName: "judgeInfoTime",
  },
  {
    title: "消耗内存",
    slotName: "judgeInfoMemory",
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "题目id",
    slotName: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "题目创建时间",
    slotName: "createTime",
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
const toQuestionPage = (question: { questionId: any }) => {
  router.push({
    path: `/view/question/${question.questionId}`,
  });
};

/**
 * 根据数字设定判题状态
 * @param statusCode
 */
const getStatusText = (statusCode: any) => {
  switch (statusCode) {
    case 0:
      return "等待中";
    case 1:
      return "判题中";
    case 2:
      return "判题完成";
    case 3:
      return "失败";
    default:
      return "未知状态";
  }
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
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
