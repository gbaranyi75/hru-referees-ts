"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  fetchPendingUsers,
  PendingUser,
} from "@/lib/actions/fetchPendingUsers";
import { approveUser } from "@/lib/actions/approveUser";

export default function AdminApprovalPopup() {
  const { user } = useUser();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Only show for admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      fetchPendingUsers().then((users) => {
        setPendingUsers(users);
        setShow(users.length > 0);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  // Auto-refresh after approval
  const refreshList = async () => {
    setLoading(true);
    const users = await fetchPendingUsers();
    setPendingUsers(users);
    setShow(users.length > 0);
    setLoading(false);
  };

  const handleUserApproved = async (
    userId: string
  ) => {
    setPendingUsers((prev) => prev.filter((us) => us.id !== userId));
    setShow(pendingUsers.length > 0);
    const result = await approveUser(userId);
    if (result.success) {
      refreshList();
    }
  };
  if (!isAdmin || !show) return null;

  return (
    <div className="fixed top-0 left-0 w-screen z-[9999] flex justify-center pointer-events-none">
      <div className="mt-12 bg-white/95 border-2 border-blue-700 rounded-xl shadow-lg px-8 py-6 max-w-4xl w-full text-center text-gray-800 font-medium text-base pointer-events-auto relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Popup bezárása">
          ×
        </button>
        <h2 className="text-blue-600 font-bold text-lg mb-4">
          Jóváhagyásra váró felhasználók
        </h2>
        {loading ? (
          <div className="py-8">Betöltés...</div>
        ) : pendingUsers.length === 0 ? (
          <div className="py-8">Nincs jóváhagyásra váró felhasználó.</div>
        ) : (
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="border-b">
                <th className="py-2">Név</th>
                <th className="py-2">Email</th>
                <th className="py-2">Regisztráció</th>
                <th className="py-2">Művelet</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.createdAt?.slice(0, 10) ?? ""}</td>
                  <td className="py-2">
                    <button
                      className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                      onClick={() => handleUserApproved(u.id)}>
                      Jóváhagyás
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-600"
                      // TODO: implement reject logic
                      disabled>
                      Elutasítás
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="text-sm text-gray-500">
          Amíg van jóváhagyásra váró kérés, ez a popup automatikusan megjelenik.
        </div>
      </div>
    </div>
  );
}
