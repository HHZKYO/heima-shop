<script setup lang="ts">
//
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI, getHomeCategoryMutliAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CategoryPanel from './components/CategoryPanel.vue'
import Hotpanel from './components/Hotpanel.vue'

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

onLoad(() => {
  getHomeBannerListData()
  getHomeCategoryMutliData()
  getHomeHotData()
})
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <!-- 自定义轮播图 -->
  <XtxSwiper :list="bannerList" />
  <!-- 分类面板 -->
  <CategoryPanel :list="categoryList" />
  <!-- 热门推荐 -->
  <Hotpanel :list="hotList" />
</template>

<style lang="scss">
page {
  background-color: #f1f1f1;
}
</style>
