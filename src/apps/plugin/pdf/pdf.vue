<!-- 
  @desc pdf
 -->
<template>
  <div ref="pdfdom" :class="className">
  </div>
</template>
<script>
  import {PDFObject} from './../../../../static/js/pdfobject'
  export default {
    data () {
      return {
        pdfobject: null
      }
    },
    props: {
      className: {
        type: String
      },
      options: {
        type: Object,
        default() {
          return {
            pdfOpenParams: {
              pagemode: "thumbs",
              navpanes: 1,
              toolbar: 0,
              statusbar: 0,
              view: "FitV"
            }
          }
        }
      },
      url: {
        type: String
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.pdfobject = PDFObject.embed(this.url, this.$refs.pdfdom, this.options)
      }
    }
  }
</script>