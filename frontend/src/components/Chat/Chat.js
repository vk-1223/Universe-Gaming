import React, { useEffect, useRef, useState } from 'react'
import { SocketContext } from "../../context/Socket/socket.js";
import "./Chat.css"

const Chat = ({ roomName, game_uid, Chats }) => {

    const socket = React.useContext(SocketContext);

    const [message, setMessage] = useState("");
    const [allMsgs, setAllMsgs] = useState([]);
    const [unreadMsg, setUnreadMsg] = useState(0);
    const chatRef = useRef(null)

    const sendMessage = (e) => {
        e.preventDefault();
        send_msg_to_server()
    }
    const send_msg_to_server = () => {
        if (message === "") {
            return;
        }
        socket.emit(`append_message_${game_uid}`, JSON.stringify({ message, roomName }));
        setMessage("");
    }

    const msgRecieved = (data) => {
        data = JSON.parse(data);
        var Chat = data.Chats;

        if(Chat.length===0){
            return;
        }

        if(chatRef.current.style.visibility === "visible" || Chat[Chat.length-1].socketId===socket.id){
            setUnreadMsg(0);
        }else{
            setUnreadMsg((prevVal) => prevVal + 1);
        }

        setAllMsgs(Chat);
    }

    const handleOnChange = (e) => {
        setMessage(e.target.value);
    }

    useEffect(() => {

        msgRecieved(JSON.stringify({"Chats": Chats}));

        // all the listeners
        socket.on(`recieve_message_${game_uid}`, msgRecieved);
        
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.off(`recieve_message_${game_uid}`, msgRecieved);
        };
    }, [])

    return (
        <div>

            <a class="toggle_chat" data-bs-toggle="offcanvas" href="#offcanvasRight" aria-controls="offcanvasRight" onClick={(e)=>{setUnreadMsg(0)}}>
                <img src="./images/chat.png" alt="" class="toggle_chat_image position-relative" />
                {unreadMsg !== 0 &&
                    <span class="translate-middle badge rounded-pill bg-danger toggle_chat_unread">
                        {unreadMsg}
                        <span class="visually-hidden">unread messages</span>
                    </span>
                }
            </a>

            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" ref={chatRef}>
                <div class="offcanvas-header">
                    <h5 id="offcanvasRightLabel">Chat</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">

                    <div class="msg_display_box">
                        {allMsgs.map((current) => {
                            return (<div className={current.socketId === socket.id ? "single_message_right single_message" : "single_message_left single_message"} >
                                <div className="message_owner">{current.name}</div>
                                {/* <hr/> */}
                                <div id="message">
                                    {current.message}
                                </div>
                            </div>)
                        })
                        }
                    </div>
                    <form className="msg_send_box">
                        <input type="text" name="" id="" className="msg_send_input" value={message} onChange={handleOnChange} />
                        <button className="msg_send_btn" onClick={sendMessage}><img src="./images/send-message.png" alt="" class="image_icon" /></button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Chat
