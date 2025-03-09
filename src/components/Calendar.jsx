import React, { useEffect, useState } from 'react';
import StudentNavbar from "./StudentNavbar";
import BottomNav from "./BottomNav";

const Calendar = () => {
  return (
    <>
    < StudentNavbar/>
    <div className="communities-page-container container-fluid py-4 px-3 px-md-4 px-lg-5 flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{marginBottom:'100px'}}>
      <div className="flex flex-col items-center text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Calendar Feature Coming Soon!</h2>
          <p className="text-gray-600 mb-4">We are working hard to bring you this amazing feature. Stay tuned for updates!</p>
      </div>
      <BottomNav />
    </div>
    </>
  );
};

export default Calendar;
