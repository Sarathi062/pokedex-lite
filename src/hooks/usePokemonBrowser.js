// src/hooks/usePokemonBrowser.js
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;

export default function usePokemonBrowser(typeFilter, searchText, page) {
  const [allPokemon, setAllPokemon] = useState([]); // [{ name, url }]
  const [typePokemon, setTypePokemon] = useState(null); // [{ name, url }] for selected type
  const [details, setDetails] = useState([]); // current page details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Load all Pokémon names once (for global search and "All types")
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0"
        );
        const data = await res.json();
        if (!cancelled) {
          setAllPokemon(data.results); // [{ name, url }]
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Load Pokémon list for selected type
  useEffect(() => {
    if (!typeFilter) {
      setTypePokemon(null);
      return;
    }

    let cancelled = false;

    async function loadType() {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`);
        const data = await res.json();

        if (!cancelled) {
          const mapped = data.pokemon.map((p) => p.pokemon); // { name, url }
          setTypePokemon(mapped);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadType();
    return () => {
      cancelled = true;
    };
  }, [typeFilter]);

  // 3) Build base list depending on filter
  const baseList = useMemo(() => {
    const source = typeFilter && typePokemon ? typePokemon : allPokemon;

    if (!source) return [];

    if (!searchText) return source;

    const lower = searchText.toLowerCase();
    return source.filter((p) => p.name.toLowerCase().includes(lower));
  }, [allPokemon, typePokemon, typeFilter, searchText]);

  // 4) Suggestions: top names starting with searchText
  const suggestions = useMemo(() => {
    if (!searchText) return [];

    const lower = searchText.toLowerCase();
    return baseList
      .filter((p) => p.name.toLowerCase().startsWith(lower))
      .slice(0, 5)
      .map((p) => p.name);
  }, [baseList, searchText]);

  const totalCount = baseList.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasNextPage = page + 1 < totalPages;

  // 5) Fetch details for current page slice
  useEffect(() => {
    if (!baseList || baseList.length === 0) {
      setDetails([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      try {
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const slice = baseList.slice(start, end);

        const detailed = await Promise.all(
          slice.map(async (p) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );

        if (!cancelled) {
          setDetails(detailed);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [baseList, page]);

  return {
    pokemon: details, // current page details for cards
    loading,
    error,
    totalCount,
    hasNextPage,
    suggestions,
  };
}
