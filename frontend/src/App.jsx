import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TranslatePage from "./pages/TranslatePage";

export default function App() {
  return (
    <div className="min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translate" element={<TranslatePage />} />
      </Routes>
    </div>
  );
}
