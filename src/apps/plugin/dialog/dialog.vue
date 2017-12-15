<template>
  <transition name="dialog-fade">
    <div class="yt-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div class="yt-dialog" :class="[sizeClass, customClass]" ref="dialog"  :style="style">
        <div class="yt-dialog__header" @mousedown.stop="drag" ref="dialogHeader">
          <slot name="title">
            <span class="yt-dialog__title">{{title}}</span>
          </slot>
          <button type="button" class="yt-dialog__headerbtn" aria-label="Close" v-if ="showClose" @click.stop="handleClose">
            <i class="yt-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="yt-dialog__body" v-if ="rendered">
          <slot></slot>
        </div>
        <div class="yt-dialog__footer" v-if ="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Popup from './popup';
  import emitter from './emitter';
  export default {
    name: 'ytDialog',
    mixins: [Popup, emitter],
    props: {
      title: {
        type: String,
        default: ''
      },
      modal: {
        type: Boolean,
        default: true
      },
      modalAppendToBody: {
        type: Boolean,
        default: true
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: 'small'
      },
      customClass: {
        type: String,
        default: ''
      },
      top: {
        type: String,
        default: '15%'
      },
      beforeClose: Function
    },
    watch: {
      visible(val) {
        this.$emit('update:visible', val);
        if (val) {
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
          });
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          this.$emit('close');
        }
      }
    },
    computed: {
      sizeClass() {
        return `yt-dialog--${ this.size }`;
      },
      style() {
        return this.size === 'full' ? {} : {
          'top': this.top
        };
      }
    },
    methods: {
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide);
        } else {
          this.hide();
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false);
          this.$emit('visible-change', false);
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      },
      drag(e) {
        var obj = this.$refs.dialogHeader
                var box = this.$refs.dialog
        var ev = e || event
        var disX = ev.clientX - box.offsetLeft
        var disY = ev.clientY - box.offsetTop
        if (box.setCapture) {
                    box.setCapture()
        }
        document.onmousemove = function(ev) {
                    let e = ev || event
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnvalue = false;
          }
          var L = e.clientX - disX
          var T = e.clientY - disY
          if (L < 0) {
            L = 0
          } else if (L > document.documentElement.clientWidth - box.offsetWidth) {
            L = document.documentElement.clientWidth - box.offsetWidth
          }
          if (T < 0) {
            T = 0
          } else if (T > document.documentElement.clientHeight - box.offsetHeight) {
            T = document.documentElement.clientHeight - box.offsetHeight
          }
          box.style.left = L + 'px'
          box.style.top = T + 'px'
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
          if (box.releaseCapture) {
            box.releaseCapture()
          }
        }
      }
    },
    mounted() {
      if (this.visible) {
        this.rendered = true;
        this.open();
      }
    }
  };
</script>
<style>
  @charset "UTF-8";
  .v-modal-enter {
    animation: v-modal-in .2s ease
  }
  .v-modal-leave {
    animation: v-modal-out .2s ease forwards
  }
  @keyframes v-modal-in {
    0% {
      opacity: 0
    }
  }
  @keyframes v-modal-out {
    100% {
      opacity: 0
    }
  }
  .v-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000
  }
  .yt-dialog {
    position: absolute;
    left: 20%;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    box-sizing: border-box;
  }
  .yt-dialog--tiny {
    width: 30%;
  }
  .yt-dialog--small {
    width: 50%;
  }
  .yt-dialog--large {
    width: 90%;
  }
  .yt-dialog--full {
    width: 100%;
    top: 0;
    margin-bottom: 0;
    height: 100%;
    overflow: auto
  }
  .yt-dialog__wrapper {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    overflow: auto;
    margin: 0
  }
  .yt-dialog__header {
    padding: 20px 20px 0;
        cursor: move;
  }
  .yt-dialog__header:after,
  .yt-dialog__header:before {
    display: table;
    content: ""
  }
  .yt-dialog__header:after {
    clear: both
  }
  .yt-dialog__headerbtn {
    float: right;
    background: 0 0;
    border: none;
    outline: 0;
    padding: 0;
    cursor: pointer;
    font-size: 16px
  }
  .yt-dialog__headerbtn .yt-dialog__close {
    color: #bfcbd9
  }
  .yt-dialog__headerbtn:focus .yt-dialog__close,
  .yt-dialog__headerbtn:hover .yt-dialog__close {
    color: #20a0ff
  }
  .yt-dialog__title {
    line-height: 1;
    font-size: 16px;
    font-weight: 700;
    color: #1f2d3d
  }
  .yt-dialog__body {
    padding: 30px 20px;
    color: #48576a;
    font-size: 14px
  }
  .yt-dialog__footer {
    padding: 10px 20px 15px;
    text-align: right;
    box-sizing: border-box
  }
  .dialog-fade-enter-active {
    animation: dialog-fade-in .3s
  }
  .dialog-fade-leave-active {
    animation: dialog-fade-out .3s
  }
  @keyframes dialog-fade-in {
    0% {
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
  }
  @keyframes dialog-fade-out {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
    100% {
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
  }
</style>