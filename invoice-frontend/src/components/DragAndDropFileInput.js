import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { Paper, Grid } from '@mui/material';



function DragAndDropFileInput({ onFileSelected }) {
  const [dragging, setDragging] = useState(false);
  
  const acceptedTypes = ['image/jpeg', 'image/png','application/pdf','image/jpg']; // Add the accepted file types here

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    const validFiles = Array.from(files).filter((file) => acceptedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      // Some files are of invalid type
      alert('Invalid file type. Please drop only JPEG or PNG or PDF or JPG files.');
      return;
    }
    const file = Array.from(files);
    /* console.log(file); */
    if(onFileSelected)
      onFileSelected(file);


    
  };

  return (
           <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
         onDragOver={handleDragOver}
         onDrop={handleDrop}
          style={{
        
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        cursor: 'pointer',
        width: '720px',
        minheight:'200px',
        fontFamily:'sans-serif'
      }}
    >
      <FontAwesomeIcon icon={faCloudArrowUp} fade  size="2xl" style={{color:'#1e88e5',height:'90'}} />
      <br></br>
       <div  style={{fontWeight: 'bold'}}>Drag & drop a file here or</div>

      <Button variant="text" color="primary" component="label" sx={{ mr: 2,display:'flex'}}>
        Browse
        <input
          type="file"
          accept=".jpg, .png, .pdf ,.jpeg"
          multiple
          style={{ display: 'none' }}
          onChange={(event) => {
            const file = Array.from(event.target.files);
              onFileSelected(file);
          }}
        />
      </Button>

            <div style={{color:'gray'}}>
              <p>Supported formates JPEG, PDF, JPG, PNG </p> </div>

           </div>
  );
}

export default DragAndDropFileInput;
