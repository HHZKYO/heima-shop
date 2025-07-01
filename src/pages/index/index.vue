<script setup lang="ts">
//
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'

const getHomeBannerListData = async () => {
  const res = await getHomeBannerAPI()
  console.log(res)
}

onLoad(() => {
  getHomeBannerListData()
})
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <!-- 自定义轮播图 -->
  <XtxSwiper />
</template>

<style lang="scss">
//
</style>
