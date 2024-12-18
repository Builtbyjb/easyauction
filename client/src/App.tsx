import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import ProtectedLayout from "./components/ProtectedLayout";
import Index from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import NotFound from "./pages/NotFound";
import Watchlists from "./pages/Watchlists";
import Categories from "./pages/Categories";
import { CATEGORIES } from "./lib/constants";
import Listing from "./pages/Listing";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Index />
            </Layout>
          }
        />
        <Route
          path="/my_listings"
          element={
            <ProtectedLayout>
              <MyListings />
            </ProtectedLayout>
          }
        />
        <Route
          path="/create_listing"
          element={
            <ProtectedLayout>
              <CreateListing />
            </ProtectedLayout>
          }
        />
        <Route
          path="/watchlists"
          element={
            <ProtectedLayout>
              <Watchlists />
            </ProtectedLayout>
          }
        />
        <Route path="listing">
          <Route index element={<Navigate to="/" />} />
          <Route
            path=":id"
            element={
              <ProtectedLayout>
                <Listing />
              </ProtectedLayout>
            }
          />
        </Route>
        <Route path="categories">
          <Route index element={<Navigate to="/" />} />
          {CATEGORIES.map((category) => (
            <Route
              key={category.id}
              path={category.value}
              element={
                <Layout>
                  <Categories type={category.label} path={category.value} />
                </Layout>
              }
            />
          ))}
        </Route>
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
