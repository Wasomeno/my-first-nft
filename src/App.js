import './App.css';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Navbar from './Navbar';
import MainPage from './MainPage';
import Inventory from './Inventory';
import BeanzStaking from './BeanzStaking';
import Marketplace from './Marketplace';


function App() {
  const [account, setAccount] = useState([]);

  return (
    <HelmetProvider>
    <div id="app" className="App container-fluid">
    <Helmet>
        <title>CoolBeanz World</title>
        <link rel="shortcut icon" href="coolbeanz.png"/>
      </Helmet>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar account={account} setAccount={setAccount}/>}>
          <Route index element={<MainPage account={account} setAccount={setAccount}/>} />
          <Route path="inventory/*" element={<Inventory account={account} setAccount={setAccount}/>}/>
          <Route path="staking" element={<BeanzStaking account={account} setAccount={setAccount}/>} />
          <Route path="marketplace/*" element={<Marketplace account={account} setAccount={setAccount}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer position="bottom-center" closeOnClick={false}/>
    </div>
    </HelmetProvider>
    
  );
}

export default App;
