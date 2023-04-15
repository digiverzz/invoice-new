import React, { useState,useEffect } from "react";
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
import { useCallback, useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
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
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [indexupdate,setIndexupdate] = useState()
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
      var indexval = indexupdate;
      console.log("row data",indexval)
      tableData[indexval][row.index] = values
      console.log("tabledata",tableData)
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      
      
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

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
        enableEditing: true,
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
        enableEditing: true,
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
        tempdata[i]['name'] = props.images[i].name
        tempdata[i]['image'] = props.images[i].data
        templist.push(tempdata[i])
    }
    setItemData([...templist])
    setTableData([...tempTable])
    console.log("temptable",tempTable)
    console.log("items",itemdata)
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
                itemdata.map( (item, i) =>  (
                  <div className='row mt-3'>
                    <div className="col-lg-5 mt-3">
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
        data={tableData[i]}
        editingMode="modal"
        enableEditing
        enableRowVirtualization
        enableColumnResizing
        columnResizeMode="onEnd"
        enableStickyHeader
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
        renderRowActions={({ row, table }) => (
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
        <div className="row d-flex align-items-end flex-column mt-4">
          <div className="col-lg-3">
             <Button variant="contained">Submit<DoubleArrowSharpIcon /></Button>
          </div>
        </div>
        
        </div>
  
  )
}
