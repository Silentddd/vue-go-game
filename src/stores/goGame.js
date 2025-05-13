import { defineStore } from 'pinia'

export const useGoGameStore = defineStore('goGame', {
  state: () => ({
    boardSize: 19,
    board: Array(19).fill().map(() => Array(19).fill(null)),
    currentPlayer: 'black',
    history: [],
    blackScore: 0,
    whiteScore: 0,
    lastMove: null,
    passCount: 0
  }),

  actions: {
    placePiece(row, col) {
      if (this.isValidMove(row, col)) {
        // 保存当前状态到历史记录
        this.history.push({
          board: JSON.parse(JSON.stringify(this.board)),
          currentPlayer: this.currentPlayer,
          blackScore: this.blackScore,
          whiteScore: this.whiteScore
        })

        // 放置棋子
        this.board[row][col] = this.currentPlayer
        this.lastMove = { row, col }
        
        // 检查提子
        this.checkCaptures(row, col)
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black'
        
        // 重置过棋计数
        this.passCount = 0
        
        return true
      }
      return false
    },

    isValidMove(row, col) {
      // 检查是否在棋盘范围内
      if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
        return false
      }
      
      // 检查位置是否已经有棋子
      if (this.board[row][col] !== null) {
        return false
      }

      // TODO: 实现更多规则检查（禁入点等）
      
      return true
    },

    checkCaptures(row, col) {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      const opponent = this.currentPlayer === 'black' ? 'white' : 'black'
      
      for (const [dx, dy] of directions) {
        const newRow = row + dx
        const newCol = col + dy
        
        if (this.isValidPosition(newRow, newCol) && 
            this.board[newRow][newCol] === opponent) {
          this.checkGroup(newRow, newCol)
        }
      }
    },

    checkGroup(row, col) {
      const color = this.board[row][col]
      const group = this.findGroup(row, col)
      
      if (!this.hasLiberty(group)) {
        // 提子
        for (const [r, c] of group) {
          this.board[r][c] = null
          if (this.currentPlayer === 'black') {
            this.blackScore++
          } else {
            this.whiteScore++
          }
        }
      }
    },

    findGroup(row, col) {
      const color = this.board[row][col]
      const group = new Set()
      const stack = [[row, col]]
      
      while (stack.length > 0) {
        const [r, c] = stack.pop()
        const key = `${r},${c}`
        
        if (!group.has(key)) {
          group.add(key)
          
          const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
          for (const [dx, dy] of directions) {
            const newRow = r + dx
            const newCol = c + dy
            
            if (this.isValidPosition(newRow, newCol) && 
                this.board[newRow][newCol] === color) {
              stack.push([newRow, newCol])
            }
          }
        }
      }
      
      return Array.from(group).map(pos => pos.split(',').map(Number))
    },

    hasLiberty(group) {
      for (const [row, col] of group) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        for (const [dx, dy] of directions) {
          const newRow = row + dx
          const newCol = col + dy
          
          if (this.isValidPosition(newRow, newCol) && 
              this.board[newRow][newCol] === null) {
            return true
          }
        }
      }
      return false
    },

    isValidPosition(row, col) {
      return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize
    },

    pass() {
      this.passCount++
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black'
      
      // 如果连续两次过棋，游戏结束
      if (this.passCount >= 2) {
        // 实现终局计分
        this.calculateFinalScore()
      }
    },

    calculateFinalScore() {
      // 简单的终局计分逻辑
      // 这里可以根据需要实现更复杂的计分规则
      console.log('Game Over! Final Scores: Black:', this.blackScore, 'White:', this.whiteScore)
    },

    undo() {
      if (this.history.length > 0) {
        const lastState = this.history.pop()
        this.board = lastState.board
        this.currentPlayer = lastState.currentPlayer
        this.blackScore = lastState.blackScore
        this.whiteScore = lastState.whiteScore
        this.passCount = 0
      }
    },

    resetGame() {
      this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null))
      this.currentPlayer = 'black'
      this.history = []
      this.blackScore = 0
      this.whiteScore = 0
      this.lastMove = null
      this.passCount = 0
    }
  }
}) 