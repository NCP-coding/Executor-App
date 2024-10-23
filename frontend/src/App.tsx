
import { Route, Routes } from 'react-router-dom';
import About from '@/pages/About';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import Layout from '@/components/Layout';


function App() {
  return (    
    <Routes>
      <Route path="/" element={<Layout headerText='Executor App'/>}>
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
