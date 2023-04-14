import logo from './logo.svg';
import './App.css';
import Login from './components/LoginComponent'
import {Routes,Route} from 'react-router-dom'
import EmpDashboard from './components/EmployeeDashboard';
import CreateClaimRecord from './components/CreateClaim';
import UploadFileComp from './components/UploadFile';
import InvoiceData from './components/InvoiceData';
import FileManager from './components/FileManager';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/dashboard" element={<EmpDashboard />}></Route>
          <Route path="/createclaim" element={<CreateClaimRecord />}></Route>
          <Route path='/uploadfile' element={<UploadFileComp />}></Route>
          <Route path='/filemanager' element={<FileManager />}></Route>
        </Routes>
    </div>
  );
}

export default App;
