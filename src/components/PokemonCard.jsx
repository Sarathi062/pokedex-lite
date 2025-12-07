import { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getFavorites, toggleFavorite } from "../utils/favorites";

export default function PokemonCard({ pokemon, onClick }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(getFavorites().includes(pokemon.name));
  }, [pokemon.name]);

  const toggle = (e) => {
    e.stopPropagation();
    const updated = toggleFavorite(pokemon.name);
    setFavorite(updated.includes(pokemon.name));
  };

  return (
    <Card
      elevation={4}
      sx={{
        position: "relative",
        borderRadius: 3,
        cursor: "pointer",

        // 🔒 Fix card height
        height: 200,
        overflow: "hidden",

        // Smooth hover without layout shift
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px) scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        {/* ♥ Favorite Button */}
        <IconButton
          onClick={toggle}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            zIndex: 3,
            color: favorite ? "error.main" : "grey.500",
          }}
        >
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        {/* Pokémon Image — locked height */}
        <Box
          sx={{
            height: 100,           // 🔒 Fix image container height
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            style={{
              width: 200,
              height: 90,
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </Box>

        {/* Pokémon Name — locked height */}
        <CardContent
          sx={{
            p: 0,
            mt: 1,
            height: 40,     // 🔒 Fix name box height
            // 🔒 Fix name box height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            align="center"
            textTransform="capitalize"
            fontWeight="bold"
            noWrap
          >
            {pokemon.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
