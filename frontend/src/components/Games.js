import React, {useContext} from 'react'
import { Link } from "react-router-dom";
import roomContext from '../context/Room/roomContext';

const Games = () => {

    const context = useContext(roomContext);
    const {inRoom} = context;

    return (
        <>
            {inRoom && window.location.reload()}

            <div className="container mt-5">
                <h3>Play Games:</h3>
                <div className="row">
                    <div className="card col-md-4 m-3 p-0" style={{width: "18rem"}}>
                        <img src="./images/tic_tac_toe.jpg" className="card-img-top" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title">Play Tic-Tac-Toe</h5>
                                <p className="card-text">Play multiplayer tic-tac-toe game with your friends online.</p>
                                <Link to="/tic-tac-toe" className="btn btn-success">Play</Link>
                            </div>
                    </div>
                    <div className="card col-md-4 m-3 p-0" style={{width: "18rem"}}>
                        <img src="./images/coming_soon.jpg" className="card-img-top" alt="..."/>
                            <div className="card-body">
                            <h5 className="card-title">Coming Soon</h5>
                                <p className="card-text">More Games coming soon</p>
                                <button type="button" className="btn btn-success" disabled>Coming Soon</button>
                                
                            </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Games
