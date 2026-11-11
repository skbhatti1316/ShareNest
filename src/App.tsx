import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import CommunitySetup from "./pages/CommunitySetup";
import Dashboard from "./pages/Dashboard";
import ItemDetails from "./pages/ItemDetails";
import ShareItem from "./pages/ShareItem";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* MAIN HOME PAGE */}
            <Route path="/" element={<Home />} />

            {/* AUTHENTICATION */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* APPLICATION PAGES */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/community" element={<CommunitySetup />} />
            <Route path="/community-setup" element={<Navigate to="/community" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/share-item" element={<ShareItem />} />

            {/* ITEM DETAILS */}
            <Route path="/item/:id" element={<ItemDetails />} />

            {/* ANY UNKNOWN PAGE */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;