import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
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
  Box,
} from "@mui/material";
import DoubleArrowSharpIcon from "@mui/icons-material/DoubleArrowSharp";
import AddIcon from "@mui/icons-material/Add";
import {
  ArrowBack,
  ArrowForward,
  ConstructionOutlined,
  Delete,
  Edit,
} from "@mui/icons-material";
import Navbar from "./Navbar";
import Fab from "@mui/material/Fab";
import axios from "axios";
import URI from "../utils/request";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import "./InvoiceDataStyles.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DialogContentText from "@mui/material/DialogContentText";
import DataTable from "react-data-table-component";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ButtonGroup from "@mui/material/ButtonGroup";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Menu from "@mui/material/Menu";
import ImageCropper from "./ImageCropper";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function InvoiceData(props) {
  /* console.log("props", props); */
  const [itemdata, setItemData] = useState([]);
  //table
  const [tableData, setTableData] = useState(() => props.responsedata);
  const [indexupdate, setIndexupdate] = useState();
  const [totalreq, setTotalreq] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [indexupdate2, setIndexupdate2] = useState();
  const [invoicetabledata, setinvoicetableData] = useState([]);
  const [opentable, setOpentable] = useState(false);
  const [selectedtableRow, setSelectedtableRow] = useState({});
  const [tableindexupdate, setTableIndexupdate] = useState();
  const [orgtabledata, setOrgtabledata] = useState([]);
  const [page, setpage] = useState(0);
  const [opencreatemodal, setOpencreatemodal] = useState(false);
  const [customlabel, setCustomlabel] = useState();
  const [customvalue, setCustomvalue] = useState();
  const [addIndexupdate, setAddIndexupdate] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openmenu = Boolean(anchorEl);
  const [showCropimage, setShowcropimage] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(undefined);
  const [croppedImage, setCroppedImage] = useState("");
  const [okButton, setOkbutton] = useState(false);
  const newPlugin = defaultLayoutPlugin(
     
  );

  const handlemenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlemenuClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
   /*  console.log("row", selectedRow); */
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handletableClose = () => {
    setOpentable(false);
  };

  const saveeditedRow = async () => {
 /*    console.log("tableclickedrow", tableData[indexupdate][indexupdate2]); */
    tableData[indexupdate][indexupdate2] = selectedRow;
    setTableData([...tableData]);
    props.responsedata[indexupdate][selectedRow.label] = selectedRow.text;
   /*  console.log("tabledata after edit", tableData); */
    setOpen(false);
  };
  const base64toBlob = (data) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
};

  const navigate = useNavigate();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  const handleSubmit = async () => {
    setLoading(true);
    for (var i = 0; i < props.responsedata.length; i++) {
      const formData1 = new FormData();

      formData1.append("filename", props.images[i].name);
      formData1.append("data", JSON.stringify(props.responsedata[i]));
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

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 3000);
  };

  const capitalizeWords = (str) => {
    var tempstr = str;

    // tempstr = tempstr.replace("_"," ")

    return tempstr
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    var tempdata = props.responsedata;
    var templist = [];
    var tempTable = [];
    var templabels = [];
    var table = [];
    for (var i = 0; i < tempdata.length; i++) {
      var tempinvoicetable = [];
      templabels.push(Object.keys(tempdata[i]));
      var temp = [];
      for (let key in tempdata[i]) {
        if (
          key !== "logo" &&
          key !== "bill_of_materials" &&
          key !== "name" &&
          key !== "image" &&
          key !== "barcode" &&
          key !== "custom" &&
          key !== "pdf_image" &&
          key !== "extension"
        ) {
          temp.push({ label: capitalizeWords(key), text: tempdata[i][key] });
        } else if (key === "bill_of_materials") {
          var tempinvoice = tempdata[i][key][0];
          setOrgtabledata([tempinvoice]);
          console.log("data123", tempinvoice);
          var columns = ["description", "price", "quantity", "unit_price"];
          console.log(tempinvoice);

          for (var k = 0; k < Object.keys(tempinvoice).length; k++) {
            console.log(
              "tempinvoice[k][columns[k]]",
              tempinvoice[columns[k]].length
            );
            for (var j = 0; j < tempinvoice[columns[k]].length; j++) {
              var tempobj = {
                description: "",
                quantity: "",
                unit_price: "",
                price: "",
              };
              // console.log("invoicewtabledata",temp[k][columns[k]][j])
              if (k == 0) {
                Object.assign(tempobj, {
                  description: tempinvoice[columns[k]][j],
                });
                tempinvoicetable.push(tempobj);
              } else if (k == 1) {
                if (tempinvoicetable[j] == null) {
                  Object.assign(tempobj, { price: tempinvoice[columns[k]][j] });
                  tempinvoicetable.push(tempobj);
                }
                Object.assign(tempinvoicetable[j], {
                  price: tempinvoice[columns[k]][j],
                });
              } else if (k == 2) {
                if (tempinvoicetable[j] == null) {
                  Object.assign(tempobj, {
                    quantity: tempinvoice[columns[k]][j],
                  });
                  tempinvoicetable.push(tempobj);
                }
                Object.assign(tempinvoicetable[j], {
                  quantity: tempinvoice[columns[k]][j],
                });
              } else if (k == 3) {
                if (tempinvoicetable[j] == null) {
                  Object.assign(tempobj, {
                    unit_price: tempinvoice[columns[k]][j],
                  });
                  tempinvoicetable.push(tempobj);
                }
                Object.assign(tempinvoicetable[j], {
                  unit_price: tempinvoice[columns[k]][j],
                });
              }
            }
          }
        }
      }
      table.push(tempinvoicetable);
      tempTable.push(temp);
    }
    console.log("tempinvoicetable", table);
    setinvoicetableData([...table]);

    for (var i = 0; i < props.responsedata.length; i++) {
      if (props.images[i].extension==='pdf'){
      const blob = base64toBlob(props.images[i].data);
      const url = URL.createObjectURL(blob);
      tempTable[i]["name"] = props.images[i].name;
      tempTable[i]["image"] = url;
      tempdata[i]["name"] = props.images[i].name;
      tempdata[i]["image"] = url;
      tempTable[i]["extension"] = props.images[i].extension;
      tempdata[i]["extension"] = props.images[i].extension;
      tempTable[i]["pdf_image"] = props.responsedata[i].pdf_image;
      tempdata[i]["pdf_image"] = props.responsedata[i].pdf_image;
      templist.push(tempdata[i]);
      }
      else{
      tempTable[i]["name"] = props.images[i].name;
      tempTable[i]["image"] = props.images[i].data;
      tempdata[i]["name"] = props.images[i].name;
      tempdata[i]["image"] = props.images[i].data;
      tempTable[i]["extension"] = props.images[i].extension;
      tempdata[i]["extension"] = props.images[i].extension;
      templist.push(tempdata[i]);
      }
    }
    setItemData([...templist]);
    setTableData([...tempTable]);
    console.log("temptable", tempTable);
    console.log("items", itemdata);
    console.log("invoicetable", invoicetabledata);

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
  }, []);

  const handleButtonClick = (e, row) => {
    setSelectedtableRow(e);
    console.log("event", e);
    console.log("row", row);
    setOpentable(true);
  };
  const saveeditedtableRow = () => {
    console.log("orgtabledata", orgtabledata);
    console.log("tableclickedrow", tableindexupdate);
    var foundIndex = invoicetabledata[tableindexupdate].findIndex(
      (x) => x.quantity == selectedtableRow.quantity
    );

    invoicetabledata[tableindexupdate][foundIndex] = selectedtableRow;
    props.responsedata[tableindexupdate]["bill_of_materials"] =
      invoicetabledata[tableindexupdate];
    setOpentable(false);
  };

  const columns = [
    { name: "Description", selector: (row) => row.description, sortable: true },
    { name: "Quantity", selector: (row) => row.quantity, sortable: true },
    { name: "Unit Price", selector: (row) => row.unit_price, sortable: true },
    { name: "Price", selector: (row) => row.price, sortable: true },
    {
      name: "Actions",
      cell: (row) => <EditOutlinedIcon variant="rounded" color="black" />,
    },
  ];

  const handlePreviousPage = () => {
    setpage(page - 1);
  };

  const handleNextPage = () => {
    setpage(page + 1);
  };

  const handlecreatemodalClose = () => {
    setOpencreatemodal(false);
  };

  const createRow = () => {
    var tempaddrow = {};
    var tempaddrowtabledata = {};
    tempaddrow[customlabel] = customvalue;
    tempaddrowtabledata["label"] = customlabel;
    tempaddrowtabledata["text"] = customvalue;
  /*   console.log("tempaddrow", tempaddrow);
    console.log("tempaddrowtabledata", tempaddrowtabledata); */
    props.responsedata[addIndexupdate]["custom"].push(tempaddrow);
    tableData[addIndexupdate].push(tempaddrowtabledata);
   /*  console.log("response after row added", props.responsedata); */
    setOpencreatemodal(false);
  };

  const handleCropclick = (crop) => {
    setShowcropimage(true);
    setOkbutton(true);
    setAnchorEl(null);
  };

  const handleImagecropped = (croppedImage) => {
 /*    console.log("croppedImage", croppedImage); */
    setCroppedImage(croppedImage);
    selectedRow["text"] = croppedImage;
    tableData[indexupdate][indexupdate2] = selectedRow;
    setTableData([...tableData]);
    props.responsedata[indexupdate][selectedRow.label] = selectedRow.text;
  /*   console.log("tabledata after edit", tableData); */
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F6F1F1" }}>
      <Navbar />
      <div className="row">
        <div className="col-lg-6"></div>
        <div className="col-lg-6">
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
            className="d-flex justify-content-around"
            sx={{ marginTop: 3 }}
          >
            <Button
              aria-label="previous"
              component="label"
              variant="contained"
              sx={{ backgroundColor: "#000000", borderRadius: 10 }}
              onClick={handlePreviousPage}
              disabled={page <= 0}
            >
              <ArrowBack />
            </Button>
            <Button
              aria-label="next"
              component="label"
              variant="contained"
              onClick={handleNextPage}
              sx={{ backgroundColor: "#000000", borderRadius: 10 }}
              disabled={page >= tableData.length - 1}
            >
              <ArrowForward />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      {tableData
        ? tableData.slice(page, page + 1).map((item, i) => (
            <div className="row mt-3">
              <div className="col-lg-6 mt-3">
                {
                  item.extension==='pdf'? (
                    
                    showCropimage === true ? (
                      <div className="card" id="style-1" style={{maxHeight: 600,
                        overflowY: "auto",width:560,boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"}}>
                        {/* <Button variant="outlined" onClick={cropImageNow}>Extract</Button> */}
                        <div className="card-body">
                        <ImageCropper
                          index={indexupdate}
                          index2={indexupdate2}
                          responsedata={props.responsedata[i]}
                          tabledata={tableData[i]}
                          imageToCrop={item.pdf_image}
                          onImageCropped={(croppedImage) =>
                            handleImagecropped(croppedImage)
                          }
                          
                        />
                        </div>
                      </div>
                        
                      ) : (
                        <div className="card" id="style-1" style={{maxHeight: 600,
                          overflowY: "auto",width:560,boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"}}>
                          {/* <Button variant="outlined" onClick={cropImageNow}>Extract</Button> */}
                          
                          <img
                            src={item.pdf_image}
                            alt=""
                            
                          />
                         
                        </div>
                      )
                    
                    
                  ) : (
                    showCropimage === true ? (
                      <div className="card" style={{ width: "560px", height: "620px" }}>
                        {/* <Button variant="outlined" onClick={cropImageNow}>Extract</Button> */}
                        <ImageCropper
                          index={indexupdate}
                          index2={indexupdate2}
                          responsedata={props.responsedata[i]}
                          tabledata={tableData[i]}
                          imageToCrop={item.image}
                          onImageCropped={(croppedImage) =>
                            handleImagecropped(croppedImage)
                          }
                        />
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: "560px", height: "620px" }}
                      />
                    )
                  )
                }
              </div>
              <div className="col-lg-1">
                <Divider orientation="vertical">
                  <Chip label="Extract" color="primary" variant="outlined" />
                </Divider>
              </div>
              <div className="col-lg-5 mt-3">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Labels</Typography>
                  </AccordionSummary>

                  <AccordionDetails expanded="true">
                    <Fab
                      color="inherit"
                      aria-label="add"
                      size="small"
                      sx={{ boxShadow: "none" }}
                      onClick={() => {
                        setAddIndexupdate(page);
                        setOpencreatemodal(true);
                      }}
                    >
                      <AddIcon />
                    </Fab>
                    <Dialog
                      open={opencreatemodal}
                      onClose={handlecreatemodalClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Edit the field and click save"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <div>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              type="text"
                              fullWidth
                              variant="filled"
                              onChange={(e) => {
                                setCustomlabel("");
                                setCustomlabel(e.target.value);
                              }}
                            />
                          </div>
                          <div>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              type="text"
                              label="text"
                              fullWidth
                              variant="standard"
                              onChange={(e) => {
                                setCustomvalue("");
                                setCustomvalue(e.target.value);
                              }}
                            />
                          </div>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={createRow}>Create</Button>
                        <Button autoFocus onClick={handlecreatemodalClose}>
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <div className="list">
                      {Array.isArray(item)
                        ? item.map((item2, i2) => {
                            return (
                                                            
                              item2.label !=='extension' && item2.label !=='pdf_image' ? (
                                <div>
                              <li
                                className={
                                  item2.text !== "" ? "plus" : "minus"
                                }
                              >
                                {item2.label}
                                <span>{item2.text}</span>
                                {
                                okButton === false ? (
                                  <button
                                    onClick={(event) => {
                                      setIndexupdate(i);
                                      setIndexupdate2(i2);
                                      setSelectedRow(item2);
                                      handlemenuClick(event);
                                    }}
                                    className="delete-btn"
                                  >
                                    <MoreVertIcon />
                                  </button>
                                ) : (
                                   i2===indexupdate2 ? (
                                    <Fab
                                  size="small"
                                    color="success"
                                    sx={{
                                      height: 5,
                                      lineHeight: '10px',
                                      verticalAlign: 'middle',
                                      width: 33,
                                      boxShadow:"none"
                                    }}
                                    
                                    className="ok-btn"
                                    onClick={()=>{setShowcropimage(false);setOkbutton(false)}}
                                  >
                                    <CheckSharpIcon sx={{ width: 17}}/>
                                  </Fab>
                                   ) : ""
                                )}
                              </li>
                            </div>
                              ) : (
                                <></>
                              )
                            );
                          })
                        : ""}
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Edit the field and click save"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <div>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          type="text"
                          fullWidth
                          variant="filled"
                          disabled="true"
                          defaultValue={selectedRow.label}
                        />
                      </div>
                      <div>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          type="text"
                          label="text"
                          fullWidth
                          variant="standard"
                          defaultValue={selectedRow.text}
                          onChange={(e) => {
                            selectedRow.text = e.target.value;
                            setSelectedRow(selectedRow);
                          }}
                        />
                      </div>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={saveeditedRow}>save</Button>
                    <Button autoFocus onClick={handleClose}>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
                <br />
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Tables</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <DataTable
                      columns={columns}
                      data={invoicetabledata[page]}
                      highlightOnHover="true"
                      pagination="true"
                      fixedHeader="true"
                      onRowClicked={(e) => {
                        handleButtonClick(e, invoicetabledata[page]);
                        setTableIndexupdate(i);
                     /*    console.log("tableindexupdate", tableindexupdate); */
                      }}
                    />
                    <Dialog
                      open={opentable}
                      onClose={handletableClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Edit the field and click save"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <div>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              type="text"
                              fullWidth
                              variant="standard"
                              label="Description"
                              defaultValue={selectedtableRow.description}
                              onChange={(e) => {
                                selectedtableRow.description = e.target.value;
                                setSelectedtableRow(selectedtableRow);
                              }}
                            />
                          </div>
                          <div>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              type="text"
                              fullWidth
                              variant="standard"
                              label="Quantity"
                              defaultValue={selectedtableRow.quantity}
                              onChange={(e) => {
                                selectedtableRow.quantity = e.target.value;
                                setSelectedtableRow(selectedtableRow);
                              }}
                            />
                          </div>
                          <div>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              type="text"
                              fullWidth
                              variant="standard"
                              label="Unit Price"
                              defaultValue={selectedtableRow.unit_price}
                              onChange={(e) => {
                                selectedtableRow.unit_price = e.target.value;
                                setSelectedtableRow(selectedtableRow);
                              }}
                            />
                          </div>
                          <div>
                            <TextField
                              margin="dense"
                              type="text"
                              id="standard-basic"
                              variant="standard"
                              label="Price"
                              defaultValue={selectedtableRow.price}
                              onChange={(e) => {
                                selectedtableRow.price = e.target.value;
                                setSelectedtableRow(selectedtableRow);
                              }}
                            />
                          </div>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={saveeditedtableRow}>save</Button>
                        <Button autoFocus onClick={handletableClose}>
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          ))
        : ""}

      <div className="row d-flex align-items-end flex-column mt-5">
        <div className="col-lg-3">
          <LoadingButton
            onClick={handleSubmit}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            sx={{ backgroundColor: "#000000" }}
          >
            Submit
          </LoadingButton>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openmenu}
        onClose={handlemenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClickOpen}>Edit</MenuItem>
        <MenuItem onClick={handleCropclick}>Crop</MenuItem>
      </Menu>
    </div>
  );
}
