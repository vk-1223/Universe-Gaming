import React from 'react'
import { SocketContext } from "../../context/Socket/socket.js";
import "./Players.css"

const Players = ({ gameState }) => {

    const socket = React.useContext(SocketContext);

    return (
        <>
            <div className="players_box">
                <h4 className='heading'>Players Online</h4>
                <div className='players_list'>
                    {gameState.players.map((current) => {
                        return (
                            <div className={current.player_id === gameState.playerTurn ? "current_turn single_player" : "single_player"}>
                                {current.name}
                                {current.player_id === socket.id && (<span className="your_name">(YOU)</span>)}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <button onClick={()=>{window.location.reload()}} className='leave_room_btn'>Leave Room</button>
                </div>
            </div>
        </>
    )
}

export default Players
