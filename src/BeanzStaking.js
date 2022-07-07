import React, { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import StakingABI from "./api/BeanzStaking.json";
import BeanzABI from "./api/BeanzNFT.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BeanzContract = "0x2eDBDa7361A09B7ebC26b91dBB7432605fb8e0f1";

const StakingContract = "0x10Dda5bEAefCeFDB4869dCe37efdccd1dbaF491C";

const BeanzStaking = ({ account }) => {
  const isConnected = Boolean(account[0]);
  const [stakedBeanz, setStakedBeanz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [beanzs, setBeanzs] = useState([]);
  const navigate = useNavigate();
  let beanz = [];
  let approved;
  let myStakedBeanz = [];

  async function unstakeBeanz(_beanzId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(
      StakingContract,
      StakingABI.abi,
      signer
    );

    try {
      const address = await signer.getAddress();
      await toast
        .promise(stakingContract.beanzGoHome(address, _beanzId), {
          pending: "Bringing beanz #" + _beanzId + " home...",
          success: "Beanz #" + _beanzId + " is ready to go home!",
          error: {
            render({ data }) {
              return data.message.slice(20);
            },
          },
        })
        .then((response) => {
          toast
            .promise(provider.waitForTransaction(response.hash), {
              pending: "Beanz #" + _beanzId + " on the way home...",
              success: "Your beanz is back from adventure !",
              error: {
                render({ data }) {
                  return data.message.slice(20);
                },
              },
            })
            .then(() => {
              getStakedBeanz();
              getUnstaked();
            });
          getStakedBeanz();
          getUnstaked();
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function getStakedBeanz() {
    let beanzId = [];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(
      StakingContract,
      StakingABI.abi,
      signer
    );

    const address = await signer.getAddress();
    const stakedLength = await stakingContract.stakedArrayLength(address);
    let p = 0;
    for (let i = 0; i < stakedLength; i++) {
      myStakedBeanz[i] = await stakingContract.addressToStaked(address, i);
      beanzId[p] = await axios(
        "https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/" +
          myStakedBeanz[i]
      );
      p++;
    }
    setStakedBeanz(beanzId);
    setIsLoading(false);
    console.log(p);
  }

  async function stakeBeanz(_beanzId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(
      StakingContract,
      StakingABI.abi,
      signer
    );

    const beanzContract = new ethers.Contract(
      BeanzContract,
      BeanzABI.abi,
      signer
    );

    approved = await beanzContract.getApproved(_beanzId);

    if (approved === StakingContract) {
      try {
        await toast
          .promise(stakingContract.beanzAdventure(_beanzId), {
            pending: "Sending beanz #" + _beanzId + " to adventure ...",
            success: "Beanz #" + _beanzId + " ready for adventure!",
            error: "Transaction Rejected",
          })
          .then((response) => {
            toast
              .promise(provider.waitForTransaction(response.hash), {
                pending: "Beanz #" + _beanzId + " is on his way...",
                success: "Your beanz is on adventure ! ",
                error: "Transaction Failed",
              })
              .then(() => {
                getStakedBeanz();
                getUnstaked();
              });
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await toast.promise(beanzContract.approve(StakingContract, _beanzId), {
          pending: "Approving beanz ...",
          success: "Transaction sent! waiting for confirmation...",
          error: "Transaction Rejected ",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getUnstaked() {
    let beanzId = [];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(BeanzContract, BeanzABI.abi, signer);

    const unstaked = await contract.getBeanzOwner(signer.getAddress());

    for (let i = 0; i < unstaked.length; i++) {
      beanzId[i] = unstaked[i];
      beanz[i] = await axios(
        "https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/" +
          beanzId[i].toString()
      );
    }
    setBeanzs(beanz);
    setIsLoading(false);
  }

  useEffect(() => {
    getStakedBeanz();
    getUnstaked();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }, [isConnected]);
  return (
    <div className="h-75">
      <Helmet>
        <title>Beanz Staking</title>
        <link rel="shortcut icon" href="coolbeanz.png" />
      </Helmet>
      {isConnected ? (
        <div className="row justify-content-evenly align-items-center m-2">
          <h1 id="staking-title" className="p-2 m-2">
            Beanz Adventure
          </h1>

          <div className="unstaked col-5 d-flex flex-column align-items-center">
            <h2 id="staking-subtitle" className="p-2 m-2 col-4">
              Your Beanz
            </h2>
            <div className="d-flex justify-content-center m-2 g-0">
              {beanzs[0] ? (
                beanzs.map((beanz, index) => (
                  <div
                    id="unstaked-card"
                    key={index}
                    className="card col-3 m-1"
                  >
                    <img
                      src={beanz.data.image}
                      className="card-img-top p-2"
                      alt="..."
                    />
                    <div
                      className="card-body"
                      onClick={() =>
                        navigate("/inventory/" + beanz.data.name.slice(6, 7))
                      }
                    >
                      <h5 id="inventory-card-title">{beanz.data.name}</h5>
                    </div>
                    <img
                      id="stake-button"
                      onClick={() => stakeBeanz(beanz.data.name.slice(6, 7))}
                      src="/adventure-game.png"
                      alt="adventure-icon"
                      width="60px"
                    />
                  </div>
                ))
              ) : isLoading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <div>
                  <h5>You don't have a CoolBeanz</h5>
                </div>
              )}
            </div>
          </div>

          <div className="col d-flex justify-content-center align-items-center">
            <h2 id="arrow"> {">"} </h2>
          </div>

          <div className="staked col-5 d-flex flex-column align-items-center">
            <h2 id="staking-subtitle" className="p-2 m-2 col-6">
              Beanz on Adventure
            </h2>
            <div className="d-flex justify-content-center flex-wrap align-items-center">
              {stakedBeanz[0] ? (
                stakedBeanz.map((beanz, index) => (
                  <div key={index} className="card col-3 mx-3">
                    <img
                      src={beanz.data.image}
                      className="card-img-top p-2"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 id="staked-card-title">{beanz.data.name}</h5>
                    </div>
                    <button
                      id={"stake-button" + index}
                      onClick={() => unstakeBeanz(beanz.data.name.slice(6, 7))}
                      className="btn btn-danger"
                    >
                      Go Home
                    </button>
                    <img
                      id="staked-icon"
                      src="/chicken.gif"
                      alt="chicken"
                      width="35%"
                    />
                  </div>
                ))
              ) : isLoading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h5>You don't have any beanz on adventure</h5>
              )}
            </div>
            );
          </div>
        </div>
      ) : (
        <div className="row justify-content-center align-items-center m-2">
          <h5>Connet your wallet first</h5>
        </div>
      )}
    </div>
  );
};

export default BeanzStaking;
