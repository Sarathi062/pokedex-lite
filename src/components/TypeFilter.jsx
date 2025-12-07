import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function TypeFilter({ value, onChange }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((data) => setTypes(data.results))
      .catch(() => setTypes([]));
  }, []);

  return (
    <FormControl fullWidth sx={{ minWidth: 180 }}>
      <InputLabel>Type</InputLabel>

      <Select
        value={value}
        label="Type"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">All Types</MenuItem>

        {types.map((t) => (
          <MenuItem
            key={t.name}
            value={t.name}
            sx={{ textTransform: "capitalize" }}
          >
            {t.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
