import { React, useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import axios from "../../axios";

// Components
import {
  Stack,
  Chip,
  Avatar,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";

// Icon
import RupeeIcon from "@mui/icons-material/CurrencyRupeeRounded";
import ShippedIcon from "@mui/icons-material/LocalShippingRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PendingIcon from "@mui/icons-material/AccessTimeRounded";
import ApprovedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelIcon from "@mui/icons-material/CancelRounded";
import UpdateIcon from "@mui/icons-material/CachedRounded";

// Custom Components
import UpdateBook from "./UpdateOrder";

const useStyles = makeStyles(() => ({
  root: {
    fontFamily: "PT sans !important",
    "& p": {
      fontFamily: "PT sans !important",
    },
    "& div": {
      fontFamily: "PT sans !important",
    },
  },
  stack: {
    minHeight: "calc(100vh - 50px)",
    width: "100%",
  },
}));

const Orders = () => {
  //Calling Hooks
  const classes = useStyles();

  // Functionality States
  const [Loading, setLoading] = useState(true);
  const [filterChange, setFilterChange] = useState(false);
  const [deleteId, setdeleteId] = useState("");

  // Data States
  const [filteredItems, setFilteredItems] = useState([]);
  const [books, setbooks] = useState([]);
  const [filter, setFilter] = useState(1);

  useEffect(() => {
    axios.get("/getBookList").then((response) => {
      // console.log(response.data);
      setbooks(response.data);
      setFilteredItems(
        response.data.filter((book) => book.status === "Approval Pending")
      );
      setLoading(false);
    });
  }, []);

  // changing Filter
  const handelFilterChange = (e) => {
    setFilterChange(true);
    setFilter(e.target.value);
    if (e.target.value == 1) {
      setTimeout(() => {
        setFilterChange(false);
        setFilteredItems(
          books.filter((book) => book.status === "Approval Pending")
        );
      }, 2000);
    } else if (e.target.value == 2) {
      setTimeout(() => {
        setFilterChange(false);
        setFilteredItems(books.filter((book) => book.status === "Approved"));
      }, 2000);
    } else if (e.target.value == 3) {
      setTimeout(() => {
        setFilterChange(false);
        setFilteredItems(books.filter((book) => book.status === "Sold"));
      }, 2000);
    } else if (e.target.value == 4) {
      setTimeout(() => {
        setFilterChange(false);
        setFilteredItems(
          books.filter((book) => book.status === "Approval rejected")
        );
      }, 2000);
    }
  };

  const columns = [
    {
      field: "orderPhoto",
      headerName: "Book Id",
      minWidth: 200,
      flex: 2,
      sortable: false,
      renderCell: (cellValue) => {
        return (
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ padding: "10px" }}
            spacing={2}
          >
            <Avatar src={cellValue.value[0]} alt="" variant="rounded" />
            <Chip
              label={cellValue.value[1]}
              size="small"
              sx={{ fontSize: "9px" }}
              className={classes.root}
            />
          </Stack>
        );
      },
    },
    {
      field: "bookTotal",
      headerName: "Book Price",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (cellValue) => {
        return (
          <Stack spacing={2}>
            <Chip
              icon={<RupeeIcon />}
              label={cellValue.value[0]}
              size="small"
              className={classes.root}
              color="primary"
              variant="outlined"
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
                QTY
              </Typography>
              <Chip
                label={cellValue.value[1]}
                size="small"
                className={classes.root}
              />
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: "bookDetails",
      headerName: "Book Details",
      minWidth: 200,
      flex: 2,
      sortable: false,
      renderCell: (cellValue) => {
        return (
          <Stack sx={{ height: 100, overflowY: "auto" }}>
            <Typography
              className={classes.root}
              sx={{ fontSize: "12px", whiteSpace: "pre-wrap" }}
            >
              {cellValue.value[0]}
            </Typography>
            <Typography
              className={classes.root}
              variant="caption"
              sx={{ fontSize: "9px", whiteSpace: "pre-wrap", height: 80 }}
            >
              {cellValue.value[1]}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "bookStatus",
      headerName: "Book Status",
      minWidth: 150,
      flex: 2,
      sortable: false,
      renderCell: (cellValue) => {
        return (
          <Chip
            icon={
              cellValue.value === "Approval Pending" ? (
                <PendingIcon />
              ) : cellValue.value === "Approved" ? (
                <ApprovedIcon />
              ) : cellValue.value === "Approval rejected" ? (
                <CancelIcon />
              ) : (
                <ShippedIcon sx={{ height: 15, width: 15 }} />
              )
            }
            label={cellValue.value}
            size="small"
            className={classes.root}
            color={
              cellValue.value === "Approval Pending"
                ? "warning"
                : cellValue.value === "Approved"
                ? "success"
                : cellValue.value === "Approval rejected"
                ? "error"
                : "primary"
            }
            variant="outlined"
          />
        );
      },
    },
    {
      field: "bookUpdate",
      headerName: "Update Book",
      minWidth: 150,
      flex: 2,
      sortable: false,
      renderCell: (cellValue) => {
        return (
          <Button
            startIcon={<UpdateIcon />}
            disabled={filter !== 1}
            size="small"
            className={classes.root}
            variant="contained"
            href={`/SellerBookUpdate/${cellValue.value}`}
            target="_blank"
          >
            Update Book
          </Button>
        );
      },
    },
    {
      field: "bookDelete",
      headerName: "Delete Book",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (cellValue) => {
        return (
          <IconButton className={classes.root} color="error">
            {deleteId === cellValue.value ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        );
      },
    },
  ];
  const rows = filteredItems.map((order) => {
    return {
      id: order._id,
      orderPhoto: [order.photos[0], order._id],
      bookTotal: [order.price, order.qty],
      bookDetails: [order.title, order.description],
      bookStatus: order.status,
      bookUpdate: order._id,
      bookDelete: order._id,
    };
  });

  return (
    <>
      <Helmet>
        <title>Your Books | Bookshlf</title>
      </Helmet>
      <Stack className={classes.stack} spacing={2}>
        <FormControl fullWidth className={classes.root} color="success">
          <InputLabel id="demo-simple-select-label" className={classes.root}>
            Filter Books
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={filter}
            label="Filter Books"
            onChange={handelFilterChange}
          >
            <MenuItem value={1} className={classes.root}>
              Books Pending For Approval
            </MenuItem>
            <MenuItem value={2} className={classes.root}>
              Books Approved
            </MenuItem>
            <MenuItem value={3} className={classes.root}>
              Books Sold
            </MenuItem>
            <MenuItem value={4} className={classes.root}>
              Books Rejected
            </MenuItem>
          </Select>
        </FormControl>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={3}
          rowBuffer={3}
          className={classes.root}
          loading={filteredItems === null || filterChange || Loading}
          rowHeight={120}
          rowsPerPageOptions={[3]}
          disableColumnFilter
          disableSelectionOnClick
          disableColumnMenu
        />
      </Stack>
    </>
  );
};
export default Orders;
