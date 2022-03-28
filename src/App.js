import "./App.css";
import { Box, List, ListItem, ListItemText, TextField } from "@mui/material";
import { useEffect, useState } from "react";

function App() {
  const [musicLists, setMusicLists] = useState(["a", "b", "c", "d", "e"]);
  const [active, setActive] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [text, setText] = useState("");
  const pageSize = 4;

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1 >= musicLists.length ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const temp = [];
    if (musicLists.length === 0) return;
    for (let x = currentPage; x <= currentPage + pageSize; x++) {
      temp.push(
        x >= musicLists.length
          ? musicLists[x % musicLists.length]
          : musicLists[x]
      );
    }
    setActive([...temp]);
  }, [currentPage]);

  const searchApi = () => {
    fetch(`http://itunes.apple.com/search?term=${text}`)
      .then((response) => response.json())
      .then((data) => {
        console.debug(data);
        setMusicLists(
          data.results.sort((a, b) =>
            a.collectionName.localeCompare(b.collectionName)
          )
        );
      });
  };

  const searchMusic = debounce(() => searchApi());

  useEffect(() => {
    searchMusic();
  }, [text]);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="App">
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField onChange={handleChange} />
          <List sx={{}}>
            {active.map((item, ind) => (
              <ListItem
                sx={{ bgcolor: ind % 2 === 0 ? "lightgrey" : "inherit" }}
              >
                <ListItemText
                  primary={
                    item && item.collectionName ? item.collectionName : item
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <List sx={{}}>
        {musicLists.map((item, ind) => (
          <ListItem sx={{ bgcolor: ind % 2 === 0 ? "lightgrey" : "inherit" }}>
            {ind}{" "}
            <ListItemText
              // primary={item && item.collectionName ? item.collectionName : item}
              primary={item.collectionName}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default App;
