<template>
  <div id="addQuestionView">
    <h2>{{ name }}题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入题目标题：... " />
      </a-form-item>
      <a-form-item field="tags" label="题目标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="标准答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 650px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制（ms）">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              min="0"
              mode="button"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制（KB）">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              min="0"
              mode="button"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制（KB）">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              min="0"
              mode="button"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item label="样例配置" :content-flex="false" :merge-props="false">
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :label="`样例-${index}：`"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 500px">
            <a-form-item :label="`样例输入-${index}：`" :key="index">
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入样例输入："
              />
            </a-form-item>
            <a-form-item :label="`样例输出-${index}：`" :key="index">
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入样例输出："
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)"
              >删除样例
            </a-button>
          </a-space>
        </a-form-item>

        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增样例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px"></div>
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();
// 如果页面地址包含update，就视为是更新页面
const updatePage = route.path.includes("update");
let name = "创建";

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * 如果是更新，就根据id获取到用户数据，并传入form中
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }

  name = "更新";

  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    // 将JSON转换成js，这里整个if循环都偷懒了，
    // 正确的应该是再后端将数据处理好之后（包括权限校验）再把整理好的数据返回给前端进行渲染
    form.value = res.data as any;
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败," + res.message);
  }
};
/**
 * 在页面加载时请求数据
 */
onMounted(() => {
  loadData();
});

/**
 * 新增样例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};
/**
 * 删除样例
 * @param index
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const doSubmit = async () => {
  console.log(form.value);
  // 区分这是更新还是创建接口
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("题目更新成功！");
      // loadData();
    } else {
      message.error("题目更新失败" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("题目创建成功！");
    } else {
      message.error("题目创建失败" + res.message);
    }
  }
};
const onContentChange = (value: string) => {
  form.value.content = value;
};
const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#addQuestionView {
}

MdEditor .bytemd {
  min-width: 80vh;
}
</style>
