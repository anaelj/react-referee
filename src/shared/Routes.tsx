import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Referee } from "../pages/Referee";
import Ticker from "./../pages/Ticker";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Referee />} />
        <Route path="/newticker" element={<Ticker />} />
        <Route path="/updateticker/:id" element={<Ticker />} />
      </Routes>
    </BrowserRouter>
  );
}
