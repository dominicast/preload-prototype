import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PreloadTimingPage from './pages/PreloadTimingPage'
import PreloadPage from './pages/PreloadPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/preload" element={<PreloadPage />} />
        <Route path="/preload-timing" element={<PreloadTimingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App