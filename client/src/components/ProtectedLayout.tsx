import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getJWTToken } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (getJWTToken() === null) {
      setIsAuth(false);
      window.location.assign("/login");
    } else {
      setIsAuth(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen min-w-screen">
        {isAuth ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4 py-8">{children}</div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Layout;
