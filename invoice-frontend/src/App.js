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
import Testcrop from './components/testcrop';
import StorageDashboard from './components/StorageDashboard';
import FileUploader from './components/fileuploader';
import InvoiceForm from './components/invoiceForm';
import FileUploadPage from './components/FileUploadPage'

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/dashboard" element={<EmpDashboard />}></Route>
          <Route path="/createclaim" element={<CreateClaimRecord />}></Route>
          <Route path="/uploadfile" element={<FileUploadPage />}></Route>
          <Route path='/filemanager' element={<FileManager />}></Route>
          <Route path='/approve' element={<HeadDashboard />}/>
          {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
          <Route path="/" element={<Login/>} />
          <Route path="/test" element={<Testcrop />} />
          <Route path="/storage" element={<StorageDashboard />} />
        </Routes>
    </div>
  );
}

export default App;
