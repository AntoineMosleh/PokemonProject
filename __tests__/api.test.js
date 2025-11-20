const { fetchPokemon } = require('../api');

describe('api.fetchPokemon', ()=>{
  beforeEach(()=>{
    global.fetch = jest.fn();
  });

  afterEach(()=>{
    jest.resetAllMocks();
  });

  it('should throw when missing query', async ()=>{
    await expect(fetchPokemon()).rejects.toThrow();
  });

  it('should throw when response not ok', async ()=>{
    global.fetch.mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchPokemon('not-a-pokemon')).rejects.toThrow(/non trouvé|not found/i);
  });

  it('should return parsed json when ok', async ()=>{
    const payload = { name: 'pikachu', id: 25, stats: [] };
    global.fetch.mockResolvedValue({ ok: true, json: async ()=>payload });
    await expect(fetchPokemon('pikachu')).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalled();
  });
});
