import { ReactNode } from "react";

const AdminComponentWrapper = ({ children }: { children: ReactNode }) => {

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
      {children}
    </div>
  );
};
export default AdminComponentWrapper;
