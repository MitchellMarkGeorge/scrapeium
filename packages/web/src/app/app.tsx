// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "./app.css"

import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Demo from './pages/Demo';

export function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/demo' element={<Demo/>}/>
    </Routes>
  );
}

export default App;
