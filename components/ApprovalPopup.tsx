'use client'


import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';


export default function ApprovalPopup() {
  const { user } = useUser();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // Show popup if user is not approved
  useEffect(() => {
    if (user && user.publicMetadata?.approved !== true) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user]);

  // Reset popup on every route change
  useEffect(() => {
    if (user && user.publicMetadata?.approved !== true) {
      setShow(true);
    }
  }, [pathname, user]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-screen z-[9999] flex justify-center pointer-events-none">
      <div className="mt-8 bg-white/95 border-2 border-yellow-400 rounded-xl shadow-lg px-8 py-6 max-w-md w-full text-center text-gray-800 font-medium text-base pointer-events-auto relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Popup bezárása"
        >
          ×
        </button>
        <h2 className="text-yellow-500 font-bold text-lg mb-4">Fiókod jóváhagyásra vár</h2>
        <p>
          Az adminisztrátor még nem hagyta jóvá a fiókodat.<br />
          Amíg ez nem történik meg, csak publikus oldalakat tudsz böngészni.<br />
          Ha kérdésed van, keresd a játékvezetői bizottságot!
        </p>
      </div>
    </div>
  );
}
