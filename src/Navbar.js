import React from "react";
import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({account, setAccount}) => {
    const isConnected = Boolean(account[0]);

    async function connectAccount() {
        if(window.ethereum) {
            const account = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(account);
        }
    }

    return(
        <>
            <div id="navbar" className="d-flex align-items-center justify-content-center">
                <Link id="navbar-link" to="/" className="col-2">Home</Link>
                <Link id="navbar-link" to="/staking" className="col-2">Staking</Link>
                <Link id="navbar-link" to="/marketplace" className="col-2">Marketplace</Link>
                <Link id="navbar-link" to="/inventory" className="col-2">Your Beanz</Link>
                {isConnected ? (<h5 id="connected"className="btn col-2 m-0">{account[0].slice(0,6) + "..." + account[0].slice(36,42)}</h5>)
                :(<button id="connect-button" href="about" onClick={connectAccount} className="col-2 btn m-0">Connect</button>)}
            </div>
            <Outlet/>
        </>
        
    )
}

export default Navbar;