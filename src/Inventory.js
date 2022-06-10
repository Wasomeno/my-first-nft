import React, {useEffect, useState} from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

import InventoryList from "./InvetoryList";
import InventoryItem from "./InventoryItem";

const Inventory = ({account, stakeBeanz}) => {
    
    return(
        <>
        <Helmet>
            <link rel="shortcut icon" href="coolbeanz.png"/>
        </Helmet>
        <Routes>
        <Route index element={<InventoryList account={account} stakeBeanz={stakeBeanz}/>}/>
        <Route path=":id" element={<InventoryItem account={account}/>}/>
        </Routes>
        <Outlet/>
        </>
    )
    

}




export default Inventory;