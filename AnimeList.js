document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchType = document.getElementById('search-type').value;
    const searchInput = document.getElementById('search-input').value;
    searchMedia(searchInput, searchType);
});

function searchMedia(query, type) {
    fetch(`https://kitsu.io/api/edge/${type}?filter[text]=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';
            data.data.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add(type === 'anime' ? 'anime-card' : 'manga-card');
                const details = translateDetails(item.attributes, type);
                itemCard.innerHTML = `
                    <img src="${details.posterImage}" alt="${details.title}">
                    <h3>${details.title}</h3>
                    <p>${details.synopsis}</p>
                    <p><strong>Data de Início:</strong> ${details.startDate}</p>
                    <p><strong>${type === 'anime' ? 'Episódios' : 'Capítulos'}:</strong> ${details.count}</p>
                    <p><strong>Avaliação Média:</strong> ${details.averageRating}</p>
                    <button onclick="viewCharacters('${item.id}', '${type}')">Ver Personagens</button>
                    <div class="characters-container" id="characters-${item.id}"></div>
                `;
                resultsContainer.appendChild(itemCard);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function translateDetails(attributes, type) {
    return {
        title: attributes.titles.en_jp || attributes.titles.ja_jp || attributes.titles.en,
        posterImage: attributes.posterImage ? attributes.posterImage.small : 'default-image-url', // Substitua 'default-image-url' por uma URL de imagem padrão, se necessário
        synopsis: attributes.synopsis || 'Sinopse não disponível',
        startDate: attributes.startDate ? new Date(attributes.startDate).toLocaleDateString('pt-BR') : 'Desconhecida',
        count: type === 'anime' ? attributes.episodeCount || 'Desconhecido' : attributes.chapterCount || 'Desconhecido',
        averageRating: attributes.averageRating || 'Não avaliado'
    };
}

function viewCharacters(id, type) {
    fetch(`https://kitsu.io/api/edge/${type}/${id}/characters`)
        .then(response => response.json())
        .then(data => {
            const charactersContainer = document.getElementById(`characters-${id}`);
            charactersContainer.innerHTML = '';

            if (data.data.length > 0) {
                data.data.forEach(character => {
                    const charAttributes = character.attributes;
                    const charItem = document.createElement('div');
                    charItem.classList.add('character-item');
                    charItem.innerHTML = `
                        <p><strong>${charAttributes.canonicalName || 'Nome não disponível'}</strong></p>
                        <img src="${charAttributes.image ? charAttributes.image.original : 'default-image-url'}" alt="${charAttributes.canonicalName || 'Nome não disponível'}">
                    `;
                    charactersContainer.appendChild(charItem);
                });
            } else {
                charactersContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar personagens:', error);
        });
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('results-container').innerHTML = '';
}

function viewDetails(id, type) {
    window.location.href = `mangaInfo.html?id=${id}&type=${type}`;
}
