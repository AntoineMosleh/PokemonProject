// main.js — handles search, fetch from PokeAPI, render list and Chart.js
(function(){
	const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';

	// DOM
	const searchScreen = document.getElementById('search-screen');
	const detailScreen = document.getElementById('detail-screen');
	const searchForm = document.getElementById('search-form');
	const searchInput = document.getElementById('search-input');
	const searchError = document.getElementById('search-error');
	const backBtn = document.getElementById('back-btn');

	const pokemonSprite = document.getElementById('pokemon-sprite');
	const pokemonName = document.getElementById('pokemon-name');
	const pokemonTypes = document.getElementById('pokemon-types');
	const statsList = document.getElementById('stats-list');
	const detailError = document.getElementById('detail-error');
	const chartCanvas = document.getElementById('stats-chart');

	let currentChart = null;

	function showSearch(){
		detailScreen.classList.add('hidden');
		searchScreen.classList.remove('hidden');
		searchError.classList.add('hidden');
		searchInput.focus();
	}

	function showDetail(){
		searchScreen.classList.add('hidden');
		detailScreen.classList.remove('hidden');
	}

	function showError(targetEl, message){
		targetEl.textContent = message;
		targetEl.classList.remove('hidden');
	}

	async function fetchPokemon(query){
		const url = API_BASE + encodeURIComponent(String(query).trim().toLowerCase());
		const res = await fetch(url);
		if(!res.ok){
			const err = new Error(`Pokémon non trouvé`);
			err.status = res.status;
			throw err;
		}
		return res.json();
	}

	function renderPokemon(data){
		// Basic info
		pokemonName.textContent = `${data.name} #${data.id}`;
		const sprite = data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default || '';
		pokemonSprite.src = sprite || '';
		pokemonSprite.alt = data.name;

		// types
		pokemonTypes.innerHTML = '';
		data.types.forEach(t=>{
			const el = document.createElement('span');
			el.className = 'type';
			el.textContent = t.type.name;
			pokemonTypes.appendChild(el);
		});

		// stats list
		statsList.innerHTML = '';
		const labels = [];
		const values = [];
		data.stats.forEach(s=>{
			const li = document.createElement('li');
			li.innerHTML = `<span style="text-transform:capitalize">${s.stat.name}</span><strong>${s.base_stat}</strong>`;
			statsList.appendChild(li);
			labels.push(s.stat.name);
			values.push(s.base_stat);
		});

		// Chart (bar)
		if(currentChart){
			try{ currentChart.destroy(); }catch(e){/* ignore */}
		}

		const ctx = chartCanvas.getContext('2d');
		currentChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels.map(l=>l.toUpperCase()),
				datasets: [{
					label: 'Valeur (base stat)',
					data: values,
					backgroundColor: 'rgba(239,83,80,0.7)',
					borderColor: 'rgba(239,83,80,1)',
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: { beginAtZero: true }
				},
				plugins: {
					legend: { display: false }
				}
			}
		});
	}

	// Event handlers
	searchForm.addEventListener('submit', async (ev)=>{
		ev.preventDefault();
		const q = searchInput.value.trim();
		if(!q){
			showError(searchError, 'Veuillez entrer un nom ou un ID.');
			return;
		}
		searchError.classList.add('hidden');
		try{
			const data = await fetchPokemon(q);
			renderPokemon(data);
			showDetail();
		}catch(err){
			showError(searchError, err.message || 'Erreur lors de la recherche');
		}
	});

	backBtn.addEventListener('click', ()=>{
		showSearch();
		// cleanup
		detailError.classList.add('hidden');
	});

		// --- Comparison UI ---
		const compareScreen = document.getElementById('compare-screen');
		const compareForm = document.getElementById('compare-form');
		const compareInput1 = document.getElementById('compare-input-1');
		const compareInput2 = document.getElementById('compare-input-2');
		const backCompareBtn = document.getElementById('back-compare-btn');
		const compareError = document.getElementById('compare-error');
		const compareResults = document.getElementById('compare-results');

		const compareSprite1 = document.getElementById('compare-sprite-1');
		const compareName1 = document.getElementById('compare-name-1');
		const compareTypes1 = document.getElementById('compare-types-1');
		const compareStats1 = document.getElementById('compare-stats-1');

		const compareSprite2 = document.getElementById('compare-sprite-2');
		const compareName2 = document.getElementById('compare-name-2');
		const compareTypes2 = document.getElementById('compare-types-2');
		const compareStats2 = document.getElementById('compare-stats-2');

		const compareChartCanvas = document.getElementById('compare-chart');
		let compareChart = null;

		// Show compare screen helper
		function showCompare(){
			searchScreen.classList.add('hidden');
			detailScreen.classList.add('hidden');
			compareScreen.classList.remove('hidden');
			compareError.classList.add('hidden');
			compareResults.classList.add('hidden');
			compareInput1.focus();
		}

		backCompareBtn.addEventListener('click', ()=>{
			showSearch();
		});

		// Provide a small helper to fetch two pokemons in parallel
		async function fetchTwo(p1, p2){
			const [a,b] = await Promise.all([fetchPokemon(p1), fetchPokemon(p2)]);
			return [a,b];
		}

		function renderCompare(poke1, poke2){
			// Common labels from poke1.stats order
			const labels = poke1.stats.map(s=>s.stat.name.toUpperCase());
			const values1 = poke1.stats.map(s=>s.base_stat);
			const values2 = poke2.stats.map(s=>s.base_stat);

			// Card 1
			compareName1.textContent = `${poke1.name} #${poke1.id}`;
			compareSprite1.src = poke1.sprites?.other?.['official-artwork']?.front_default || poke1.sprites?.front_default || '';
			compareTypes1.innerHTML = '';
			poke1.types.forEach(t=>{const el=document.createElement('span');el.className='type';el.textContent=t.type.name;compareTypes1.appendChild(el)});
			compareStats1.innerHTML = '';
			poke1.stats.forEach(s=>{const li=document.createElement('li');li.innerHTML=`<span style="text-transform:capitalize">${s.stat.name}</span><strong>${s.base_stat}</strong>`; compareStats1.appendChild(li)});

			// Card 2
			compareName2.textContent = `${poke2.name} #${poke2.id}`;
			compareSprite2.src = poke2.sprites?.other?.['official-artwork']?.front_default || poke2.sprites?.front_default || '';
			compareTypes2.innerHTML = '';
			poke2.types.forEach(t=>{const el=document.createElement('span');el.className='type';el.textContent=t.type.name;compareTypes2.appendChild(el)});
			compareStats2.innerHTML = '';
			poke2.stats.forEach(s=>{const li=document.createElement('li');li.innerHTML=`<span style="text-transform:capitalize">${s.stat.name}</span><strong>${s.base_stat}</strong>`; compareStats2.appendChild(li)});

			// Chart (radar)
			if(compareChart){ try{ compareChart.destroy(); }catch(e){} }
			const ctx = compareChartCanvas.getContext('2d');
			compareChart = new Chart(ctx, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [
						{
							label: poke1.name,
							data: values1,
							backgroundColor: 'rgba(239,83,80,0.25)',
							borderColor: 'rgba(239,83,80,1)'
						},
						{
							label: poke2.name,
							data: values2,
							backgroundColor: 'rgba(54,162,235,0.25)',
							borderColor: 'rgba(54,162,235,1)'
						}
					]
				},
				options: {responsive:true, maintainAspectRatio:false, scales:{r:{beginAtZero:true}}}
			});

			compareResults.classList.remove('hidden');
		}

		// Wire compare form
		compareForm.addEventListener('submit', async (ev)=>{
			ev.preventDefault();
			const q1 = compareInput1.value.trim();
			const q2 = compareInput2.value.trim();
			if(!q1 || !q2){ showError(compareError, 'Veuillez entrer deux noms ou IDs.'); return; }
			compareError.classList.add('hidden');
			try{
				const [a,b] = await fetchTwo(q1, q2);
				renderCompare(a,b);
			}catch(err){ showError(compareError, err.message || 'Erreur lors de la comparaison'); }
		});

		// Expose a small way to open compare: allow Ctrl key on search input + C to open compare
		searchInput.addEventListener('keydown', (e)=>{
			if(e.ctrlKey && (e.key === 'c' || e.key === 'C')){ e.preventDefault(); showCompare(); }
		});

		// Add a small link to open compare from the search screen (add element dynamically)
		(function addCompareLink(){
			const link = document.createElement('button');
			link.type = 'button';
			link.textContent = 'Comparer 2 Pokémon';
			link.className = 'back';
			link.style.marginLeft = '8px';
			link.addEventListener('click', showCompare);
			const form = document.getElementById('search-form');
			form.appendChild(link);
		})();

	// Allow Enter in input to submit
	searchInput.addEventListener('keyup', (e)=>{
		if(e.key === 'Enter') searchForm.dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}));
	});

	// init
	showSearch();
})();

