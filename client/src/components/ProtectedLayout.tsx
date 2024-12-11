import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import api from "@/lib/api";
import { LoadingPage } from "./LoadingPage";

interface Props {
  children: ReactNode;
}

function ProtectedLayout({ children }: Props) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("REFRESH_TOKEN");
    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        localStorage.setItem("ACCESS_TOKEN", response.data.access);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.error("Refresh token expired", error);
      setIsAuth(false);
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("REFRESH_TOKEN");
      window.location.assign("/login");
    }
  };

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token) {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000; //Gets date in secs instead of ms

        if (tokenExpiration && tokenExpiration < now) {
          await refreshToken();
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
    </>
  );
}

export default ProtectedLayout;
