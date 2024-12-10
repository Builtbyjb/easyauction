import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedLayout from "./components/ProtectedLayout";
import Index from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import YourListings from "./pages/YourListings";
import NotFound from "./pages/NotFound";
import Watchlists from "./pages/Watchlists";
import Categories from "./pages/Categories";
import { CATEGORIES } from "./lib/constants";

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
          path="/your_listings"
          element={
            <ProtectedLayout>
              <YourListings />
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
        <Route>
          {CATEGORIES.map((category) => (
            <Route
              key={category.id}
              path={category.url}
              element={
                <Layout>
                  <Categories type={category.label} />
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
