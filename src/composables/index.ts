import type { XtxGuessInstance } from '@/types/components'
import { ref } from 'vue'

export const useGuessList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XtxGuessInstance>()

  // 滚动到底部加载更多
  const onScrolltolower = () => {
    // 模拟加载更多数据
    // console.log('滚动到底部，加载更多数据')
    guessRef.value?.getMore()
  }
  return { guessRef, onScrolltolower }
}
