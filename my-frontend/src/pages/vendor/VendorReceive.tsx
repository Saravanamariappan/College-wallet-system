import React, { useState } from 'react';
import { QrCode, Copy, Check, Share2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const VendorReceive: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('');

  const copyAddress = async () => {
    await navigator.clipboard.writeText(user?.walletAddress || '');
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareAddress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: user?.name,
          text: `Pay to ${user?.name}`,
          url: `polygon:${user?.walletAddress}${amount ? `?amount=${amount}` : ''}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyAddress();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Receive Payment</h1>
        <p className="text-muted-foreground">Share your wallet to receive tokens</p>
      </div>

      {/* QR Code Card */}
      <div className="glass-card-glow p-6 lg:p-8 text-center">
        <div className="relative z-10">
          <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-2xl p-4 flex items-center justify-center">
            <QrCode className="w-full h-full text-background" />
          </div>

          <h3 className="font-semibold text-lg mb-2">{user?.name}</h3>
          <p className="font-mono text-sm text-muted-foreground break-all mb-4">
            {user?.walletAddress}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={copyAddress}
              className="btn-secondary px-6 py-3 flex items-center gap-2"
            >
              {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={shareAddress}
              className="btn-primary px-6 py-3 flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Request Amount */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4">Request Specific Amount</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Amount (Optional)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="input-field w-full"
            />
          </div>
          <button
            onClick={shareAddress}
            className="btn-primary w-full py-3"
          >
            Generate Payment Request
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card p-4 lg:p-6 bg-primary/5 border-primary/20">
        <h4 className="font-medium mb-2 text-primary">💡 Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Show QR code to customers for quick payments</li>
          <li>• Payments are instant and verified on blockchain</li>
          <li>• All transactions can be verified on PolygonScan</li>
        </ul>
      </div>
    </div>
  );
};

export default VendorReceive;
