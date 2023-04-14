import React, { useState,useEffect } from "react";
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
import { useCallback, useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
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
import AddIcon from '@mui/icons-material/Add';
import { Delete, Edit } from '@mui/icons-material';






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
        <Button color="secondary" onClick={handleSubmit} variant="contained">
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

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      console.log("row",row,values)
      tableData[row.index] = values;
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
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'text',
        header: 'Label',
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      }
    ],
    [getCommonEditTextFieldProps],
  );



  
  useEffect(() => {
    var tempdata = props.responsedata;
    var templist = [];
    var tempTable = [];
    var templabels = [];
    for(var i=0;i<tempdata.length;i++){
      templabels.push(Object.keys(tempdata[i]))
      var temp = []
      for (let key in tempdata[i]) {
        temp.push({"label":key,"text":tempdata[i][key]})
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
     <div className='container'>
            <Carousel
             autoPlay={false}
             swipe={false}
             indicators={true}
             navButtonsAlwaysVisible = {true}
             indicatorContainerProps={{
                style: {
                  zIndex: 1,
                  marginTop: "-20px",
                 
                }
              }}
            >
            {
                itemdata.map( (item, i) =>  (
                  <div className='row mt-3'>
                    <div className="col-lg-5">
                     <img src={item.image} alt="" style={{width:"460px",height:"700px"}} />
                    </div>
                    <div className="col-lg-7">
                       <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            size: 40,
          },
        }}
        columns={columns}
        data={tableData[i]}
        editingMode="modal" //default
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <IconButton
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            <AddIcon />
          </IconButton>
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


        </div>
  
  )
}
