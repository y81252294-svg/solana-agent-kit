"use client";

import { useState } from 'react';
import { usePhantomWallet } from './PhantomWallet';

export function SolanaTransactionExample() {
  const { phantom, connected, publicKey } = usePhantomWallet();
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Hello Solana!');
  const [loading, setLoading] = useState(false);

  const signMessage = async () => {
    if (!phantom?.solana || !connected) return;
    
    try {
      setLoading(true);
      const encodedMessage = new TextEncoder().encode(message);
      const sig = await phantom.solana.signMessage(encodedMessage);
      setSignature(sig);
    } catch (error) {
      console.error('Error signing message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-3">Sign a Message</h3>
      
      <div className="mb-3">
        <label className="block text-sm mb-1">Message to sign:</label>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>
      
      <button
        onClick={signMessage}
        disabled={loading || !connected}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 mb-3 w-full"
      >
        {loading ? 'Signing...' : 'Sign Message'}
      </button>
      
      {signature && (
        <div className="mt-3">
          <p className="text-sm mb-1">Signature:</p>
          <div className="bg-gray-900 p-2 rounded text-xs break-all">
            {signature}
          </div>
        </div>
      )}
    </div>
  );
} 