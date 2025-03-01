import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Complete ABI for the BoatFactory contract
const BOAT_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "getAllBoats",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "boatAddress", "type": "address"}],
    "name": "getBoatInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "address", "name": "ownerAddress", "type": "address"},
      {"internalType": "uint256", "name": "tokenCount", "type": "uint256"},
      {"internalType": "bool", "name": "locked", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "boatName", "type": "string"}],
    "name": "createBoat",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBoatCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
    "name": "getBoatById",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "boatAddress", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"}
    ],
    "name": "BoatCreated",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address", "name": "boatAddress", "type": "address"}],
    "name": "mintToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const BOAT_ABI = [
  {
    "inputs": [
      {"internalType": "bytes32", "name": "tokenHash", "type": "bytes32"},
      {"internalType": "string", "name": "metadataURI", "type": "string"}
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"}
    ],
    "name": "send",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const BOAT_FACTORY_ADDRESS = '0x10043682974f42491DCeF0d761c8c42F62B5f0c7';

function App() {
  const [account, setAccount] = useState(null);
  const [ships, setShips] = useState([]);
  const [newShipName, setNewShipName] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenMintStates, setTokenMintStates] = useState({});
  const [sendTokenStates, setSendTokenStates] = useState({});

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        // Switch to U2U Testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x9b4' }], // 2484 in hex
          });
        } catch (switchError) {
          // Chain hasn't been added yet
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x9b4',
                chainName: 'U2U Nebulas Testnet',
                nativeCurrency: {
                  name: 'U2U',
                  symbol: 'U2U',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-nebulas-testnet.uniultra.xyz/'],
                blockExplorerUrls: ['https://testnet.u2uscan.xyz']
              }]
            });
          }
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const getContract = async () => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(BOAT_FACTORY_ADDRESS, BOAT_FACTORY_ABI, signer);
  };

  const createShip = async () => {
    if (!newShipName.trim()) {
      alert('Please enter a ship name');
      return;
    }

    setLoading(true);
    try {
      const contract = await getContract();
      console.log("Creating ship with name:", newShipName);
      const tx = await contract.createBoat(newShipName);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");
      setNewShipName('');
      loadShips();
    } catch (error) {
      console.error("Error creating ship:", error);
      alert('Error creating ship. Check console for details.');
    }
    setLoading(false);
  };

  const loadShips = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    try {
      const contract = await getContract();
      console.log("Fetching ships...");
      
      // Get ship count
      const shipCount = await contract.getBoatCount();
      console.log("Total ships:", shipCount.toString());
      
      const ships = [];
      // Try each index until we find a valid ship or hit the end
      for (let i = 0; i < shipCount; i++) {
        try {
          const shipAddress = await contract.getBoatById(i);
          console.log(`Ship ${i} address:`, shipAddress);
          
          // Skip zero addresses
          if (shipAddress === '0x0000000000000000000000000000000000000000') {
            console.log(`Skipping zero address at index ${i}`);
            continue;
          }

          const info = await contract.getBoatInfo(shipAddress);
          console.log(`Ship ${i} info:`, info);
          
          ships.push({
            address: shipAddress,
            name: info[0],
            owner: info[1],
            tokenCount: info[2].toString(),
            locked: info[3]
          });
        } catch (error) {
          console.log(`Error fetching ship at index ${i}:`, error);
          continue;
        }
      }

      // Filter ships owned by the connected account
      const userShips = ships.filter(ship => 
        ship.owner.toLowerCase() === account.toLowerCase()
      );
      console.log("User ships:", userShips);
      setShips(userShips);
    } catch (error) {
      console.error("Error loading ships:", error);
    }
    setLoading(false);
  }, [account]);

  const mintToken = async (shipAddress) => {
    if (!account) return;

    const state = tokenMintStates[shipAddress] || {};
    if (!state.hash || !state.metadataLink) {
      alert('Please enter both hash and metadata link');
      return;
    }

    setTokenMintStates(prev => ({
      ...prev,
      [shipAddress]: { ...prev[shipAddress], loading: true }
    }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const shipContract = new ethers.Contract(shipAddress, BOAT_ABI, signer);

      console.log("Connected wallet:", account);
      const owner = await shipContract.owner();
      console.log("Ship owner:", owner);
      
      // Convert the hash string to bytes32
      let tokenHash;
      if (state.hash.startsWith('0x')) {
        // If it's already a hex string, convert to bytes32
        if (state.hash.length < 66) {
          // Pad it to 32 bytes
          tokenHash = ethers.hexlify(ethers.zeroPadValue(state.hash, 32));
        } else {
          tokenHash = state.hash;
        }
      } else {
        // If it's not a hex string, convert to bytes32 via keccak256
        tokenHash = ethers.keccak256(ethers.toUtf8Bytes(state.hash));
      }

      console.log("Attempting to mint token for ship:", shipAddress);
      console.log("Parameters:", {
        tokenHash: tokenHash,
        metadataLink: state.metadataLink
      });

      try {
        const tx = await shipContract.mint(tokenHash, state.metadataLink);
        console.log("Token mint transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Token mint confirmed, receipt:", receipt);
      } catch (mintError) {
        console.error("Detailed mint error:", {
          error: mintError,
          message: mintError.message,
          code: mintError.code,
          data: mintError.data,
          transaction: mintError.transaction
        });
        throw mintError;
      }
      
      // Clear the form
      setTokenMintStates(prev => ({
        ...prev,
        [shipAddress]: { loading: false }
      }));
      
      loadShips();
    } catch (error) {
      console.error("Error minting token:", {
        error: error,
        message: error.message,
        code: error.code,
        data: error.data
      });
      alert(`Error minting token: ${error.message}`);
      setTokenMintStates(prev => ({
        ...prev,
        [shipAddress]: { ...prev[shipAddress], loading: false }
      }));
    }
  };

  const updateMintState = (shipAddress, field, value) => {
    setTokenMintStates(prev => ({
      ...prev,
      [shipAddress]: { ...prev[shipAddress], [field]: value }
    }));
  };

  const lockShip = async (shipAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const shipContract = new ethers.Contract(shipAddress, BOAT_ABI, signer);

      console.log("Locking ship:", shipAddress);
      const tx = await shipContract.lock();
      console.log("Lock transaction sent:", tx.hash);
      await tx.wait();
      console.log("Lock confirmed");
      
      loadShips();
    } catch (error) {
      console.error("Error locking ship:", error);
      alert(`Error locking ship: ${error.message}`);
    }
  };

  const unlockShip = async (shipAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const shipContract = new ethers.Contract(shipAddress, BOAT_ABI, signer);

      console.log("Unlocking ship:", shipAddress);
      const tx = await shipContract.unlock();
      console.log("Unlock transaction sent:", tx.hash);
      await tx.wait();
      console.log("Unlock confirmed");
      
      loadShips();
    } catch (error) {
      console.error("Error unlocking ship:", error);
      alert(`Error unlocking ship: ${error.message}`);
    }
  };

  const sendToken = async (shipAddress, tokenId, toAddress) => {
    if (!ethers.isAddress(toAddress)) {
      alert('Please enter a valid destination address');
      return;
    }

    setSendTokenStates(prev => ({
      ...prev,
      [shipAddress]: { ...prev[shipAddress], loading: true }
    }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const shipContract = new ethers.Contract(shipAddress, BOAT_ABI, signer);

      console.log("Sending token:", {
        from: shipAddress,
        tokenId: tokenId,
        to: toAddress
      });

      const tx = await shipContract.send(tokenId, toAddress);
      console.log("Send transaction sent:", tx.hash);
      await tx.wait();
      console.log("Send confirmed");
      
      setSendTokenStates(prev => ({
        ...prev,
        [shipAddress]: { loading: false, toAddress: '' }
      }));
      
      loadShips();
    } catch (error) {
      console.error("Error sending token:", error);
      alert(`Error sending token: ${error.message}`);
      setSendTokenStates(prev => ({
        ...prev,
        [shipAddress]: { ...prev[shipAddress], loading: false }
      }));
    }
  };

  const updateSendTokenState = (shipAddress, field, value) => {
    setSendTokenStates(prev => ({
      ...prev,
      [shipAddress]: { ...prev[shipAddress], [field]: value }
    }));
  };

  useEffect(() => {
    if (account) {
      loadShips();
    }
  }, [account, loadShips]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setShips([]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  // Listen for ship creation events
  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(BOAT_FACTORY_ADDRESS, BOAT_FACTORY_ABI, provider);

    const filter = contract.filters.BoatCreated();
    const listener = (shipAddress, name, owner) => {
      console.log("New ship created:", { shipAddress, name, owner });
      if (owner.toLowerCase() === account?.toLowerCase()) {
        loadShips();
      }
    };

    contract.on(filter, listener);

    return () => {
      contract.off(filter, listener);
    };
  }, [account, loadShips]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ship DApp</h1>
        
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <p className="account-info">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
            
            <div className="create-ship-section">
              <h2>Create New Ship</h2>
              <input 
                type="text" 
                placeholder="Enter ship name"
                value={newShipName}
                onChange={(e) => setNewShipName(e.target.value)}
              />
              <button 
                className="create-ship-btn" 
                onClick={createShip}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Create Ship'}
              </button>
            </div>

            <div className="ships-list">
              <h2>Your Ships</h2>
              {loading ? (
                <p>Loading...</p>
              ) : ships.length === 0 ? (
                <p>No ships found</p>
              ) : (
                ships.map((ship, index) => (
                  <div key={index} className="ship-item">
                    <h3>{ship.name}</h3>
                    <p>Address: {ship.address}</p>
                    <p>Token Count: {ship.tokenCount}</p>
                    <p>Status: {ship.locked ? 'Locked' : 'Unlocked'}</p>
                    
                    <div className="ship-controls">
                      <button 
                        className={`lock-btn ${ship.locked ? 'locked' : ''}`}
                        onClick={() => ship.locked ? unlockShip(ship.address) : lockShip(ship.address)}
                      >
                        {ship.locked ? 'Unlock Ship' : 'Lock Ship'}
                      </button>
                    </div>

                    <div className="token-mint">
                      <input
                        type="text"
                        placeholder="Enter hash"
                        value={tokenMintStates[ship.address]?.hash || ''}
                        onChange={(e) => updateMintState(ship.address, 'hash', e.target.value)}
                        disabled={tokenMintStates[ship.address]?.loading || ship.locked}
                        className="mint-input"
                      />
                      <input
                        type="text"
                        placeholder="Enter metadata link"
                        value={tokenMintStates[ship.address]?.metadataLink || ''}
                        onChange={(e) => updateMintState(ship.address, 'metadataLink', e.target.value)}
                        disabled={tokenMintStates[ship.address]?.loading || ship.locked}
                        className="mint-input"
                      />
                      <button 
                        className="mint-token-btn"
                        onClick={() => mintToken(ship.address)}
                        disabled={tokenMintStates[ship.address]?.loading || ship.locked}
                      >
                        {tokenMintStates[ship.address]?.loading ? 'Minting...' : 'Mint Token'}
                      </button>
                    </div>

                    <div className="token-send">
                      <input
                        type="text"
                        placeholder="Enter token ID"
                        value={sendTokenStates[ship.address]?.tokenId || ''}
                        onChange={(e) => updateSendTokenState(ship.address, 'tokenId', e.target.value)}
                        disabled={sendTokenStates[ship.address]?.loading}
                        className="send-input"
                      />
                      <input
                        type="text"
                        placeholder="Enter destination address"
                        value={sendTokenStates[ship.address]?.toAddress || ''}
                        onChange={(e) => updateSendTokenState(ship.address, 'toAddress', e.target.value)}
                        disabled={sendTokenStates[ship.address]?.loading}
                        className="send-input"
                      />
                      <button 
                        className="send-token-btn"
                        onClick={() => sendToken(
                          ship.address,
                          sendTokenStates[ship.address]?.tokenId,
                          sendTokenStates[ship.address]?.toAddress
                        )}
                        disabled={
                          sendTokenStates[ship.address]?.loading || 
                          !sendTokenStates[ship.address]?.tokenId || 
                          !sendTokenStates[ship.address]?.toAddress
                        }
                      >
                        {sendTokenStates[ship.address]?.loading ? 'Sending...' : 'Send Token'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
