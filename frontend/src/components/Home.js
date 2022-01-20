import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Games from './Games'
import Navbar from './Navbar'
import Game from './tic-tac-toe/Game';

const Home = () => {
    return (    
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Games />}> </Route>
                <Route path="/games" element={<Games />}> </Route>
                <Route path="/tic-tac-toe" element={<Game />}> </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Home
