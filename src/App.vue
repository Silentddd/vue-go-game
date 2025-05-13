<script setup>
import { useGoGameStore } from './stores/goGame'
import GoBoard from './components/GoBoard.vue'

const store = useGoGameStore()
</script>

<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h1>Vue围棋游戏</h1>
      </el-header>
      <el-main>
        <div class="game-container">
          <GoBoard />
          <div class="game-info">
            <el-card class="info-card">
              <template #header>
                <div class="card-header">
                  <span>游戏信息</span>
                </div>
              </template>
              <div class="player-info">
                <div class="current-player">
                  当前玩家：{{ store.currentPlayer === 'black' ? '黑棋' : '白棋' }}
                </div>
                <div class="score">
                  <div>黑棋得分：{{ store.blackScore }}</div>
                  <div>白棋得分：{{ store.whiteScore }}</div>
                </div>
              </div>
              <div class="controls">
                <el-button type="primary" @click="store.resetGame">重新开始</el-button>
                <el-button type="warning" @click="store.undo">悔棋</el-button>
                <el-button type="info" @click="store.pass">过棋</el-button>
              </div>
            </el-card>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  h1 {
    text-align: center;
    color: #409EFF;
    margin: 0;
    line-height: 60px;
  }
}

.game-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.game-info {
  width: 300px;
  .info-card {
    .card-header {
      font-weight: bold;
    }
  }
}

.player-info {
  margin-bottom: 1rem;
  .current-player {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #409EFF;
  }
  .score {
    font-size: 1.1rem;
    > div {
      margin: 0.5rem 0;
    }
  }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .el-button {
    width: 100%;
  }
}
</style>
