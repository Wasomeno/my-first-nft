import React, {useEffect, useState} from "react";
import {Contract, ethers} from "ethers";
import axios from "axios";

import BeanzStaking from "./api/BeanzStaking.json";
import CoolBeanz from './api/BeanzNFT.json';
import { toast } from "react-toastify";

const BeanzContract = "0x2eDBDa7361A09B7ebC26b91dBB7432605fb8e0f1";

const StakingContract = "0x10Dda5bEAefCeFDB4869dCe37efdccd1dbaF491C";

const StakedBeanz = () => {
    const [stakedBeanz, setStakedBeanz] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let myStakedBeanz = [];
    let beanzId = []
    async function unstakeBeanz(_beanzId) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const stakingContract = new ethers.Contract(
                StakingContract,
                BeanzStaking.abi,
                signer,
        );

        const beanzContract = new ethers.Contract(
            BeanzContract,
            CoolBeanz.abi,
            signer,
        );

        try {
            const address = await signer.getAddress();
            const response = await toast.promise(stakingContract.beanzGoHome(address, _beanzId), {
                pending: 'Bringing beanz #'+_beanzId+' home ...',
                success: 'Transaction sent! waiting for confirmation...',
                error: {
                    render({data}) {
                        return (data.message).slice(20);
                    }
                }
            });
            console.log(response);
        } catch(error) {
            console.log(error);
        }
    }

    async function getStakedBeanz() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const stakingContract = new ethers.Contract(
                StakingContract,
                BeanzStaking.abi,
                signer,
        );

        const address = await signer.getAddress();
        const stakedLength = await stakingContract.stakedArrayLength(address);
        ;
        let p = 0;
        for(let i = 0; i < stakedLength; i++) {
            myStakedBeanz[i] = await stakingContract.addressToStaked(address,i);
            beanzId[p] =  await axios("https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/"+ myStakedBeanz[i]);
            p++;    
        }
        setStakedBeanz(beanzId);
        setIsLoading(false);
    }

    useEffect(() => {
        getStakedBeanz();
        if(window.ethereum) {
            window.ethereum.on('chainChanged', () => {
              window.location.reload();
            })
            window.ethereum.on('accountsChanged', () => {
              window.location.reload();
            })
        }
    }, [])

    return(
            <div className="d-flex justify-content-center g-0 flex-wrap align-items-center">
            {stakedBeanz[0] ? (
                stakedBeanz.map((beanz, index) => (
                    <div key={index} className="card col-3 m-1">
                        <img src={beanz.data.image} className="card-img-top p-2" alt="..."/>
                            <div className="card-body">
                                <h5 id="staked-card-title">{beanz.data.name}</h5>
                            </div>
                            <button id={"stake-button" + index} onClick={() => unstakeBeanz((beanz.data.name).slice(6, 7))} className="btn btn-danger">Go Home</button>
                            <img id="staked-icon" src="/chicken.gif" alt="chicken" width="35%"/>
                    </div>
                ))
            ) : (
                isLoading ? (
                    <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <h5>You don't have any beanz on adventure</h5>
                )
                
            )}
            </div>
        
    )
}

export default StakedBeanz;