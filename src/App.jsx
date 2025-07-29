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

+     // 1) 读取 decimals
+     const dec = await contract.decimals().call();
+     const decimals = Number(dec);

      // 2) 查询原始余额
      const raw = await contract.balanceOf(addr).call(); 
+     // raw 是字符串，非常大，转 BigInt
+     const rawBig = BigInt(raw.toString());

+     // 3) 将 BigInt 除以 10^decimals，保留 4 位小数
+     const base = BigInt(10) ** BigInt(decimals);
+     // 整数部分
+     const intPart = rawBig / base;
+     // 小数部分，保留 4 位
+     const fracBig = rawBig % base;
+     const fracStr = fracBig
+       .toString()
+       .padStart(decimals, '0') // 前面补零到 decimals 位
+       .slice(0, 4);            // 截取前 4 位做显示
+     const formatted = `${intPart.toString()}.${fracStr}`;

      setBalance(formatted);
    }
    if (contractAddress && account) {
      fetchBalance(account);
    }
  }, [contractAddress, account]);


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
