import { Routes, Route } from "react-router";
import Layout from "./components/Layouts";
import Index from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import AllListings from "./pages/AllListings";
import NotFound from "./pages/NotFound";

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
          path="/all_listings"
          element={
            <Layout>
              <AllListings />
            </Layout>
          }
        />
        <Route
          path="/create_listing"
          element={
            <Layout>
              <CreateListing />
            </Layout>
          }
        />
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
