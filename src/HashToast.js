import React from "react";

const getHash = ({hash}) => {

    function getHash(hash) {
        window.open("https://rinkeby.etherscan.io/tx/"+ hash);
    }

    return(
        <div onClick={getHash(hash)}>
            Your Transaction Hash: {(hash).slice(0, 5)}...
        </div>
    )
}

export default getHash;