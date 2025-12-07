import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Chip,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { keyframes } from "@mui/system";

/* ------------------------- */
/*   Surprise Reveal Anim    */
/* ------------------------- */

// Pokémon spinning + scaling reveal
const spinReveal = keyframes`
  0%   { transform: scale(0) rotate(0deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(360deg); opacity: 1; }
  80%  { transform: scale(0.95) rotate(390deg); }
  100% { transform: scale(1) rotate(360deg); }
`;

// Shockwave glow behind Pokémon
const shockwave = keyframes`
  0%   { opacity: 0; transform: scale(0.5); }
  40%  { opacity: 0.35; transform: scale(1.4); }
  100% { opacity: 0; transform: scale(2); }
`;

export default function PokemonModal({ pokemon, onClose }) {

  const primaryType = pokemon.types?.[0]?.type?.name || "normal";

  const typeColors = {
    fire: "#ff6b6b",
    water: "#4dabf7",
    grass: "#69db7c",
    electric: "#ffd43b",
    psychic: "#e599f7",
    ice: "#74c0fc",
    dragon: "#9775fa",
    fairy: "#f783ac",
    dark: "#495057",
    bug: "#a9d94b",
    poison: "#b197fc",
    rock: "#c6b38e",
    ground: "#e9c46a",
    ghost: "#a78bfa",
    fighting: "#d9480f",
    flying: "#91a7ff",
    steel: "#ced4da",
    normal: "#868e96",
  };

  const accent = typeColors[primaryType] || "#aaa";

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          overflow: "hidden",
          border: `2px solid ${accent}`,
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ textAlign: "center", position: "relative" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textTransform="capitalize"
          sx={{ textShadow: "0px 2px 5px rgba(0,0,0,0.2)" }}
        >
          {pokemon.name}
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Shockwave Glow */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {/* Expanding Circle - Surprise Shockwave */}
          <Box
            sx={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: accent,
              animation: `${shockwave} 1s ease-out`,
              filter: "blur(10px)",
            }}
          />

          {/* Pokémon Image with Spin Reveal */}
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            style={{
              width: 120,
              height: 120,
              zIndex: 2,
              animation: `${spinReveal} 0.9s cubic-bezier(0.25, 1.4, 0.4, 1)`,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
            }}
          />
        </Box>

        {/* Types */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Types
        </Typography>
        <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
          {pokemon.types.map((t) => (
            <Chip
              key={t.type.name}
              label={t.type.name}
              sx={{
                textTransform: "capitalize",
                background: accent,
                color: "#fff",
              }}
            />
          ))}
        </Box>

        {/* Abilities */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Abilities
        </Typography>
        <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
          {pokemon.abilities.map((a) => (
            <Chip
              key={a.ability.name}
              label={a.ability.name}
              variant="outlined"
              sx={{
                textTransform: "capitalize",
                borderColor: accent,
              }}
            />
          ))}
        </Box>

        {/* Stats */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Stats
        </Typography>

        <Grid container spacing={1}>
          {pokemon.stats.map((s) => (
            <Grid item xs={6} key={s.stat.name}>
              <Typography textTransform="capitalize">
                {s.stat.name}: <strong>{s.base_stat}</strong>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
