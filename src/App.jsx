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
    async function fetchBalance(addr) {
      const tronWeb = window.tronWeb || new TronWeb({ fullHost: tronNode });
      const contract = await tronWeb.contract().at(contractAddress);

+     // 读取 decimals
+     const dec = await contract.decimals().call();
+     const decimals = Number(dec);
+     console.log('decimals:', decimals);

      // 查询原始余额
      const raw = await contract.balanceOf(addr).call();
+     console.log('raw (smallest unit):', raw.toString());

      // 用 BigInt 做高精度运算
      const rawBig = BigInt(raw.toString());
      const base = BigInt(10) ** BigInt(decimals);
      const intPart = rawBig / base;
      const fracBig = rawBig % base;
      const fracStr = fracBig.toString().padStart(decimals, '0').slice(0, 4);
      const formatted = `${intPart.toString()}.${fracStr}`;

+     console.log('formatted balance:', formatted);

      setBalance(formatted);
    }
    if (contractAddress && account) {
      fetchBalance(account);
    }
  }, [contractAddress, account]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {!account && (
        <button onClick={connectWallet}>Connect TronLink Wallet</button>
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
