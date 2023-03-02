
import './App.css';
import EditRowTable from './components/EditRowTable';
import ProductDisplay from './components/ProductDisplay';
import TableTest from './components/TableTest';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login';
import DemoForm from './components/DemoForm';
import AddProductType from './components/AddProductType';

function App() {

  const auth = localStorage.getItem('react-demo-token')

  return (
    <>
      {/* <AddProductType /> */}
      {/* <DemoForm /> */}
      {/* <ProductDisplay /> */}
      {/* <EditRowTable /> */}
      {/* <TableTest /> */}
      <Router>
        <Routes>
          {
            auth ? (
              <Route path="/" element={<TableTest />} />
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
