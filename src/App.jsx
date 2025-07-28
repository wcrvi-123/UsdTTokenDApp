import React, { useEffect, useState } from 'react';
import TronWeb from 'tronweb';

function App() {
  const [balance, setBalance] = useState('0');
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const tronNode = import.meta.env.VITE_TRON_NETWORK === 'mainnet'
    ? 'https://api.trongrid.io'
    : 'https://api.shasta.trongrid.io';

  useEffect(() => {
    async function fetchBalance() {
      const tronWeb = new TronWeb({ fullHost: tronNode });
      const contract = await tronWeb.contract().at(contractAddress);
      const addr = tronWeb.defaultAddress.hex;
      const result = await contract.balanceOf(addr).call();
      setBalance(result.toString());
    }
    if (contractAddress) {
      fetchBalance();
    }
  }, [contractAddress]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <img src="/usdt.png" alt="UsdT Logo" width={100} height={100} />
      <h1>UsdT Token DApp</h1>
      <p>Contract: {contractAddress}</p>
      <p>Your Balance: {balance}</p>
    </div>
  );
}

export default App;
