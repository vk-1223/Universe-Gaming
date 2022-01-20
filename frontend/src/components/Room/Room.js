import React, {useContext} from 'react'
import roomContext from '../../context/Room/roomContext';

const Room = () => {

    const context = useContext(roomContext);
    const {game_uid, setGame_uid, roomName, setRoomName, roomnameAlert, setRoomnameAlert, inRoom, setInRoom, roomLimit, setRoomLimit, username, setUsername, usernameAlert, setUsernameAlert, createRoom, joinRoom} = context;

    const newGame = () => {
        createRoom();
    }

    const handleJoinGame = (e) => {
        e.preventDefault();
        joinRoom();
    }
    
    const onChange = (e) => {
        setRoomName(e.target.value)
    }

    const onNameChange = (e) => {
        setUsername(e.target.value)
    }

    return (
        <div className="room_box">
            <form className="mt-4">
                <input type="text" className="form-control p-3" id="title" name="roomName" value={username} onChange={onNameChange} required placeholder='Enter your Name' />
                {usernameAlert !== null && (
                    <div className="error">{usernameAlert}</div>
                )}
            </form>
            <hr />
            <button className="btn btn-success px-4 py-3 mb-4" onClick={newGame}>Create Room</button>
            <br />
            <div>OR</div>
            <br />
            <form className="">
                <input type="text" className="form-control p-3" id="title" name="roomName" value={roomName} onChange={onChange} required placeholder="Enter room name" />
                {roomnameAlert !== null && (
                    <div className="error">{roomnameAlert}</div>
                )}
                <button className="btn btn-success my-2 px-4 py-3" onClick={handleJoinGame}>Join Game</button>
            </form>
        </div>
    )
}

export default Room
