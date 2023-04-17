import logo from './logo.svg';
import './App.css';
import Login from './components/LoginComponent'
import {Routes,Route,Navigate} from 'react-router-dom'
import EmpDashboard from './components/EmployeeDashboard';
import CreateClaimRecord from './components/CreateClaim';
import UploadFileComp from './components/UploadFile';
import InvoiceData from './components/InvoiceData';
import FileManager from './components/FileManager';
import HeadDashboard from './components/HeadDashboard';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/dashboard" element={<EmpDashboard />}></Route>
          <Route path="/createclaim" element={<CreateClaimRecord />}></Route>
          <Route path='/uploadfile' element={<UploadFileComp />}></Route>
          <Route path='/filemanager' element={<FileManager />}></Route>
          <Route path='/approve' element={<HeadDashboard />}/>
          <Route path="/" element={<Navigate replace to="/login" />} /> 
        </Routes>
    </div>
  );
}

export default App;
