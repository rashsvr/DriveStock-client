import React from 'react'
import OrderHistoryCard from './OrderHistoryCard'

function OrderHistoryGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-10 lg:gap-12 xl:gap-16">
         <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>                  
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          <div><OrderHistoryCard /></div>
          
        </div>)
}

export default OrderHistoryGrid