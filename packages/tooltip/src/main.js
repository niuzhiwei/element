import Popper from 'element-ui/src/utils/vue-popper';
import Vue from 'vue';

export default {
  name: 'ElTooltip',

  mixins: [Popper],

  props: {
    openDelay: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    popperClass: String,
    content: String,
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    },
    options: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        };
      }
    }
  },

  beforeCreate() {
    this.popperVM = new Vue({
      data: { node: '' },
      render(h) {
        return this.node;
      }
    }).$mount();
  },

  render(h) {
    this.popperVM.node = (
      <transition
        name={ this.transition }
        onAfterLeave={ this.doDestroy }>
        <div
          ref="popper"
          v-show={!this.disabled && this.showPopper}
          class={
            ['el-tooltip__popper', 'is-' + this.effect, this.popperClass]
          }>
          { this.$slots.content || this.content }
        </div>
      </transition>);

    if (!this.$slots.default) return this.$slots.default;

    const vnode = this.$slots.default[0];
    const data = vnode.data = vnode.data || {};
    const on = vnode.data.on = vnode.data.on || {};

    on.mouseenter = this.addEventHandle(on.mouseenter, this.handleShowPopper);
    on.mouseleave = this.addEventHandle(on.mouseleave, this.handleClosePopper);
    data.staticClass = this.concatClass(data.staticClass, 'el-tooltip');

    return vnode;
  },

  mounted() {
    this.referenceElm = this.$el;
  },

  methods: {
    addEventHandle(old, fn) {
      return old ? Array.isArray(old) ? old.concat(fn) : [old, fn] : fn;
    },

    concatClass(a, b) {
      return a ? b ? (a + ' ' + b) : a : (b || '');
    },

    handleShowPopper() {
      if (this.manual) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.showPopper = true;
      }, this.openDelay);
    },

    handleClosePopper() {
      if (this.manual) return;
      clearTimeout(this.timeout);
      this.showPopper = false;
    }
  }
};