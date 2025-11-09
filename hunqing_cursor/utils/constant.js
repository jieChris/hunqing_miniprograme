// constant.js - 常量定义

// 分类类型
export const CATEGORY_TYPES = {
  WEDDING_PLAN: 'wedding_plan',      // 婚礼策划
  PHOTOGRAPHY: 'photography',        // 婚纱摄影
  HOTEL: 'hotel',                    // 婚宴酒店
  CAR: 'car',                        // 婚礼用车
  SUPPLIES: 'supplies'               // 婚礼用品
}

// 分类名称映射
export const CATEGORY_NAMES = {
  [CATEGORY_TYPES.WEDDING_PLAN]: '婚礼策划',
  [CATEGORY_TYPES.PHOTOGRAPHY]: '婚纱摄影',
  [CATEGORY_TYPES.HOTEL]: '婚宴酒店',
  [CATEGORY_TYPES.CAR]: '婚礼用车',
  [CATEGORY_TYPES.SUPPLIES]: '婚礼用品'
}

// 排序方式
export const SORT_TYPES = {
  DISTANCE: 'distance',              // 距离
  POPULARITY: 'popularity',          // 人气
  CATEGORY_COUNT: 'category_count'   // 商品种类
}

// 排序名称映射
export const SORT_NAMES = {
  [SORT_TYPES.DISTANCE]: '距离',
  [SORT_TYPES.POPULARITY]: '人气',
  [SORT_TYPES.CATEGORY_COUNT]: '商品种类'
}

