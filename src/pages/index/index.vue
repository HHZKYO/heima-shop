<script setup lang="ts">
//
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI, getHomeCategoryMutliAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CategoryPanel from './components/CategoryPanel.vue'
import Hotpanel from './components/Hotpanel.vue'
import type { XtxGuessInstance } from '@/types/components'

// 获取轮播图数据
const bannerList = ref<BannerItem[]>([])
const getHomeBannerListData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

// 获取前台分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryMutliData = async () => {
  const res = await getHomeCategoryMutliAPI()
  categoryList.value = res.result
}

// 获取热门推荐数据
const hotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

// 获取猜你喜欢组件实例
const guessRef = ref<XtxGuessInstance>()

// 滚动到底部加载更多
const onScrolltolower = () => {
  // 模拟加载更多数据
  // console.log('滚动到底部，加载更多数据')
  guessRef.value?.getMore()
}

// 下拉刷新
const requestFlag = ref(false)
const handleRefresh = async () => {
  requestFlag.value = true
  // 重置猜你喜欢数据
  guessRef.value?.restData()
  // 重新获取数据
  await Promise.all([
    getHomeBannerListData(),
    getHomeCategoryMutliData(),
    getHomeHotData(),
    guessRef.value?.getMore(), // 重新获取猜你喜欢数据
  ])
  requestFlag.value = false
}

onLoad(() => {
  getHomeBannerListData()
  getHomeCategoryMutliData()
  getHomeHotData()
})
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <!-- 滚动容器 -->
  <scroll-view
    :refresher-enabled="true"
    @refresherrefresh="handleRefresh"
    :refresher-triggered="requestFlag"
    class="scroll-view"
    scroll-y
    @scrolltolower="onScrolltolower"
  >
    <!-- 自定义轮播图 -->
    <XtxSwiper :list="bannerList" />
    <!-- 分类面板 -->
    <CategoryPanel :list="categoryList" />
    <!-- 热门推荐 -->
    <Hotpanel :list="hotList" />
    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef" />
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f1f1f1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.scroll-view {
  flex: 1;
}
</style>
