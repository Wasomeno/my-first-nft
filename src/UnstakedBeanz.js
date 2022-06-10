import React, {useEffect, useState} from "react";
import axios from "axios";
import {ethers} from "ethers";
import { toast } from 'react-toastify';
import { Link,Outlet, useNavigate } from "react-router-dom";

import StakeBeanz from "./api/BeanzStaking.json";
import CoolBeanz from './api/BeanzNFT.json';
import GetHash from "./HashToast";

const BeanzContract = "0x2eDBDa7361A09B7ebC26b91dBB7432605fb8e0f1";
const StakingContract = "0x10Dda5bEAefCeFDB4869dCe37efdccd1dbaF491C";

const UnstakedBeanz = () => {
    const [beanzs, setBeanzs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    let beanz = [];
    let beanzId= [];
    let approved;

    async function stakeBeanz(_beanzId) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const stakingContract = new ethers.Contract(
                StakingContract,
                StakeBeanz.abi,
                signer,
        );

        const beanzContract = new ethers.Contract(
            BeanzContract,
            CoolBeanz.abi,
            signer,
        );

        approved = await beanzContract.getApproved(_beanzId);

        if (approved === StakingContract) {
            try {
                const response = await toast.promise( stakingContract.beanzAdventure(_beanzId), {
                    pending: 'Sending beanz #'+_beanzId+' to adventure ...',
                    success: 'Transaction sent! waiting for confirmation...',
                    error: 'Transaction Rejected'
                });
                console.log(response);
            } catch(error) {
                console.log(error);
            }
        } else {
            try {
                await toast.promise(beanzContract.approve(StakingContract, _beanzId), {
                    pending: 'Approving beanz ...',
                    success: 'Transaction sent! waiting for confirmation...',
                    error: 'Transaction Rejected '
                });
            } catch(error) {
                console.log(error);
            }
        }
    }
    
    async function getUnstaked() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                BeanzContract,
                CoolBeanz.abi,
                signer,
            );
        
        const unstaked = await contract.getBeanzOwner(signer.getAddress());

        for(let i = 0; i < unstaked.length ; i++) {
            beanzId[i] = unstaked[i];
            beanz[i] = await axios("https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/"+ beanzId[i].toString());       
        }
        setBeanzs(beanz);
        setIsLoading(false);
    }

    useEffect(() => {
        getUnstaked();
    }, [isLoading])

    return(
            <div>
                    <div className="d-flex justify-content-center m-2 g-0">
                    {beanzs[0] ? (
                        beanzs.map((beanz, index) => (
                            <div id="unstaked-card" key={index} className="card col-3 m-1">
                                <img src={beanz.data.image} className="card-img-top p-2" alt="..."/>
                                    <div className="card-body" onClick={() => navigate( "/inventory/"+ (beanz.data.name).slice(6, 7))}>
                                        <h5 id="inventory-card-title">{beanz.data.name}</h5>
                                    </div>
                                    <img id="stake-button" onClick={() => stakeBeanz((beanz.data.name).slice(6, 7))} src="/adventure-game.png" alt="adventure-icon" width="60px"/>
                            </div>
                        ))
                    ) : (
                        isLoading ? (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                        <div>
                            <h5>You don't have a CoolBeanz</h5>
                        </div>
                        )
                        
                    )}
                    
                    </div>
            </div>
        )
    }




export default UnstakedBeanz;