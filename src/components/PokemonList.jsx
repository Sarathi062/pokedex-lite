import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";

import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import PokemonModal from "./PokemonModal";

import {
  getFavorites,
  subscribeToFavorites
} from "../utils/favorites";

export default function PokemonList({
  pokemon,
  loading,
  error,
  page,
  setPage,
  hasNextPage,
  search,
}) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // 0 = All Pokémon, 1 = Liked Pokémon
  const [tab, setTab] = useState(0);

  const [favoriteList, setFavoriteList] = useState(getFavorites());
  const [favoriteDetails, setFavoriteDetails] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  /** 🔥 Auto-switch to All Pokémon when the user searches */
  useEffect(() => {
    if (tab === 1) {
      setTab(0);
    }
  }, [search, pokemon]);

  /** Listen to favorites changes globally */
  useEffect(() => {
    setFavoriteList(getFavorites());

    const unsubscribe = subscribeToFavorites((updated) => {
      setFavoriteList(updated);
    });

    return unsubscribe;
  }, []);

  /** Load favorites details whenever:
   *  - Tab is "Liked Pokémon"
   *  - Favorites list changes
   */
  useEffect(() => {
    if (tab !== 1) return;

    const favs = favoriteList;
    if (!favs.length) {
      setFavoriteDetails([]);
      return;
    }

    async function loadDetails() {
      setLoadingFavorites(true);

      const result = await Promise.all(
        favs.map(async (name) => {
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await res.json();
            return data && data.name ? data : null;
          } catch {
            return null;
          }
        })
      );

      setFavoriteDetails(result.filter(Boolean));
      setLoadingFavorites(false);
    }

    loadDetails();
  }, [tab, favoriteList]);

  /** Choose between all Pokémon & favorites */
  const currentList = tab === 0 ? pokemon : favoriteDetails;

  // Safe normalize for case-insensitive search
  const normalize = (str) =>
    (str || "").toString().trim().replace(/\s+/g, "").toUpperCase();

  const searchKey = normalize(search);

  const displayedPokemon = currentList.filter((p) => {
    const nameKey = normalize(p?.name);
    return nameKey.includes(searchKey);
  });

  /** Loading state */
  if ((loading && pokemon.length === 0) || loadingFavorites) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  /** Error state */
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4, textAlign: "center" }}>
        Failed to load Pokémon.
      </Alert>
    );
  }

  return (
    <>
      {/* Header with tabs */}
      <Stack
        direction="column"
        alignItems="center"
        spacing={1}
        mb={2}
        mt={1}
      >
        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          textColor="error"
          indicatorColor="error"
        >
          <Tab label="All Pokémon" sx={{ fontWeight: "bold" }} />
          <Tab label="Liked Pokémon" sx={{ fontWeight: "bold" }} />
        </Tabs>
      </Stack>

      {/* Main grid */}
      <Box sx={{ position: "relative", minHeight: "460px" }}>
        {displayedPokemon.length === 0 ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No Pokémon found.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(5, 1fr)",
              },
            }}
          >
            {displayedPokemon.map((p) => (
              <PokemonCard
                key={p.name}
                pokemon={p}
                onClick={() => setSelectedPokemon(p)}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Pagination only for "All Pokémon" tab */}
      {tab === 0 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
        </Box>
      )}

      {/* Modal */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </>
  );
}
