import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

// ABI of the Counter contract
const counterABI = [
  {
    "inputs": [],
    "name": "getCount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "newCount","type": "uint256"}],
    "name": "setCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],
    "name": "incrementBy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],
    "name": "decrementBy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Address of your deployed Counter contract (replace with your actual address)
const counterAddress = '0x68e55bDFd8ca4182755E3467371397cAd29e981c';
function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [count, setCount] = useState(null);
  const [amount, setAmount] = useState('');
  const [newCount, setNewCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)



  useEffect(() => {
    const initWeb3 = async () => {
      setLoading(true);
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          console.log('Connected account:', accounts[0]);
          
          const counterContract = new web3Instance.eth.Contract(counterABI, counterAddress);
          setContract(counterContract);
          console.log('Contract initialized');
        } catch (error) {
          console.error("User denied account access", error);
          setError("Failed to connect to MetaMask");
        }
      } else {
        console.log('Please install MetaMask!');
        setError("MetaMask not detected");
      }
      setLoading(false);
    };

    initWeb3();
  }, []);

  const checkCount = async () => {
    if (contract) {
      setLoading(true);
      try {
        const result = await contract.methods.getCount().call();
        setCount(Number(result));
        console.log('Current count:', result);
      } catch (error) {
        console.error("Error fetching count:", error);
        setError("Failed to fetch count");
      }
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (contract && account) {
      setLoading(true);
      try {
        await contract.methods.increment().send({ from: account });
        console.log('Count incremented');
        await checkCount();
      } catch (error) {
        console.error("Error incrementing count:", error);
        setError("Failed to increment count");
      }
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (contract && account) {
      setLoading(true);
      try {
        await contract.methods.decrement().send({ from: account });
        console.log('Count decremented');
        await checkCount();
      } catch (error) {
        console.error("Error decrementing count:", error);
        setError("Failed to decrement count");
      }
      setLoading(false);
    }
  };
  const handleSetCounter = async () => {
    if (contract && account && newCount !== '') {
      setLoading(true);
      try {
        await contract.methods.setCounter(newCount).send({ from: account });
        console.log('Count set to:', newCount);
        await checkCount();
      } catch (error) {
        console.error("Error setting count:", error);
        setError("Failed to set count");
      }
      setLoading(false);
    }
  };

  const handleIncrementBy = async () => {
    if (contract && account && amount) {
      setLoading(true);
      try {
        await contract.methods.incrementBy(amount).send({ from: account });
        console.log('Count incremented by:', amount);
        await checkCount();
      } catch (error) {
        console.error("Error incrementing count by amount:", error);
        setError("Failed to increment count by amount");
      }
      setLoading(false);
    }
  };

  const handleDecrementBy = async () => {
    if (contract && account && amount) {
      setLoading(true);
      try {
        await contract.methods.decrementBy(amount).send({ from: account });
        console.log('Count decremented by:', amount);
        await checkCount();
      } catch (error) {
        console.error("Error decrementing count by amount:", error);
        setError("Failed to decrement count by amount");
      }
      setLoading(false);
    }
  };

  return (
<div className="App">
      <header className="App-header">
        <h1>Counter dApp</h1>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {account && <p className="account">Connected Account: {account}</p>}
        <button onClick={checkCount} disabled={loading || !contract}>Check Count</button>
        {count !== null && <p className="count">Current Count: {count}</p>}
        <div>
          <button onClick={handleIncrement} disabled={loading || !contract}>Increment</button>
          <button onClick={handleDecrement} disabled={loading || !contract}>Decrement</button>
        </div>
        <div className="input-group">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={loading}
          />
          <button onClick={handleIncrementBy} disabled={loading || !contract || !amount}>Increment By</button>
          <button onClick={handleDecrementBy} disabled={loading || !contract || !amount}>Decrement By</button>
        </div>
        <div className="input-group">
          <input 
            type="number" 
            value={newCount}
            onChange={(e) => setNewCount(e.target.value)}
            placeholder="Enter new count"
            disabled={loading}
          />
          <button onClick={handleSetCounter} disabled={loading || !contract || newCount === ''}>Set Counter</button>
        </div>
      </header>
    </div>

  );
}

export default App;