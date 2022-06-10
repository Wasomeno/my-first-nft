import React,{useEffect, useState} from "react";
import axios from "axios";
import {ethers} from "ethers";
import BeanzMarketplace from "./api/BeanzMarketplace.json";
import { useNavigate } from "react-router-dom";

const MarketplaceContract = "0x51e3E3d17980A6253DfA1F62325e736fc62F6Ff5";

const MarketplaceList = ({account}) => {
    const isConnected = Boolean(account[0]);
    const[beanzs, setBeanzs] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const[onSale, setOnSale] = useState("");
    const navigate = useNavigate();
    

    async function getBeanzOnSale() {
        let beanzs = [];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                MarketplaceContract,
                BeanzMarketplace.abi,
                signer,
            );
            const onSale = await contract.currentOnSale();
            setOnSale((onSale).toString());

            for(let i = 0; i < onSale ; i++) {
                let beanzOnSale = await contract.beanzId(i);
                const beanzAPI = await axios("https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/"+ beanzOnSale.toString());
                const beanzPrice = await contract.beanzOnSale(beanzOnSale);
                beanzs[i] = {...beanzAPI, beanzPrice};
            }
            setBeanzs(beanzs);
            setIsLoading(false);
    }

    useEffect(() => {
        getBeanzOnSale();
    },[])

    return(
        <div className="vh-100">
            <h1 id="marketplace-title" className="m-3 p-1">CoolBeanz Marketplace</h1>
            <div id="marketplace-subtitle" className="d-flex align-items-center">               
                <h2 className="p-1 m-2">Beanz on sale: {onSale}</h2> 
            </div>
            <hr>
            </hr>

            {isConnected ? (
                isLoading ? (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ): (
                    <div id="marketplace-items" className="d-flex m-2 rounded-3">
                        {beanzs[0] ? (
                            beanzs.map((beanz, index) => (
                        <div id="marketplace-card" key={index} className="card col-2 m-2 border-1 border-dark" onClick={() => navigate((beanz.data.name).slice(6, 7))}>
                            <img src={beanz.data.image} className="card-img-top p-2 " alt="..."/>
                                <div className="card-body">
                                     <h5 id="marketplace-card-title">{beanz.data.name}</h5>
                                     <div className="d-flex justify-content-center align-items-center">
                                         <img src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg" alt="eth" width="25px" className="p-1"/>
                                         <p id="marketplace-card-text" className="p-1 m-0">{(beanz.beanzPrice[0]).toString() / 10 ** 18}</p>
                                     </div>
                                </div>
                        </div>
                    )
                )
                ) : (
                    <div>
                        <h5>No beanz on sale</h5>
                    </div>
                )}
                </div>)
            ) : (
                <h5>Connect Your Wallet</h5>
            )}
        </div>
    )
}

export default MarketplaceList;