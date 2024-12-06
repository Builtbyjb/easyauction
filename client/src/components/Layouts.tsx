import { ReactNode } from "react";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen min-w-screen bg-slate-600">
        <div className="text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;
