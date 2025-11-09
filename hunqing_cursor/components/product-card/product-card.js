// components/product-card/product-card.js
Component({
  properties: {
    // 商品数据
    product: {
      type: Object,
      value: {},
      observer: function(newVal) {
        // 格式化价格
        if (newVal && newVal.price) {
          const priceText = (newVal.price / 100).toFixed(2)
          const originalPriceText = newVal.originalPrice ? (newVal.originalPrice / 100).toFixed(2) : ''
          this.setData({
            priceText,
            originalPriceText
          })
        }
      }
    }
  },

  data: {
    priceText: '0.00',
    originalPriceText: ''
  },

  methods: {
    // 点击商品卡片
    onTap() {
      const { product } = this.properties
      this.triggerEvent('tap', { product })
    }
  }
})

