import React from "react";
import io from "socket.io-client";

// const socket = io("http://localhost:9000");
const socket = io("/");
const SocketContext = React.createContext(socket);

export {socket, SocketContext};