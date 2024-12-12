import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import LoadingPage from "./LoadingPage";
import Footer from "./Footer";
import { refreshToken } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token) {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000; //Gets date in secs instead of ms

        if (tokenExpiration && tokenExpiration < now) {
          const isRefreshed = await refreshToken();
          setIsAuth(isRefreshed.value);
        } else {
          setIsAuth(true);
        }
      } else {
        setIsAuth(false);
      }
    };

    auth().catch(() => setIsAuth(false));
  }, []);

  // Displays while waiting for the route to be authenticated
  if (isAuth === null) {
    return <LoadingPage />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen min-w-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isAuth ? (
            <div className="container mx-auto px-4 py-8">{children}</div>
          ) : (
            <Navigate to="/login" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
