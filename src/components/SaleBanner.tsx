import React, { useState, useEffect } from 'react'
import { X, Tag } from 'lucide-react'

const SaleBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [hasActiveSale, setHasActiveSale] = useState(false)

  useEffect(() => {
    // Check if there are any active sales or promotions
    const checkActiveSales = () => {
      // For demo purposes, show banner randomly
      setHasActiveSale(Math.random() > 0.3)
    }

    checkActiveSales()
  }, [])

  if (!isVisible || !hasActiveSale) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <Tag className="w-5 h-5 mr-2 flex-shrink-0" />
        <p className="font-medium">
          🏠 <strong>Limited Time Offer:</strong> Save up to $25,000 on select homes! 
          <span className="ml-2 underline cursor-pointer hover:no-underline">
            View Available Properties
          </span>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default SaleBanner