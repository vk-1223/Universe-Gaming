import React, { useEffect, useRef, useState, useContext } from 'react'
import "./Game.css"
import { SocketContext } from "../../context/Socket/socket.js";
import Chat from '../Chat/Chat';
import Players from '../Players/Players';
import roomContext from '../../context/Room/roomContext';
import Room from '../Room/Room';

const Game = () => {

    const socket = useContext(SocketContext);

    const context = useContext(roomContext);
    const {game_uid, setGame_uid, roomName, setRoomName, roomnameAlert, setRoomnameAlert, inRoom, setInRoom, roomLimit, setRoomLimit, username, setUsername, usernameAlert, setUsernameAlert, createRoom, joinRoom} = context;

    setGame_uid(124);
    setRoomLimit(2);

    const [gameStarted, setGameStarted] = useState(false);
    const [isTurn, setIsTurn] = useState(false);
    const [gameMsg, setGameMsg] = useState("")
    const [board, setBoard] = useState([[null, null, null], [null, null, null], [null, null, null]]);
    const [gameState, setGameState] = useState(null);
    const [gameEnded, setGameEnded] = useState(null);
    const [gameVerdict, setGameVerdict] = useState("");
    const [playAgainVal, setPlayAgainVal] = useState("Play Again");

    const handleInit = (state) => {
        state = JSON.parse(state);
        setGameState(state);

        // showing the game screen
        setRoomName(state.roomName)
        setInRoom(true);
        setBoard(state.board)
        setGameEnded(state.ended)

        const playerInd = (state.players[0].player_id === socket.id) ? 0 : 1;
        if (state.playerTurn === socket.id) {
            setGameMsg(`Your Turn = ${state.players[playerInd].symbol}`);
        } else {
            setGameMsg("Other Player's Turn");
        }
        if (state.started) {
            setGameStarted(true);
        }
    }

    const handleOnClick = (row, col) => {
        const newBoard = board;
        if (newBoard[row][col] == 'X' || newBoard[row][col] == 'Y' || newBoard[row][col] != null) {
            return;
        }
        if (gameState.playerTurn !== socket.id) {
            return;
        }
        if (newBoard[row][col] == null || newBoard[row][col] == "null") {
            const playerInd = (gameState.players[0].player_id === socket.id) ? 0 : 1;
            newBoard[row][col] = gameState.players[playerInd].symbol;
            setBoard(newBoard);
            socket.emit(`game_click_${game_uid}`, JSON.stringify({ newBoard, row, col, symbol: gameState.players[playerInd].symbol, roomName }));
        } else {
            return;
        }
    }

    const handleGameOver = (state) => {
        state = JSON.parse(state);
        setGameState(state);

        // showing the game screen
        setRoomName(state.roomName)
        setInRoom(true);
        setBoard(state.board)
        setGameMsg("Game Ended");
        setGameEnded(true);
        setPlayAgainVal("Play Again")
        if (state.winner === socket.id) {
            setGameVerdict("You Won!!")
        } else if (state.winner === null) {
            setGameVerdict("Game Tied!!")
        } else {
            setGameVerdict("You Lose!!")
        }
    }

    const handleUnknownCode = () => {
        setRoomnameAlert("Unknown room code");
    }
    
    const handleTooManyPlayers = () => {
        setRoomnameAlert("Already too many players in room");
    }

    const showCountDown = (timer) => {
        setGameMsg(`Game Starts in: ${timer}`)
    }

    useEffect(() => {
        // all the listeners
        socket.on('init_game', handleInit);
        socket.on('gameOver', handleGameOver);
        socket.on('unknownCode', handleUnknownCode);
        socket.on('tooManyPlayers', handleTooManyPlayers);
        socket.on('countDown', showCountDown);

        return () => {
            // before the component is destroyed unbind all event handlers used in this component
            socket.off('init_game', handleInit);
            socket.off('gameOver', handleGameOver);
            socket.off('unknownCode', handleUnknownCode);
            socket.off('tooManyPlayers', handleTooManyPlayers);
            socket.off('countDown', showCountDown);
        };
    }, [])

    socket.on('disconnect', () => {
        socket.removeAllListeners();
    });


    const handlePlayAgain = (e) => {
        e.preventDefault();
        setPlayAgainVal("Asking..");
        socket.emit(`play_again_${game_uid}`, roomName);
    }

    const init = () => {
        // showing the game screen
        setInRoom(true);
    }

    return (
        <div>
            <div className="container main_container">
                <h1 className="game_name">Tic-Tac-Toe</h1>

                {!inRoom && <Room/>}

                {inRoom && (<div class="row game_players_div">
                    <div className="game_box col-md-6">
                        <div className="display_room">Room Code: <span className='display_room_code'>{roomName}</span>
                            <i className="fa fa-copy copy_icon" onClick={() => {navigator.clipboard.writeText(roomName)}}></i>
                        </div>
                        {!gameStarted && (<h4>Waiting for other player to join</h4>)}

                        {gameStarted && (
                            <>
                                <div class="game_message">{gameMsg}</div>
                                <div className="game_board">
                                    {board.map((row, rowIdx) => {
                                        return (<>
                                            <div class="row board_row">
                                                {
                                                    row.map((col, colIdx) => {
                                                        return (<>
                                                            <div className="col-sm-4 board-cell" id={`loc_${rowIdx}${colIdx}`} onClick={() => handleOnClick(rowIdx, colIdx)} >
                                                                {(col) ? col : " "}
                                                            </div>
                                                        </>)
                                                    })
                                                }
                                            </div>
                                        </>)
                                    })
                                    }
                                </div>
                                {gameEnded && (
                                    <>
                                        <div className="game_verdict">{gameVerdict}</div>
                                        <button className="btn px-4 py-2 mt-3 play_again_btn" onClick={handlePlayAgain}>{playAgainVal}</button>
                                    </>
                                )}
                            </>
                        )
                        }
                        
                        <Chat roomName={roomName} game_uid={game_uid} Chats={gameState.chat} />
                    </div>
                    <div className="col-md-6">
                        <Players gameState={gameState}/>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Game
