import React, { useState } from 'react';
import { Copy, Check, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface WalletCardProps {
  address: string;
  balance: number;
  loading?: boolean;
  name?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
  address,
  balance,
  loading = false,
  name
}) => {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string) => {
    if (!addr || addr.length < 10) return "------";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card-glow p-6 animate-fade-in">
      <div className="relative z-10">
        
    

        {/* Balance Section */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1">Balance</p>

          {loading ? (
            <div className="h-10 w-32 bg-secondary/30 animate-pulse rounded-md" />
          ) : (
            <p className="text-4xl font-bold gradient-text">
              {Number(balance || 0).toLocaleString()}
            </p>
          )}

          <p className="text-sm text-muted-foreground">Tokens</p>
        </div>

        {/* Wallet Address Section */}
        <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
            <p className="font-mono text-sm">{shortenAddress(address)}</p>
          </div>

          <button
            onClick={copyAddress}
            className="copy-btn disabled:opacity-40"
            title="Copy address"
            disabled={!address}
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
