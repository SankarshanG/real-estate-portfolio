import React, { useState, useEffect } from 'react';
import { X, Flame } from 'lucide-react';
import { Sale } from '../types';
import { DatabaseService } from '../services/database';

const SaleBanner: React.FC = () => {
  const [activeSale, setActiveSale] = useState<Sale | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchActiveSale = async () => {
      try {
        const currentSale = await DatabaseService.getCurrentActiveSale();
        
        if (currentSale) {
          setActiveSale(currentSale);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error fetching active sales:', error);
      }
    };

    fetchActiveSale();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isVisible || !activeSale) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 relative">
      <div className="container-max mx-auto">
        <div className="flex items-center justify-center space-x-2 text-center">
          <Flame className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span className="font-semibold text-lg">
            🔥 {activeSale.label} — {activeSale.discount_pct}% off all homes until {formatDate(activeSale.ends_at)}!
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
            aria-label="Close sale banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleBanner;
