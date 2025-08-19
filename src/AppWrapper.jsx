import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Contact from './pages/Contact';

export default function AppWrapper() {
  return (
    <Router basename="/"> {/* "/" for root domain like alenith.com */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
