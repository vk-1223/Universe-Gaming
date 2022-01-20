import React, {useContext} from 'react'
import { Link } from "react-router-dom";
import roomContext from '../context/Room/roomContext';

const Navbar = () => {

    const context = useContext(roomContext);
    const {inRoom} = context;

    return (
        <>
            {!inRoom && (<div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div class="container-fluid">
                        <Link class="navbar-brand" to="/">Game Zone</Link>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/games">Play Game</Link>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" href="https://github.com/vk-1223/Universe-Gaming" target="_blank">Github <img src="./images/github.png" style={{width: "23px", height: "23px"}} alt="" /> </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>)}
        </>
    )
}

export default Navbar
