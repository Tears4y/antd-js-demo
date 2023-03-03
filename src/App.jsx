
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login';
import ProductTypeDisplay from './components/ProductTypeDisplay';



function App() {

  const auth = localStorage.getItem('react-demo-token')

  return (
    <>
      <Router>
        <Routes>
          {
            auth ? (
              <Route path="/" element={<ProductTypeDisplay />} />
            ) : (
              <Route path="/login" element={<Login />} />
            )
          }
          {!auth && <Route path='/' element={<Navigate to='/login' />} />}
          <Route path='*' element={<Navigate to='/' />} />
          <Route path='/login' element={auth ? <Navigate to='/' /> : <Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
