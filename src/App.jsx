import './App.css'
import Layout from './layouts';
import Home from './views/home'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Trade from './views/Trade/trade';
import { Card } from 'react-bootstrap';
import Cards from './views/Trade/Card/card';

export default function App() {
  return (
    <div style={{
      // backgroundColor: 'black'
      backgroundImage: 'url("https://w0.peakpx.com/wallpaper/280/848/HD-wallpaper-video-game-valorant-logo.jpg")',
      backgroundSize: 'repeat',
      backgroundPosition: 'center',
      minHeight: '100vh' // Adjust the height as needed
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/trade/agents" element={<Cards type={'agents'} />} />
            <Route path="/trade/weapons" element={<Cards type={'weapons'} />} />
            <Route path="/trade/sprays" element={<Cards type={'sprays'} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div >
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
