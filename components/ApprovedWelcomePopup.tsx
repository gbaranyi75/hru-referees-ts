'use client'
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function ApprovedWelcomePopup() {
  const { user } = useUser();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.publicMetadata?.approved === true && user.publicMetadata?.approvedWelcomeShown !== true) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-screen z-[9999] flex justify-center pointer-events-none">
      <div className="mt-8 bg-white/95 border-2 border-green-500 rounded-xl shadow-lg px-8 py-6 max-w-md w-full text-center text-gray-800 font-medium text-base pointer-events-auto relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Popup bezárása"
        >
          ×
        </button>
        <h2 className="text-green-500 font-bold text-lg mb-4">Fiókod jóváhagyva!</h2>
        <p>
          Az adminisztrátor jóváhagyta a fiókodat.<br />
          Mostantól minden funkciót elérsz az oldalon.<br />
          Jó munkát kívánunk!
        </p>
      </div>
    </div>
  );
}
