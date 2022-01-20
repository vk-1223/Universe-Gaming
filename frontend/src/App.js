import './App.css';
import Home from './components/Home';
import {SocketContext, socket } from "./context/Socket/socket";
import RoomState from './context/Room/RoomState';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <RoomState>
      <div className="App">
        {/* <header className="App-header"> */}

          <Home />
        {/* </header> */}
      </div>
      </RoomState>
    </SocketContext.Provider>
  );
}

export default App;
