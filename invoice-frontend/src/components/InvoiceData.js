import React, { useState,useEffect } from "react";
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
import { useCallback, useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Box
} from '@mui/material';
import DoubleArrowSharpIcon from '@mui/icons-material/DoubleArrowSharp';
import AddIcon from '@mui/icons-material/Add';
import { Delete, Edit } from '@mui/icons-material';
import Navbar from "./Navbar";
import Fab from '@mui/material/Fab';
import axios from "axios";
import URI from "../utils/request";
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';




//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Create New Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;




export default function InvoiceData(props) {
  const [itemdata,setItemData] = useState([]);
  //table
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => props.responsedata);
  const [validationErrors, setValidationErrors] = useState({});
  const [indexupdate,setIndexupdate] = useState()
  const [totalreq, setTotalreq] = useState(0);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

 const handleSubmit = async () =>{
      setLoading(true)
      for(var i=0;i<props.responsedata.length;i++){
      const formData1 = new FormData();
      formData1.append("data",JSON.stringify(props.responsedata[i]))
      formData1.append("id", "dl/0" + Math.floor(totalreq + 1).toString());
      formData1.append("name", localStorage.getItem("name"));
      formData1.append("uid", localStorage.getItem("uid"));
      formData1.append("role", localStorage.getItem("role"));
      formData1.append("submitted", today);
      formData1.append("dept", localStorage.getItem("dept"));
      formData1.append("status", "waiting");
      formData1.append("token", localStorage.getItem("token"));
      if (localStorage.getItem("role") == "Associate Practice Lead") {
        formData1.append("l1", "yes");
        formData1.append("l2", "no");
      }
      if (localStorage.getItem("role") == "Employee") {
        formData1.append("l1", "no");
        formData1.append("l2", "no");
      }
      if (localStorage.getItem("role") == "Practice Lead") {
        formData1.append("l2", "yes");
        formData1.append("l1", "yes");
      }
      formData1.append("l3", "no");
      let res;
      let res1;
      const formData2 = new FormData();
      formData2.append("token", localStorage.getItem("token"));
      formData2.append("total", totalreq + 1);
      try {
        res = await axios.post(URI + "request", formData1);
        res1 = await axios.post(URI + "addtotalreq", formData2);
      } catch (error) {
        window.alert("Server Error");
      }

      }
      
      setTimeout(
        () => {
          setLoading(false)
          navigate("/dashboard")
        }, 
        3000
      );
      
      
 }

  const handleCreateNewRow = (values) => {
    var indexval = indexupdate;
    tableData[indexval].push(values);
    setTableData([...tableData]);
    console.log("create",tableData)
  };
  

  const handleindexvariable = (index) => {
      setIndexupdate(index)
  }
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  
  const handleSaveRowEdits = async ({exitEditingMode, row, values}) => {
    if (!Object.keys(validationErrors).length) {
      // var tempdata = tableData
      var indexval = indexupdate;
      console.log("row data",indexval)
      tableData[indexval][row.index].text = values['text']
      console.log("tabledata",tableData)
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);


      exitEditingMode(); //required to exit editing mode and close modal
    }
  };
  
   
  const handleDeleteRow = useCallback(
    (row) => {
      if (
       alert(`Are you sure you want to delete ${row.getValue('firstName')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData[indexupdate].splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData,indexupdate],
  );
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };



  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'label',
        header: 'Label',
        size: 120,
        minSize: 80,
        maxSize: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'text',
        header: 'Text',
        size: 120,
        minSize: 80,
        maxSize: 140,

        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      }
    ],
    [getCommonEditTextFieldProps],
  );



  const capitalizeWords = (str) => {
    var tempstr = str;

    // tempstr = tempstr.replace("_"," ")

    return tempstr
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    var tempdata = props.responsedata;
    var templist = [];
    var tempTable = [];
    var templabels = [];
    for(var i=0;i<tempdata.length;i++){
      templabels.push(Object.keys(tempdata[i]))
      var temp = []
      for (let key in tempdata[i]) {
        if(key!=="logo" && key!=="bill_of_materials" && key!=="name" && key!=="image" && key!=="barcode" && key!=="custom"){
          temp.push({"label":capitalizeWords(key),"text":tempdata[i][key]})
        }
        
    }
    tempTable.push(temp)
   }
   
    for(var i=0;i<props.responsedata.length;i++){
        tempTable[i]['name'] = props.images[i].name
        tempTable[i]['image'] = props.images[i].data
        tempdata[i]['name'] = props.images[i].name
        tempdata[i]['image'] = props.images[i].data
        templist.push(tempdata[i])
    }
    setItemData([...templist])
    setTableData([...tempTable])
    console.log("temptable",tempTable)
    console.log("items",itemdata)
    
    const fetchReq = async () => {
      const formData2 = new FormData();

      formData2.append("token", localStorage.getItem("token"));
      let res1 = {
        data: [
          {
            total: "",
          },
        ],
      };
      res1 = await axios.post(URI + "totalreq", formData2);
      setTotalreq(parseInt(res1.data[0].total));
    };
    fetchReq();


  }, [props]);



  return (
     <div className='container-fluid' style={{backgroundColor:"#F6F1F1"}}>
           <Navbar />

            <Carousel
             autoPlay={false}
             swipe={false}
             indicators={false}
             navButtonsAlwaysVisible = {true}
             indicatorContainerProps={{
                style: {
                  zIndex: 1,
                  marginTop: "-100px",
                 
                }
              }}
              navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                style: {
                    backgroundColor: 'cornflowerblue',
                    borderRadius: 0
                }
            }} 
            navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
                style: {
                    bottom: 'unset',
                    top: '0'
                }
            }} 
            
            >
              
            {
                tableData.map( (item, i) =>  (
                  
                  <div className='row mt-3'>
                    <div className="col-lg-5 mt-3">
                    {/* <h1>{item[0].text}</h1> */}
                     <img src={item.image} alt="" style={{width:"560px",height:"620px"}} />
                    </div>
                    <div className="col-lg-1">
                    <Divider orientation="vertical">
    <Chip label="Extract" color="primary" variant="outlined"/>
  </Divider>
                    </div>
                    <div className="col-lg-6 mt-3">
                    
                       <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            size: 40,
          },
        }}
        columns={columns}
        data={item}
        editingMode="modal"
        enableEditing
        enableRowVirtualization
        enableColumnResizing
        columnResizeMode="onEnd"
        enableStickyHeader
        enableRowActions
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
        renderRowActions={({ cell,row, table }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>

            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => {
                handleindexvariable(i);
                table.setEditingRow(row);
                }}
                >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          
            <Fab color="primary" aria-label="add"   onClick={() => setCreateModalOpen(true)}>
        <AddIcon />
      </Fab>
         
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
                    </div>
                    </div>
                ))
            }
        </Carousel>
        <div className="row d-flex align-items-end flex-column mt-5">
          <div className="col-lg-3">
             <LoadingButton
         onClick={handleSubmit}
        endIcon={<SendIcon />}
        loading={loading}
        loadingPosition="end"
        variant="contained"
      >
        Submit
      </LoadingButton>
          </div>
        </div>
        
        </div>
  
  )
}
