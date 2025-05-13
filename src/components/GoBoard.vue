<template>
  <div class="go-board">
    <div class="board-container" :style="{ '--board-size': store.boardSize }">
      <div class="grid">
        <div v-for="row in store.boardSize" :key="`row-${row}`" class="row">
          <div
            v-for="col in store.boardSize"
            :key="`${row}-${col}`"
            class="intersection"
            :class="{
              'black': board[row-1][col-1] === 'black',
              'white': board[row-1][col-1] === 'white',
              'last-move': isLastMove(row-1, col-1)
            }"
            @click="placePiece(row-1, col-1)"
          >
            <div class="stone" v-if="board[row-1][col-1]"></div>
          </div>
        </div>
      </div>
      <!-- 星位标记 -->
      <div 
        v-for="star in starPoints" 
        :key="star.join('-')"
        class="star-point"
        :style="{
          top: `calc(${star[0] * 100 / (store.boardSize - 1)}% - 4px)`,
          left: `calc(${star[1] * 100 / (store.boardSize - 1)}% - 4px)`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoGameStore } from '../stores/goGame'

const store = useGoGameStore()
const { board } = storeToRefs(store)

// 计算星位点的位置
const starPoints = computed(() => {
  if (store.boardSize === 19) {
    return [
      [3, 3], [3, 9], [3, 15],
      [9, 3], [9, 9], [9, 15],
      [15, 3], [15, 9], [15, 15]
    ]
  }
  return [] // 可以根据不同棋盘大小添加相应的星位
})

const isLastMove = (row, col) => {
  return store.lastMove && 
         store.lastMove.row === row && 
         store.lastMove.col === col
}

const placePiece = (row, col) => {
  store.placePiece(row, col)
}
</script>

<style scoped lang="scss">
.go-board {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 400px;
  min-height: 400px;
  padding: 20px 0;
}
.board-container {
  position: relative;
  width: 600px;
  height: 600px;
  background-color: #DEB887;
  border: 2px solid #8B4513;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}
.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  flex: 1;
}
.intersection {
  flex: 1;
  position: relative;
  border: 1px solid #8B4513;
  box-sizing: border-box;
  cursor: pointer;
  background: transparent;
}
.stone {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 2;
}
.black .stone {
  background: radial-gradient(circle at 30% 30%, #666, #000);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
}
.white .stone {
  background: radial-gradient(circle at 30% 30%, #fff, #ddd);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}
.last-move .stone::after {
  content: '';
  position: absolute;
  width: 30%;
  height: 30%;
  background-color: #ff0000;
  border-radius: 50%;
  top: 35%;
  left: 35%;
  opacity: 0.6;
}
.star-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #000;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style> 