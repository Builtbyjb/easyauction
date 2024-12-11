import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { logOut } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsServicesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const veriftyToken = () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token) {
        setAuth(true);
      }
    };

    veriftyToken();

    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategories = () => {
    setIsServicesOpen(!isCategoriesOpen);
  };

  // const logOut = () => {
  //   localStorage.removeItem("ACCESS_TOKEN");
  //   localStorage.removeItem("REFRESH_TOKEN");
  //   window.location.assign("/login");
  // };

  return (
    <nav className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <span className="text-xl font-bold">EasyAuction</span>
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* {auth ? (
                <a
                  id="username"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Username
                </a>
              ) : (
                <></>
              )} */}
              <a
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Active Listings
              </a>
              <div className="relative group" ref={categoriesRef}>
                <button
                  onClick={toggleCategories}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 inline-flex items-center"
                >
                  Categories
                  {isCategoriesOpen ? (
                    <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
                {isCategoriesOpen && (
                  <div className="absolute z-20 left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {CATEGORIES.map((category) => (
                        <a
                          key={category.id}
                          href={category.url}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          {category.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {auth ? (
                <>
                  <a
                    href="/my_listings"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    My Listings
                  </a>
                  <a
                    href="/create_listing"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Create Listing
                  </a>
                  <a
                    href="/watchlists"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Watchlists
                  </a>
                  <a
                    className="px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-700"
                    onClick={logOut}
                  >
                    Logout
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Register
                  </a>
                  <a
                    href="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Login
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile view */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Active Listings
            </a>
            <div className="relative group" ref={categoriesRef}>
              <button
                onClick={toggleCategories}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 inline-flex items-center justify-between"
              >
                Categories
                {isCategoriesOpen ? (
                  <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </button>
              {isCategoriesOpen && (
                <div className="pl-4">
                  {CATEGORIES.map((category) => (
                    <a
                      key={category.id}
                      href={category.url}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {category.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {auth ? (
              <>
                <a
                  href="/my_listings"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  My Listings
                </a>
                <a
                  href="/create_listing"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  Create Listing
                </a>
                <a
                  href="/watchlists"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  Watchlists
                </a>
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-700"
                  onClick={logOut}
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <a
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  Register
                </a>
                <a
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
