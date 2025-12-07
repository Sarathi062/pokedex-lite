import { useEffect, useState } from "react";

export default function usePokemonNames() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    async function fetchNames() {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0"
        );
        const data = await res.json();
        setNames(data.results.map((p) => p.name));
      } catch {
        setNames([]);
      }
    }

    fetchNames();
  }, []);

  return names;
}
