<template>
  <div id="questionDetailView">
    <!--    <div>题目详情</div>-->
    <a-row :gutter="[24, 24]">
      <!--语法，将整块屏幕分为了24个栅格，：md=12表示当符合条件时，这一列占12个栅格
      不满足时（屏幕过小），占据24个-->
      <a-col :md="12" xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目描述">
            <a-card v-if="question" :title="question.title">
              <a-card>
                <a-descriptions
                  title="判题信息"
                  :column="{ xs: 1, md: 1, lg: 2 }"
                >
                  <a-descriptions-item label="时间限制（ms）：">
                    {{ question.judgeConfig.timeLimit }}
                  </a-descriptions-item>
                  <a-descriptions-item label="内存限制（KB）：">
                    {{ question.judgeConfig.memoryLimit }}
                  </a-descriptions-item>
                  <a-descriptions-item label="堆栈限制（KB）：">
                    {{ question.judgeConfig.stackLimit }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-card>

              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" title="题解">
            <a-card v-if="question">
              <MdViewer :value="(question && question.answer) || '待開發'" />
            </a-card>
            <!-- {{ (question && question.answer) || "" }}-->
          </a-tab-pane>
          <a-tab-pane key="3" title="提交记录"> 暂时还没有开发</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item field="language" label="编程语言">
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="请选择编程语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>c</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <!--这里要将改变后的数据再传入CodeEditor中，要不然代码样式没法改变-->
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-divider size="0"></a-divider>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit">
          提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

const changeCode = (value: string) => {
  form.value.code = value;
};

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
    // message.success("成功加载题目列表");
  } else {
    message.error("加载失败" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value?.id,
  });

  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
};

// 当页面加载出来的时候就会执行该方法
onMounted(() => {
  loadData();
});
</script>

<style>
#questionDetailView {
  max-width: 1400px;
  margin: 0 auto;
}

#questionDetailView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
