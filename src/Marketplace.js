import React,{useEffect, useState} from "react";
import { Route, Routes } from "react-router-dom";
import MarketplaceList from "./MarketplaceList";
import MarketplaceItem from "./MarketplaceItem";
import { Helmet } from 'react-helmet-async';

const Marketplace = ({account}) => {
    return(
        <>
        <Helmet>
        <title>Beanz Marketplace</title>
        <link rel="shortcut icon" href="coolbeanz.png"/>
        </Helmet>
            <Routes>
                <Route index element={<MarketplaceList account={account}/>}/>
                <Route path=":id" element={<MarketplaceItem account={account}/>}/>
            </Routes>
        </>
    )
            
}

export default Marketplace;