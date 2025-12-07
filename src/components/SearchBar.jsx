import { useRef, useState, useEffect } from "react";
import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
}) {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const firstSuggestion = suggestions[0] || "";
  const showGhost =
    value.length > 0 &&
    firstSuggestion.toLowerCase().startsWith(value.toLowerCase());

  const ghostText = showGhost ? firstSuggestion : "";

  const [styles, setStyles] = useState({
    paddingLeft: "14px",
    paddingTop: "16px",
    fontSize: "1rem",
    fontFamily: "Roboto",
    lineHeight: "1.5",
  });
   const handleKeyDown = (e) => {
    if (e.key === "Tab" && ghostText) {
      e.preventDefault();               
      onChange(ghostText);              
      onSelectSuggestion?.(ghostText);  
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;

    const computed = window.getComputedStyle(inputRef.current);

    setStyles({
      paddingLeft: computed.paddingLeft,
      paddingTop: computed.paddingTop,
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      lineHeight: computed.lineHeight,
    });
  }, [inputRef.current]);

  return (
    <Box sx={{ position: "relative", width: "100%" }} ref={wrapperRef}>
     
      {showGhost && (
        <Box
          sx={{
            position: "absolute",
            pointerEvents: "none",
            color: "rgba(0,0,0,0.35)",
            top: `calc(${styles.paddingTop})`,
            left: styles.paddingLeft,
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            lineHeight: styles.lineHeight,
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: "opacity 0.15s ease",
          }}
        >
          {ghostText}
        </Box>
      )}

      <TextField
        fullWidth
        variant="outlined"
        label="Search Pokémon"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        inputRef={(el) => {
          
          inputRef.current = el?.querySelector("input");
        }}
      // InputProps={{
      //   startAdornment: (
      //     <InputAdornment position="start">
      //       <SearchIcon />
      //     </InputAdornment>
      //   ),
      //   sx: {
      //     background: "transparent",
      //     "& input": {
      //       position: "relative",
      //       zIndex: 2,
      //     },
      //   },
      // }}
      />
    </Box>
  );
}
