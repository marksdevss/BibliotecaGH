document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchInput = document.getElementById('search-input').value;
    searchCharacters(searchInput);
});

function searchCharacters(animeTitle) {
    fetch(`https://kitsu.io/api/edge/anime?filter[text]=${animeTitle}`)
        .then(response => response.json())
        .then(data => {
            const animeId = data.data[0].id;
            fetchCharacters(animeId);
        })
        .catch(error => {
            console.error('Erro ao buscar anime:', error);
        });
}

function fetchCharacters(animeId) {
    fetch(`https://kitsu.io/api/edge/anime/${animeId}/characters`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';

            if (data.data.length > 0) {
                const topCharacters = data.data.slice(0, 3);
                topCharacters.forEach(character => {
                    const charAttributes = character.attributes;
                    const charItem = document.createElement('div');
                    charItem.classList.add('character-item');
                    charItem.innerHTML = `
                        <p><strong>${charAttributes.canonicalName || 'Nome não disponível'}</strong></p>
                        <img src="${charAttributes.image ? charAttributes.image.original : 'default-image-url'}" alt="${charAttributes.canonicalName || 'Nome não disponível'}">
                    `;
                    resultsContainer.appendChild(charItem);
                });
            } else {
                resultsContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar personagens:', error);
        });
}
