import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

import BeanzMarketplace from "./api/BeanzMarketplace.json";

import { useParams } from "react-router-dom";
import { getAddress } from "ethers/lib/utils";

const MarketplaceContract = "0x51e3E3d17980A6253DfA1F62325e736fc62F6Ff5";

const MarketplaceItem = ({account}) => {
    const isConnected = Boolean(account[0]);
    const[beanzDetail, setBeanzDetail] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();

    let beanz;
    let beanzPrice;
    // let beanzOffer;
    let beanzCombine;
    let address;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                MarketplaceContract,
                BeanzMarketplace.abi,
                signer,
            );

    async function buy() {
        try{
            await contract.buyBeanz(id,signer.getAddress(), {value: beanzDetail.beanzPrice[0]});
        } catch (error) {
            console.log(error)
        }
    }

    async function getBeanzDetails() {
        await axios.get('https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/'+id)
        .then(response => {
          beanz = response.data;
        })

        await contract.beanzOnSale(id)
        .then(response => {
            beanzPrice = response;
        });


        beanzCombine = {...beanz, beanzPrice};

        setBeanzDetail(beanzCombine);
        
        setIsLoading(false);
    }

    useEffect(() => {
        getBeanzDetails();
    },[isLoading])

    return(
        <div className="d-flex p-2 m-2 justify-content-center">
            {isConnected ? (
                isLoading ? (
                    <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                    </div>
                ):(
                    <>
                        <div className="col-6">
                <img src={beanzDetail.image} alt="beanz" width="75%"/>
            </div>

            <div className="col-6 bg-white">
                <h5 className="m-3">{beanzDetail.name}</h5>
                {(beanzDetail.beanzPrice.owner).toLowerCase() === account[0] ? (
                    <div className="d-flex align-items-center justify-content-center">
                        <h5>Owned by You</h5>
                    </div>
                ) : (
                    <div className="d-flex flex-wrap align-items-center justify-content-evenly">
                    <div className="col-2 d-flex">
                    <img src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg" alt="eth" width="25px" className="p-1"/>
                    <h4 className="m-2">{(beanzDetail.beanzPrice[0]).toString() / 10 ** 18}</h4>
                    </div>
                    <button className="btn btn-primary col-2" onClick={() => buy()}>Buy</button>
                    <div className="col-10 m-3">
                        <h6>Owned by:</h6>
                        <h6>{beanzDetail.beanzPrice.owner}</h6>
                    </div>
                    </div>
                )} 
            </div>
                    </>
                )) : (
                <h5>Connect Your Wallet</h5>
            )}
            
        </div>
    )
}

export default MarketplaceItem;