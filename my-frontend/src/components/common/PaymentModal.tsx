import React from 'react';
import { CheckCircle, ExternalLink, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  amount: number;
  toAddress: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  txHash,
  amount,
  toAddress,
}) => {
  if (!isOpen) return null;

  const shortenHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const openPolygonScan = () => {
    window.open(`https://amoy.polygonscan.com/tx/${txHash}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card-glow w-full max-w-md p-6 relative z-10 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your transaction has been confirmed on the blockchain
          </p>

          <div className="space-y-4 text-left bg-secondary/30 rounded-xl p-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="font-semibold text-lg text-primary">{amount} Tokens</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">To</p>
              <p className="font-mono text-sm">{shortenAddress(toAddress)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
              <p className="font-mono text-sm break-all">{shortenHash(txHash)}</p>
            </div>
          </div>

          <button
            onClick={openPolygonScan}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <span>Verify on PolygonScan</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
