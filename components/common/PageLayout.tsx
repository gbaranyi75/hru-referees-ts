import { ReactNode } from "react";

const PageLayout = ({ children }: {children: ReactNode}) => {
  return (
    <section className="bg-gray-100">
      <div className="container m-auto max-w-7xl py-5 text-center text-gray-600">
        {children}
      </div>
    </section>
  );
};
export default PageLayout;
