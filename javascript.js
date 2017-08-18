var board = [[null, null, null], [null, null, null], [null, null, null]]

var myMove = false

var userFig, AIFig

var modal = document.getElementById('myModal')

if (myMove) {
  makeMove()
}

function restartGame () {
  modal.style.display = 'flex'

  board = [[null, null, null], [null, null, null], [null, null, null]]

  myMove = false

  updateMove()

  enable()
}

$(document).ready(function () {
  $('button').click(function () {
    var cell = $(this).attr('id')
    var row = parseInt(cell[1])
    var col = parseInt(cell[2])

    if (!myMove) {
      board[row][col] = false

      myMove = true

      updateMove()

      makeMove()
    }
  })

  $('#restart').click(restartGame)
})

function updateMove() {
  updateButtons()

  var winner = getWinner(board)

  disable(board, winner)

  $('#winner').text(
    winner === 1
      ? 'AI Won!'
      : winner === 0 ? 'You Won!' : winner === -1 ? 'Tie!' : ''
  )
  $('#move').text(myMove ? "AI's Move" : 'Your Move')
}

function disable (board, winner) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var id = 'c' + i + '' + j
      if (board[i][j] !== null) {
        document.getElementById(id).disabled = true
      } else if (winner) {
        document.getElementById(id).disabled = true
      }
    }
  }
}

function enable () {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var id = 'c' + i + '' + j
      document.getElementById(id).disabled = false
    }
  }
}

function getWinner (board) {
  var vals = [true, false]

  var allNotNull = true

  for (var i = 0; i < vals.length; i++) {
    var value = vals[i]

    var diagonalComplete1 = true

    var diagonalComplete2 = true

    for (var j = 0; j < 3; j++) {
      if (board[j][j] !== value) {
        diagonalComplete1 = false
      }

      if (board[2 - j][j] !== value) {
        diagonalComplete2 = false
      }

      var rowComplete = true

      var colComplete = true

      for (var k = 0; k < 3; k++) {
        if (board[j][k] !== value) {
          rowComplete = false
        }

        if (board[k][j] !== value) {
          colComplete = false
        }

        if (board[j][k] === null) {
          allNotNull = false
        }
      }

      if (rowComplete || colComplete) {
        return value ? 1 : 0
      }
    }

    if (diagonalComplete1 || diagonalComplete2) {
      return value ? 1 : 0
    }
  }

  if (allNotNull) {
    return -1
  }
  return null
}

function setFig (id) {
  modal.style.display = 'none'
  userFig = id
  if (id === 'o') {
    AIFig = 'x'
  } else {
    AIFig = 'o'
  }
}

function updateButtons () {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      $('#c' + i + '' + j).text(
        board[i][j] === false ? userFig : board[i][j] === true ? AIFig : ''
      )
    }
  }
}

function makeMove () {
  board = minimaxMove(board)

  console.log(numNodes)

  myMove = false

  updateMove()
}

function minimaxMove (board) {
  numNodes = 0

  return recurseMinimax(board, true)[1]
}

var numNodes = 0

function recurseMinimax (board, player) {
  numNodes++
  var winner = getWinner(board)

  if (winner !== null) {
    switch (winner) {
      case 1:
        return [1, board]
      case 0:
        return [-1, board]
      case -1:
        return [0, board]
    }
  } else {
    var nextVal = null
    var nextBoard = null

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = player

          var value = recurseMinimax(board, !player)[0]

          if (
            (player && (nextVal === null || value > nextVal)) ||
            (!player && (nextVal === null || value < nextVal))
          ) {
            nextBoard = board.map(function (arr) {
              return arr.slice()
            })

            nextVal = value
          }

          board[i][j] = null
        }
      }
    }

    return [nextVal, nextBoard]
  }
}

updateMove()
