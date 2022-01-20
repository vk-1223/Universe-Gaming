// unique_id = 124;

// import {makeid} from "./utils"
const { makeid } = require("./utils");
const { initGame } = require("./constants");

// These are global vaiables
const state = {}; // it's uniqueness is defined by "roomName"
const clientRooms = {};

module.exports = (socket, io) => {
  // Here, client = socket
  const game_uid = 124;

  const create_new_room = (username) => {
    console.log("creating room for: ", socket.id);
    let roomName = makeid(5);

    clientRooms[socket.id] = roomName; // storing the game roomName in "clientRooms" global variable.
    state[roomName] = initGame(roomName); // storing the game state in "state" global variable.

    socket.join(roomName);

    if(state[roomName].players.length==0){
      state[roomName].players.push({})
    }
    state[roomName].players[0].player_id = socket.id; //setting the client id, in corresponding state for room.
    state[roomName].players[0].name = username;

    console.log("Player: "+socket.id+", created room: "+roomName);
    
    const roomState = state[roomName];
    // Sending the state of game to client
    socket.emit("init_game", JSON.stringify(roomState));
  };

  const join_room = (data) => {

    console.log(data);
    var roomName = data.roomName;
    var username = data.username;

    console.log(roomName+" "+username);

    // getting list of all clients in current room
    const allClients = io.sockets.adapter.rooms.get(roomName);
    
    if(!allClients){
      socket.emit('unknownCode');
      return;
    }

    var numClients = allClients.size;

    console.log(allClients);
    console.log(roomName+" "+numClients);
    console.log(state[roomName]);

    if (numClients === 0) {
      socket.emit('unknownCode');
      return;
    } else if (numClients > 1) {
      socket.emit('tooManyPlayers');
      return;
    }

    clientRooms[socket.id] = roomName;

    socket.join(roomName);

    if(state[roomName].players.length<=1){
      state[roomName].players.push({})
    }
    state[roomName].players[1].player_id = socket.id; //setting the client id, in corresponding state for room.
    state[roomName].players[1].name = username;

    const roomState = state[roomName];
    // Sending the state of game to client
    // socket.emit("init_game", JSON.stringify(roomState));

    console.log("Player: "+socket.id+", joined room: "+roomName);
    
    resetGameBoard(state[roomName]);
    startGame(roomName);
  }

  const startGame = (roomName) => {

    const roomState = state[roomName];
    
    // Starting the countdown for 10 seconds
    // var timer = 5;
    // var interval = setInterval(() => {
    //   // Sending this event to everyone in room, including the sender.
    //   io.sockets.in(roomName).emit('countDown', timer);  
    //   console.log(timer);
    //   timer--;
    //   if(timer==0){
    //     clearInterval(interval);
    //     console.log("cleared")
    //   }
    //   console.log("cleared")
    // }, 200);
    
    // Game started
    roomState.started = true; //This works fine, it changes at the main location of global state variable.
    
    var random = Math.floor(Math.random()*2);
    roomState.players[random].symbol = "X";
    roomState.players[(random+1)%2].symbol = "O";
    
    roomState.playerTurn = roomState.players[random].player_id;

    console.log(state[roomName]);
    io.sockets.in(roomName).emit("init_game", JSON.stringify(state[roomName]));
  }

  const handleGameClick = (data) => {
    data = JSON.parse(data);
    console.log(data);
    var {newBoard, row, col, symbol, roomName} = data;
    const rmName = clientRooms[socket.id];
    if(roomName!==rmName){
      return;
    }
    console.log("game click, socket: "+socket.id+" , room: "+roomName);
    console.log(newBoard);
    console.log(row+", "+col+", "+symbol);
    // console.log(gameState);
    if (!roomName) {
      return;
    }
    
    const currGameState = state[roomName];
    var currGameBoard = currGameState.board;

    if(currGameState.playerTurn!==socket.id){
      return;
    }
    if(currGameBoard[row][col]!=null && currGameBoard[row][col]!="null"){
      return;
    }
    var playerIndex = (currGameState.players[0].player_id===socket.id)? 0: 1;
    if(currGameState.players[playerIndex].symbol!==symbol){
      return;
    }

    currGameBoard[row][col] = symbol;
    currGameState.playerTurn = currGameState.players[(playerIndex+1)%2].player_id;
    console.log("Data sent");
    
    if(gameCheck(currGameState)){
      io.sockets.in(roomName).emit("gameOver", JSON.stringify(state[roomName]));
    }else{
      io.sockets.in(roomName).emit("init_game", JSON.stringify(state[roomName]));
      // io.sockets.in(room).emit('gameState', JSON.stringify(gameState)); 
    }
  }

  const gameCheck = (gameState) => {

    var x_id = null, o_id = null;
    var x_index = (gameState.players[0].symbol==="X")? 0: 1;
    var o_index = (gameState.players[0].symbol==="O")? 0: 1;
    x_id = gameState.players[x_index].player_id;
    o_id = gameState.players[o_index].player_id;

    var sym = "X";
    var board = gameState.board;
    console.log("board: "+board)
    if(checking_winner(board, sym)){
      gameState.winner = x_id;
      gameState.ended = true;
      gameState.playerTurn = null;
      return true;
    }
    sym = "O";
    if(checking_winner(board, sym)){
      gameState.winner = o_id;
      gameState.ended = true;
      gameState.playerTurn = null;
      return true;
    }
    var count = 0;
    for(var i=0; i<3; i++){
      for(var j=0; j<3; j++){
        if(board[i][j]==="X" || board[i][j]==="O") count++;
      }
    } 
    if(count===9){
      gameState.winner = null;
      gameState.ended = true;
      gameState.playerTurn = null;
      return true;
    }
    return false;
  }

  const checking_winner = (board, sym) => {
    for(var i=0; i<3; i++){
      var count = 0;
      for(var j=0; j<3; j++){
        if(board[i][j]===sym) count++;
      }
      if(count==3){
        return true;
      }
    }
    for(var i=0; i<3; i++){
      var count = 0;
      for(var j=0; j<3; j++){
        if(board[j][i]===sym) count++;
      }
      if(count==3){
        return true;
      }
    }
    var count = 0;
    for(var i=0; i<3; i++){
      if(board[i][i]==sym)count++;
    }
    if(count===3) return true;
    count = 0;
    for(var i=0; i<3; i++){
      if(board[i][2-i]==sym)count++;
    }
    if(count===3) return true;
  }

  const resetGameBoard = (roomState) => {
    // restart new game
    var board = roomState.board;
    for(var i=0; i<3; i++){
      for(var j=0; j<3; j++){
        board[i][j] = null;
      }
    }
    var currentPlayerIndex = (roomState.players[0].player_id===socket.id)? 0: 1;
    var otherPlayerIndex = (roomState.players[0].player_id===socket.id)? 1: 0;
    console.log("Setting new game state:")
    console.log(roomState);
    roomState.ended = false;
    roomState.players[currentPlayerIndex].again = false;
    roomState.players[otherPlayerIndex].again = false;
    roomState.winner = null;
    roomState.started = true;
    roomState.playerTurn = null;
  }

  const handlePlayAgain = (roomName) => {

    const roomState = state[roomName];    
    if(!roomState){
      return;
    }
    var currentPlayerIndex = (roomState.players[0].player_id===socket.id)? 0: 1;
    var otherPlayerIndex = (roomState.players[0].player_id===socket.id)? 1: 0;

    roomState.players[currentPlayerIndex].again = true;

    if(roomState.players[otherPlayerIndex].again===true){
      resetGameBoard(roomState);
      startGame(roomName);
    }else{
      // ask other player to click on play again button in chat
      var message = "Want to Play Again..";
      handleMessage(JSON.stringify({message, roomName}))
    }
  }

  const handleMessage = (data) => {
    var {message, roomName} = JSON.parse(data);
    var gameState = state[roomName];
    var Chat = gameState.chat;
    var ind = getPlayerIndex(gameState.players, socket.id);
    console.log(gameState);
    console.log(ind);
    // console.log(gameState.players[ind]);
    var newMessage = {
      socketId: socket.id,
      name: gameState.players[ind].name,
      message
    };
    // Chat = [...Chat, newMessage];
    Chat.push(newMessage)

    console.log(Chat)
    console.log(gameState);
    io.sockets.in(roomName).emit(`recieve_message_${game_uid}`, JSON.stringify({"Chats": Chat}));
  }

  const getPlayerIndex = (players, socketId) => {
    for(var i=0; i<players.length; i++){
      if(players[i].player_id===socketId){
        return i;
      }
    }
    return -1;
  }


  const emitGameState = (room, gameState) => {
    // Send this event to everyone in the room.
    io.sockets.in(room).emit('gameState', JSON.stringify(gameState));
  }
  
  const emitGameOver = (room, winner) => {
    // Send this event to everyone in the room.
    io.sockets.in(room).emit('gameOver', JSON.stringify({ winner }));
  }

  const disconnected = () => {
    var roomName = clientRooms[socket.id];
    if(!roomName){
      return;
    }
    // console.log(roomName)
    var gameState = state[roomName];
    if(!gameState){
      return;
    }
    // console.log(gameState)

    var index = getPlayerIndex(gameState.players, socket.id);
    gameState.players.splice(index, 1);
    io.sockets.in(roomName).emit("init_game", JSON.stringify(gameState));
  }
  
  
  socket.on('disconnect', disconnected);
  socket.on(`create_room_${game_uid}`, create_new_room);
  socket.on(`join_room_${game_uid}`, join_room);
  socket.on(`game_click_${game_uid}`, handleGameClick);
  socket.on(`play_again_${game_uid}`, handlePlayAgain);
  socket.on(`append_message_${game_uid}`, handleMessage);
};
