import { useEffect, useState } from "react";

export default function usePokemon(page, selectedType, limit = 20) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalCount, setTotalCount] = useState(null); // for pagination

  useEffect(() => {
    let cancelled = false;

    async function fetchPokemon() {
      setLoading(true);
      setError(false);

      try {
        let detailedData = [];
        let total = 0;

        if (!selectedType) {
          // ✅ Normal paginated list
          const offset = page * limit;
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
          );
          const data = await res.json();
          total = data.count;

          detailedData = await Promise.all(
            data.results.map(async (p) => {
              const detailRes = await fetch(p.url);
              return detailRes.json();
            })
          );
        } else {
          // ✅ Type-based fetch
          const typeRes = await fetch(
            `https://pokeapi.co/api/v2/type/${selectedType}`
          );
          const typeData = await typeRes.json();

          const allForType = typeData.pokemon.map((p) => p.pokemon); // { name, url }
          total = allForType.length;

          const start = page * limit;
          const end = start + limit;
          const slice = allForType.slice(start, end);

          detailedData = await Promise.all(
            slice.map(async (p) => {
              const detailRes = await fetch(p.url);
              return detailRes.json();
            })
          );
        }

        if (!cancelled) {
          setPokemon(detailedData);
          setTotalCount(total);
        }
      } catch (err) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPokemon();

    return () => {
      cancelled = true;
    };
  }, [page, selectedType, limit]);

  const hasNextPage =
    totalCount !== null ? (page + 1) * limit < totalCount : true;

  return { pokemon, loading, error, hasNextPage };
}
