// api.js — small wrapper around PokeAPI fetch to be reusable in browser and Node tests
;(function(root){
  const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';

  async function fetchPokemon(query){
    if(!query) throw new Error('Missing query');
    const url = API_BASE + encodeURIComponent(String(query).trim().toLowerCase());
    const res = await fetch(url);
    if(!res.ok){
      const err = new Error('Pokémon non trouvé');
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  // Export for CommonJS/Node and attach to window for browser
  if(typeof module !== 'undefined' && module.exports){
    module.exports = { fetchPokemon };
  } else {
    root.fetchPokemon = fetchPokemon;
  }
})(typeof window !== 'undefined' ? window : globalThis);
