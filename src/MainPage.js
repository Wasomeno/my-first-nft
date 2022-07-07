import React, { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import CoolBeanz from "./api/BeanzNFT.json";
import GetHash from "./HashToast";

const BeanzContract = "0x2eDBDa7361A09B7ebC26b91dBB7432605fb8e0f1";

const MainPage = ({ account, setAccount }) => {
  const isConnected = Boolean(account[0]);

  const [mintAmount, setMintAmount] = useState(1);

  async function beanzMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        BeanzContract,
        CoolBeanz.abi,
        signer
      );
      try {
        const priceBigInt = await contract.getPrice();
        const price = ethers.utils.formatEther(priceBigInt);
        const response = await toast.promise(
          contract.createBeanz(BigNumber.from(mintAmount), {
            value: ethers.utils.parseEther((price * mintAmount).toString()),
          }),
          {
            pending: "🎟️ Minting some beanz...",
            success: {
              render({ data }) {
                return <GetHash hash={data.hash} />;
              },
            },
            error: "Transaction Rejected",
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const increment = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  const decrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };
  // console.log(beanzImage);
  // getBeanzImage(1);

  return (
    <div
      id="mainpage"
      className="h-75 d-flex flex-column justify-content-center align-items-center"
    >
      <div className="p-2">
        <h1 id="mainpage-title">
          Welcome to
          <h1>CoolBeanz World!</h1>
        </h1>
      </div>

      {isConnected ? (
        <div className="p-2 m-3">
          <div id="mint-container" className="d-flex justify-content-between">
            <button
              id="decrement-button"
              onClick={decrement}
              className="btn m-1"
            >
              -
            </button>
            <input
              type="text"
              className="form-control m-1"
              value={mintAmount}
            />
            <button
              id="increment-button"
              onClick={increment}
              className="btn m-1"
            >
              +
            </button>
          </div>
          <button id="mint-button" onClick={beanzMint} className="mt-3">
            {" "}
            Mint
          </button>
        </div>
      ) : (
        <div>
          <h5>You need to connect your wallet first</h5>
        </div>
      )}
    </div>
  );
};

export default MainPage;
