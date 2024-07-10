import { Route, Routes } from "react-router-dom"
import axios from "axios"
import { Home, Plinko, PlinkoSimulation } from "./components"

const baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = baseURL || "http://localhost:3001"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plinko" element={<Plinko />} />
        <Route path="/plinko/simulate" element={<PlinkoSimulation />} />
      </Routes>
    </>
  )
}

export default App;
