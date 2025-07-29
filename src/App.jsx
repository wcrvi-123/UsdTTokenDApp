import React, { useEffect, useState } from 'react';
import TronWeb from 'tronweb';

function App() {
  const [balance, setBalance] = useState('0');
  const [account, setAccount] = useState(null);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const tronNode = import.meta.env.VITE_TRON_NETWORK === 'mainnet'
    ? 'https://api.trongrid.io'
    : 'https://api.shasta.trongrid.io';

  // —— 新版 connectWallet 函数 —— 
  const connectWallet = async () => {
    if (!window.tronWeb) {
      alert('请先安装 TronLink');
      return;
    }
    // 等待 defaultAddress.base58 出来，最多 5 秒
    const start = Date.now();
    while (!window.tronWeb.defaultAddress.base58) {
      if (Date.now() - start > 5000) {
        alert('请先在 TronLink 中解锁钱包，然后重试');
        return;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    setAccount(window.tronWeb.defaultAddress.base58);
  };

  useEffect(() => {
    // ...fetchBalance 逻辑...
  }, [contractAddress, account]);

  return (
    <div>
      {!account && (
        <button onClick={connectWallet}>
          Connect TronLink Wallet
        </button>
      )}
      {account && <p>Connected: {account}</p>}
      {/* 省略其余 */}
    </div>
  );
}

export default App;
