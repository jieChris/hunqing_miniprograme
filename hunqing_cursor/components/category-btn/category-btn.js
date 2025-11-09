// components/category-btn/category-btn.js
Component({
  properties: {
    // 分类数据
    category: {
      type: Object,
      value: {}
    }
  },

  methods: {
    // 点击分类按钮
    onTap() {
      const { category } = this.properties
      this.triggerEvent('tap', { category })
    }
  }
})

