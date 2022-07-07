import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import BeanzMarketplace from "./api/BeanzMarketplace.json";
import CoolBeanz from "./api/BeanzNFT.json";
import { toast } from "react-toastify";

const MarketplaceContract = "0x51e3E3d17980A6253DfA1F62325e736fc62F6Ff5";
const BeanzContract = "0x2eDBDa7361A09B7ebC26b91dBB7432605fb8e0f1";

const InventoryItem = ({ account }) => {
  const { id } = useParams();
  const isConnected = Boolean(account[0]);
  const [beanz, setBeanz] = useState({});
  const [price, setPrice] = useState(0);
  const [isApproved, setIsApproved] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const beanzContract = new ethers.Contract(
    BeanzContract,
    CoolBeanz.abi,
    signer
  );

  let myBeanz;

  async function getBeanz() {
    await axios
      .get(
        "https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/" +
          id
      )
      .then((response) => {
        myBeanz = response.data;
      });
    setBeanz(myBeanz);
    setIsLoading(false);
  }

  async function getApproved() {
    const approved = await beanzContract.getApproved(id);
    setIsApproved(approved);
  }

  async function sell() {
    const marketplaceContract = new ethers.Contract(
      MarketplaceContract,
      BeanzMarketplace.abi,
      signer
    );
    const priceEth = ethers.utils.parseEther(price.toString());
    if (isApproved === MarketplaceContract) {
      await toast.promise(marketplaceContract.sellBeanz(id, priceEth), {
        pending: "Putting Beanz #" + id + " to marketplace ...",
        success: "Transaction sent! waiting for confirmation...",
        error: "Transaction Rejected",
      });
    } else {
      await toast.promise(beanzContract.approve(MarketplaceContract, id), {
        pending: "Approving Beanz #" + id + " ...",
        success: "Transaction sent! waiting for confirmation...",
        error: "Transaction Rejected",
      });
    }
  }

  useEffect(() => {
    getBeanz();
    getApproved();
  }, [isApproved]);

  return (
    <div className="container p-3 h-75">
      {isConnected ? (
        isLoading ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-6 d-flex d-flex flex-column align-items-center">
              <img src={beanz.image} alt="my-beanz" width="75%" />
              <h5 className="p-2">{beanz.name}</h5>
              <div className="attributes row w-75">
                {beanz.attributes.map((attribute, index) => (
                  <span
                    key={index}
                    className="badge rounded-pill bg-primary col p-2 m-1 fw-normal"
                  >
                    {attribute.trait_type} : {attribute.value}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-6 d-flex flex-column justify-content-center">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Sell on Marketplace</h5>
                  <h6 htmlFor="inputPassword5">Price</h6>
                  <input
                    type="text"
                    id="inputPassword5"
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                    value={price}
                  />
                  {isApproved === MarketplaceContract ? (
                    <button
                      onClick={() => sell()}
                      className="btn btn-success m-2 w-25"
                    >
                      Sell
                    </button>
                  ) : (
                    <button
                      onClick={() => sell()}
                      className="btn btn-primary m-2 w-25"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <h5>Connect your wallet</h5>
      )}
    </div>
  );
};

export default InventoryItem;
