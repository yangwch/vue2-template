<template>
  <div>
    {{results}}
  </div>
</template>
<script>
  import {aggScore} from '@/api/index'
  export default {
    data () {
      return {
        results: []
      }
    },
    created () {
      let self = this
      aggScore().then((results) => {
        self.results = results
        console.log(results)
      })
    }
  }
</script>