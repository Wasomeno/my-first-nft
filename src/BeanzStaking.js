import { Helmet} from 'react-helmet-async';
import UnstakedBeanz from "./UnstakedBeanz";
import StakedBeanz from "./StakedBeanz";

const BeanzStaking = ({account}) => {
    const isConnected = Boolean(account[0]);

    return(
        <div className='vh-100'>
            <Helmet>
                <title>Beanz Staking</title>
                <link rel="shortcut icon" href="coolbeanz.png"/>
            </Helmet>
            {isConnected ? (
                <div className="row justify-content-evenly align-items-center m-2">
                <h1 id="staking-title" className="p-2 m-2">Beanz Adventure</h1>
            
                <div className="unstaked col-5 d-flex flex-column align-items-center">
                    <h2 id="staking-subtitle" className="p-2 m-2 col-4">Your Beanz</h2>
                    <UnstakedBeanz/>
                </div>

                <div className="col d-flex justify-content-center align-items-center">
                    <h2 id="arrow"> {'>'} </h2>
                </div>
            
                <div className="staked col-5 d-flex flex-column align-items-center">
                    <h2 id="staking-subtitle" className="p-2 m-2 col-6">Beanz on Adventure</h2>
                    <StakedBeanz/>
                </div>
            </div>
            ) : (
                <div className="row justify-content-center align-items-center m-2">
                    <h5>Connet your wallet first</h5>
                </div>
            )}
        </div>
        
    )
}

export default BeanzStaking;