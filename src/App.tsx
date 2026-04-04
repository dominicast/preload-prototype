import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PreloadTimingPage from './pages/PreloadTimingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/preload-timing" element={<PreloadTimingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App