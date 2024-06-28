import { Route, Routes } from "react-router-dom"
import { Home, Plinko } from "./components"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plinko" element={<Plinko />} />
      </Routes>
    </>
  )
}

export default App
