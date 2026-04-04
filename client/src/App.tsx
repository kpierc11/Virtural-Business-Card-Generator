import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import VirtualCard from "./pages/virtualCard";
import MainLayout from "./layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="virtual-card/:id" element={<VirtualCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
