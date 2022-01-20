
const initGame = (roomName) => {
  const state = createGameState(roomName)
  return state;
}

// Schema of players array in state.....
// {
//   player_id: null,
//   symbol: null,
//   name: null,
//   again: false
// }, {
//   player_id: null,
//   symbol: null,
//   name: null,
//   again: false
// }

const createGameState = (roomName) => {
  return {
    players: [],
    roomName: roomName,
    board: [[null, null, null],
        [null, null, null],
        [null, null, null]],
    playerTurn: null,
    winner: null,
    started: false,
    ended: false,
    chat: []
  };
}

module.exports = {
    initGame
}