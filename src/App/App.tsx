import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import routes from 'Routes';
import Home from '../Pages/Home';
import Competition from 'Pages/Competition';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.competition} element={<Competition />} />
      </Route>
    </Routes>
  );
}

export default App;
