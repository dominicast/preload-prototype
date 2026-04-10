import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AggregationTasksPage from './pages/AggregationTasksPage.tsx'
import PreloadPage from './pages/PreloadPage'

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  padding: '8px 16px',
  background: '#f5f5f5',
  borderBottom: '1px solid #ddd',
  fontFamily: 'sans-serif',
  fontSize: 14,
}

function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/preload">Preload</NavLink>
        <NavLink to="/preload-timing">Preload Timing</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/preload" element={<PreloadPage />} />
        <Route path="/preload-timing" element={<AggregationTasksPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App