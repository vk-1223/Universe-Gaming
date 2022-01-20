import roomContext from "./roomContext";
import React from 'react'
import { useState } from "react";
import { SocketContext } from "../Socket/socket";

const RoomState = (props) => {

    const socket = React.useContext(SocketContext);

    const [game_uid, setGame_uid] = useState(null);
    
    const [roomName, setRoomName] = useState("");
    const [roomnameAlert, setRoomnameAlert] = useState(null);
    const [inRoom, setInRoom] = useState(false);
    const [roomLimit, setRoomLimit] = useState(null);
    const [username, setUsername] = useState("")
    const [usernameAlert, setUsernameAlert] = useState(null);
    
    const createRoom = () => {
        setUsernameAlert(null);
        if(username==null || username==""){
            setUsernameAlert("user name connot be empty")
            return;
        }
        if(username.length<3){
            setUsernameAlert("Length of username connot be less than 3")
            return;
        }
        if(username.length>20){
            setUsernameAlert("Length of username connot be more than 20")
            return;
        }
        console.log("connecting to server to create room")
        socket.emit(`create_room_${game_uid}`, username)
    }

    const joinRoom = () => {
        setUsernameAlert(null);
        if(username==null || username==""){
            setUsernameAlert("user name connot be empty")
            return;
        }
        if(username.length<3){
            setUsernameAlert("Length of username connot be less than 3")
            return;
        }
        if(username.length>20){
            setUsernameAlert("Length of username connot be more than 20")
            return;
        }
        if(roomName==null || roomName==""){
            setRoomnameAlert("Room name connot be empty");
            return;
        }
        socket.emit(`join_room_${game_uid}`, {roomName, username});
    }

    return (
        // <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
        <roomContext.Provider value={{game_uid, setGame_uid, roomName, setRoomName, roomnameAlert, setRoomnameAlert, inRoom, setInRoom, roomLimit, setRoomLimit, username, setUsername, usernameAlert, setUsernameAlert, createRoom, joinRoom}}>
            {props.children}
        </roomContext.Provider>
    )
}

export default RoomState;