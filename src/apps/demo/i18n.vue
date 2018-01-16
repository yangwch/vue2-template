<template>
<div>
  <!-- 多语言 -->
  <el-radio-group v-model="locale" @change="onLocaleChange" class="locale-buttons">
    <el-radio-button :label="item.value" v-for="(item,index) in langs" :key="index">{{item.text}}</el-radio-button>
  </el-radio-group>
  <h2>按钮文字</h2>
  <pre v-html="`
    {{$t('buttons.add')}}
    {{$t('buttons.edit')}}
    {{$t('buttons.delete')}}
    `">
  </pre>
  output:
  <p>
    <el-button type="default" icon="el-icon-plus">{{$t('buttons.add')}}</el-button>
    <el-button type="default" icon="iconfont icon-edit">{{$t('buttons.edit')}}</el-button>
    <el-button type="danger" icon="iconfont icon-delete">{{$t('buttons.delete')}}</el-button>
  </p>
  <h2>basic</h2>
  <pre v-html="`
    // 声明:
    const messagess = {
      cn: {
        messages: {
          hello: '你好，世界！ %{msg}',
          apple: '没有苹果 | 一个苹果 | {count} 个'
        }
      },
      en: {
        messages: {
          hello: 'hello world %{msg}',
          apple: 'no apples | one apple | {count} apples'
        }
      }
    }`">
  </pre>
  <pre>
  $t('messages.hello', {msg: 'test msg 000'})
  </pre>
  output:<br/>
  <p>
    {{$t('messages.hello', {msg: 'test msg 000'})}}
  </p><br/>

  <h2>多元化 Pluralization</h2>
  <pre>
    $tc('messages.apple', 0)
    $tc('messages.apple', 1)
    $tc('messages.apple', 10 , {count: 10})
  </pre>
  output:
  <ol>
    <li>* {{$tc('messages.apple', 0)}}</li>
    <li>* {{$tc('messages.apple', 1)}}</li>
    <li>* {{$tc('messages.apple', 10 , {count: 10})}}</li>
  </ol>

  <h2>货币</h2>
  <pre>
    $n(100, 'currency', 'zh-CN')
    $n(100, 'currency', 'en-US')
    $n(100, 'currency', 'euro')
  </pre>
  output:
  <ol>
    <li>人民币：{{$n(100, 'currency', 'zh-CN')}}</li>
    <li>美元：{{$n(100, 'currency', 'en-US')}}</li>
    <li>欧元：{{$n(100, 'currency', 'euro')}}</li>
  </ol>

</div>
</template>
<style scoped>
  pre {
    border: 1px dotted #ccc;
    padding-top: 15px;
  }
  h2 {
    margin-left: 1em;
    line-height: 2.2em;
    text-decoration: underline;
    border-bottom-width: 50%;
  }
  .locale-buttons {
    position: fixed;
    top: 10px;
    right: 10px;
  }
</style>

<script>
export default {
  data () {
    return {
      locale: this.$store && this.$store.state.locale,
      langs: [
        {value: 'cn', text: '中文'},
        {value: 'en', text: 'English'}
      ],
    }
  },
  methods: {
    /* 语言选择变化 */
    onLocaleChange(value) {
      this._i18n.locale = value;
      this.$store.commit('saveLocale', value);
    }
  }
}
</script>
