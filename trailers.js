document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchInput = document.getElementById('search-input').value;
    searchAnimeTrailers(searchInput);
});

function searchAnimeTrailers(query) {
    fetch(`https://kitsu.io/api/edge/anime?filter[text]=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';

            if (data.data.length > 0) {
                data.data.forEach(anime => {
                    const animeCard = document.createElement('div');
                    animeCard.classList.add('trailer-item');
                    animeCard.innerHTML = `
                        <h3>${anime.attributes.titles.en || anime.attributes.titles.en_jp || anime.attributes.titles.ja_jp}</h3>
                        <img src="${anime.attributes.posterImage.small}" alt="${anime.attributes.titles.en || anime.attributes.titles.en_jp || anime.attributes.titles.ja_jp}">
                        <button onclick="viewAnimeTrailer('${anime.id}')">Ver Trailers</button>
                        <div class="trailers-container" id="trailers-${anime.id}"></div>
                    `;
                    resultsContainer.appendChild(animeCard);
                });
            } else {
                resultsContainer.innerHTML = '<p>Nenhum anime encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar animes:', error);
        });
}

function viewAnimeTrailer(animeId) {
    fetch(`https://kitsu.io/api/edge/anime/${animeId}/streaming-links`)
        .then(response => response.json())
        .then(data => {
            const trailersContainer = document.getElementById(`trailers-${animeId}`);
            trailersContainer.innerHTML = '';

            if (data.data.length > 0) {
                data.data.forEach(link => {
                    const linkAttributes = link.attributes;
                    const trailerItem = document.createElement('div');
                    trailerItem.classList.add('trailer-item');
                    trailerItem.innerHTML = `
                        <h4>${linkAttributes.title || 'Trailer'}</h4>
                        <a href="${linkAttributes.url}" target="_blank">
                            <img src="${linkAttributes.thumbnail}" alt="${linkAttributes.title || 'Trailer'}">
                        </a>
                    `;
                    trailersContainer.appendChild(trailerItem);
                });
            } else {
                trailersContainer.innerHTML = '<p>Nenhum trailer encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar trailers:', error);
        });
}
