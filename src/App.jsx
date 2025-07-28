import React, { useEffect, useState } from 'react';
import TronWeb from 'tronweb';

function App() {
  const [balance, setBalance] = useState('0');
  const [account, setAccount] = useState(null);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const tronNode = import.meta.env.VITE_TRON_NETWORK === 'mainnet'
    ? 'https://api.trongrid.io'
    : 'https://api.shasta.trongrid.io';

  const connectWallet = async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      setAccount(window.tronWeb.defaultAddress.base58);
    } else {
      alert('请先安装并解锁 TronLink');
    }
  };

  useEffect(() => {
    async function fetchBalance(addr) {
      const tronWeb = new TronWeb({ fullHost: tronNode });
      const contract = await tronWeb.contract().at(contractAddress);
      const result = await contract.balanceOf(addr).call();
      setBalance(result.toString());
    }
    if (contractAddress && account) {
      fetchBalance(account);
    }
  }, [contractAddress, account]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {!account && (
        <button onClick={connectWallet}>
          Connect TronLink Wallet
        </button>
      )}
      {account && <p>Connected: {account}</p>}
      <img src="/usdt.png" alt="UsdT Logo" width={100} height={100} />
      <h1>UsdT Token DApp</h1>
      <p>Contract: {contractAddress}</p>
      <p>Your Balance: {balance}</p>
    </div>
  );
}

export default App;
