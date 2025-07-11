<script setup lang="ts">
//
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI, getHomeCategoryMutliAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CategoryPanel from './components/CategoryPanel.vue'
import Hotpanel from './components/Hotpanel.vue'
import PageSkeleton from '@/pages/index/components/PageSkeleton.vue'
import { useGuessList } from '@/composables'

// 骨架屏显示判断
const isLoading = ref(false)

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

const { guessRef, onScrolltolower } = useGuessList()

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

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerListData(), getHomeCategoryMutliData(), getHomeHotData()])
  isLoading.value = false
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
    <!-- 骨架屏 -->
    <page-skeleton v-if="isLoading" />
    <template v-else>
      <!-- 自定义轮播图 -->
      <XtxSwiper :list="bannerList" />
      <!-- 分类面板 -->
      <CategoryPanel :list="categoryList" />
      <!-- 热门推荐 -->
      <Hotpanel :list="hotList" />
      <!-- 猜你喜欢 -->
      <XtxGuess ref="guessRef" />
    </template>
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
