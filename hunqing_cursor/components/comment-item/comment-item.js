// components/comment-item/comment-item.js
import { formatDate } from '../../utils/util.js'

Component({
  properties: {
    // 评论数据
    comment: {
      type: Object,
      value: {}
    }
  },

  methods: {
    formatDate(date) {
      return formatDate(date)
    }
  }
})

