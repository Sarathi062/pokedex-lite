import {
  Container,
  Typography,
  Box,
  Divider,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

import PokemonList from "./components/PokemonList";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";

import usePokemonBrowser from "./hooks/usePokemonBrowser";
import { useState, useEffect } from "react";

// Load Google script globally (only once)
const loadGoogleScript = () => {
  const existingScript = document.getElementById("google-oauth");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-oauth";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
};

export default function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadGoogleScript();

    const savedUser = localStorage.getItem("pokedex_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);


  useEffect(() => {
    if (!window.google) return;

    if (!user) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        {
          theme: "filled_blue",
          size: "large",
          width: "250",
        }
      );
    }
  }, [user]);

  function handleLogin(response) {
    const jwt = response.credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));

    const userData = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      jwt,
    };

    localStorage.setItem("pokedex_user", JSON.stringify(userData));
    setUser(userData);
  }

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const { pokemon, loading, error, hasNextPage, suggestions } =
    usePokemonBrowser(typeFilter, search, page);

  return (
    <>

      {!user && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: 14,
              width: 330,
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>
              Login to Continue
            </h2>
            <div id="google-login-btn"></div>
          </div>
        </div>
      )}


      <Container maxWidth="lg" sx={{ pb: 5, opacity: user ? 1 : 0.4, pointerEvents: user ? "auto" : "none" }}>


        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: "white",
              p: 2,
              borderRadius: 3,
              mb: 3,
              boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={user.picture}
              alt="profile"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="gray">
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
        <Box
          textAlign="center"
          mt={{ xs: 3, md: 5 }}
          mb={{ xs: 3, md: 5 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <CatchingPokemonIcon
            sx={{
              fontSize: 55,
              color: "primary.main",
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
            }}
          />

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              textShadow: "0 3px 6px rgba(0,0,0,0.15)",
              letterSpacing: 0.5,
            }}
          >
            Pokedex Lite
          </Typography>

          <Divider
            sx={{
              width: 140,
              mt: 1.5,
              borderWidth: 2,
              borderColor: "primary.main",
            }}
          />
        </Box>


        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            elevation={3}
            sx={{
              width: "100%",
              borderRadius: 3,
              mb: 4,
              p: { xs: 1.5, sm: 2, md: 3 },
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
              >
                {/* Search Input */}
                <Box sx={{ flex: 1 }}>
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    suggestions={suggestions}
                    onSelectSuggestion={(name) => setSearch(name)}
                  />
                </Box>

                {/* Type Filter */}
                <Box
                  sx={{
                    width: { xs: "100%", sm: "60%", md: 240 },
                    minWidth: { md: 180 },
                  }}
                >
                  <TypeFilter value={typeFilter} onChange={setTypeFilter} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <PokemonList
          pokemon={pokemon}
          loading={loading}
          error={error}
          page={page}
          setPage={setPage}
          hasNextPage={hasNextPage}
          search={search}
        />
      </Container>
    </>
  );
}
