import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import axios from "../../axios";

// Components
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CircularProgress from "@mui/material/CircularProgress";

// Icons
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    backgroundColor: "white",
    border: "1px solid #dfe1e5",
    borderRadius: "5px",
    "&:hover": {
      boxShadow: "0 1px 6px rgb(32 33 36 / 28%)",
      borderRadius: "5px 5px 0px 0px",
      zIndex: 205,
    },
    marginLeft: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "10px",
  },
  searchIcon: {
    padding: "10px",
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: "10px",
    width: "100%",
    fontSize: "16px !important",
    fontWeight: "bolder !important",
  },
  searchTitleResult: {
    position: "absolute",
    left: "0px",
    top: "44px",
    backgroundColor: "white",
    zIndex: 200,
    maxHeight: 300,
    overflowY: "auto",
    boxShadow: "0 4px 6px rgb(32 33 36 / 28%)",
    borderRadius: "0px 0px 5px 5px",
    width: "100%",
    paddingLeft: "44px",
  },
  Li: {
    fontSize: "16px !important",
    fontWeight: "bolder !important",
    padding: "5px 0px !important",
    "@media screen and (max-width:600px)": {
      fontSize: "10px !important",
      padding: "5px 0px !important",
      minHeight: "0px !important",
    },
  },
}));

const Searchbar = () => {
  const classes = useStyles();
  const history = useHistory();

  // functionality states
  const [searchFieldChanges, setsearchFieldChanges] = useState(false);
  const [openTitleMenu, setOpenTitleMenu] = useState(false);

  // Data States
  const [Search, setSearch] = useState("");
  const [resulttitles, setresultTitles] = useState([]);

  // Search on Enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      history.push(`/SearchResult/${Search === "" ? "tag:ALL" : Search}`);
    }
  };

  // book title search on input
  const handelBookTitleSearch = (e) => {
    setsearchFieldChanges(true);
    setSearch(e.target.value);
    setOpenTitleMenu(true);
    const fetchdata = async () => {
      axios
        .get(`/searchTitle?q=${e.target.value}`)
        .then((response) => {
          setresultTitles(response.data);
          setsearchFieldChanges(false);
        })
        .catch((error) => {});
    };
    fetchdata();
  };

  // Searching Title
  const handelTitleAdd = (titlename) => {
    setOpenTitleMenu(false);
    history.push(`/SearchResult/${titlename === "" ? "tag:ALL" : titlename}`);
  };

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        onChange={(e) => handelBookTitleSearch(e)}
        onKeyPress={handleKeyPress}
        inputProps={{ "aria-label": "search" }}
      />
      <ClickAwayListener onClickAway={() => setOpenTitleMenu(false)}>
        {openTitleMenu ? (
          <div className={classes.searchTitleResult}>
            {resulttitles.map((Title, idx) => (
              <MenuItem
                title={Title.title}
                key={idx}
                value={Title.title}
                onClick={() => handelTitleAdd(Title.title)}
                className={classes.Li}
              >
                {Title.title}
              </MenuItem>
            ))}
          </div>
        ) : (
          <></>
        )}
      </ClickAwayListener>
      {searchFieldChanges ? (
        <div>
          <CircularProgress size={25} sx={{ color: "grey.500" }} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Searchbar;
