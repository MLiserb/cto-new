// src/components/MemeTrader.tsx
'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MemeTrader } from '@/lib/nitrolite';

export function MemeTraderUI() {
  const [status, setStatus] = useState('Connect wallet to start');
  const [trader, setTrader] = useState<MemeTrader | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [channelId, setChannelId] = useState<string>('');
  
  // Trade form state
  const [tokenAddress, setTokenAddress] = useState('');
  const [amountIn, setAmountIn] = useState('0.1');
  const [minAmountOut, setMinAmountOut] = useState('100');
  const [slippage, setSlippage] = useState('5');

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setStatus('Please install MetaMask');
        return;
      }

      setStatus('Connecting wallet...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      
      setAddress(userAddress);
      setIsConnected(true);
      
      // Create trader instance
      const memeTrader = new MemeTrader(provider, signer);
      setTrader(memeTrader);
      
      setStatus(`Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setStatus('Failed to connect wallet');
    }
  };

  // Initialize Nitrolite
  const initializeNitrolite = async () => {
    if (!trader || !channelId) {
      setStatus('Please enter a channel ID');
      return;
    }

    try {
      setStatus('Initializing Nitrolite...');
      await trader.initialize('https://clearnode.yellow.com', channelId);
      setStatus('✅ Nitrolite initialized! Ready to trade.');
    } catch (error) {
      console.error('Failed to initialize:', error);
      setStatus('Failed to initialize Nitrolite');
    }
  };

  // Execute trade
  const executeTrade = async () => {
    if (!trader || !trader.isInitialized()) {
      setStatus('Please initialize Nitrolite first');
      return;
    }

    if (!tokenAddress) {
      setStatus('Please enter a token address');
      return;
    }

    try {
      setStatus('Creating MEV-protected trade...');
      
      const result = await trader.buyToken(
        tokenAddress,
        ethers.parseEther(amountIn),
        ethers.parseUnits(minAmountOut, 18),
        parseFloat(slippage)
      );

      console.log('Trade result:', result);
      setStatus('✅ Trade executed off-chain! MEV protected.');
    } catch (error) {
      console.error('Trade failed:', error);
      setStatus('Trade failed - check console');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-purple-600">
          🛡️ MEV-Protected Memecoin Trader
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Powered by Nitrolite (ERC-7824) State Channels
        </p>

        {/* Status Bar */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">
            📡 Status: {status}
          </p>
        </div>

        {/* Step 1: Connect Wallet */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Step 1: Connect Wallet</h2>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Connect MetaMask
            </button>
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Initialize Nitrolite */}
        {isConnected && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Step 2: Initialize Nitrolite</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Channel ID
                </label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="Get from apps.yellow.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Create a channel at{' '}
                  <a
                    href="https://apps.yellow.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    apps.yellow.com
                  </a>
                </p>
              </div>
              <button
                onClick={initializeNitrolite}
                disabled={!channelId}
                className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Initialize State Channel
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Execute Trade */}
        {isConnected && trader?.isInitialized() && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Step 3: Trade Memecoin</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Token Address
                </label>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amount (BNB)
                  </label>
                  <input
                    type="number"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Min Tokens Out
                  </label>
                  <input
                    type="number"
                    value={minAmountOut}
                    onChange={(e) => setMinAmountOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Slippage (%)
                </label>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={executeTrade}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition"
              >
                🚀 Execute MEV-Protected Trade
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold mb-2 text-purple-900">
            How It Works
          </h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>✅ Trades happen off-chain through state channels</li>
            <li>✅ No public mempool = No MEV bots can front-run you</li>
            <li>✅ Only final settlement is written on-chain</li>
            <li>✅ Fast execution with minimal gas fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
