import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { Link, Outlet, useNavigate } from "react-router-dom";

import CoolBeanz from "./api/BeanzNFT.json";
import GetHash from "./HashToast";

const BeanzContract = "0x2eDBDa7361A09B7ebC26b91dBB7432605fb8e0f1";

const InventoryList = ({ account, stakeBeanz }) => {
  const isConnected = Boolean(account[0]);
  const [beanzs, setBeanzs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  let beanz = [];
  let beanzId = [];

  async function getInventory() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(BeanzContract, CoolBeanz.abi, signer);

    const inventory = await contract.getBeanzOwner(signer.getAddress());

    for (let i = 0; i < inventory.length; i++) {
      beanzId[i] = inventory[i];
      beanz[i] = await axios(
        "https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/" +
          beanzId[i].toString()
      );
    }
    setBeanzs(beanz);
    setIsLoading(false);
  }

  useEffect(() => {
    getInventory();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="h-75">
      <h1 id="inventory-title" className="p-2 m-2">
        Your Beanz
      </h1>
      {isConnected ? (
        <div className="d-flex justify-content-center m-2 g-0">
          {beanzs[0] ? (
            beanzs.map((beanz, index) => (
              <div
                id="inventory-card"
                key={index}
                className="card col-2 m-1"
                onClick={() =>
                  navigate("/inventory/" + beanz.data.name.slice(6, 7))
                }
              >
                <img
                  src={beanz.data.image}
                  className="card-img-top p-2"
                  alt="..."
                />
                <div className="card-body">
                  <h5 id="inventory-card-title">{beanz.data.name}</h5>
                </div>
                {stakeBeanz ? (
                  <button
                    id={"stake-button" + index}
                    onClick={() => stakeBeanz(beanz.data.name.slice(6, 7))}
                    className="btn btn-success"
                  >
                    Adventure
                  </button>
                ) : (
                  <></>
                )}
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
      ) : (
        <div>
          <h5>Connect Your Wallet First</h5>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
