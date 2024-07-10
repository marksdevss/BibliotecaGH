document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-bar').style.display = 'none';
    displayFavorites(); // Chama a função ao carregar a página
});

function handleFilterChange() {
    const filterType = document.getElementById('filter-type').value;
    const searchBar = document.getElementById('search-bar');

    if (filterType === 'character') {
        searchBar.style.display = 'block';
    } else {
        searchBar.style.display = 'none';
        displayFavorites(); // Atualiza a exibição dos favoritos ao mudar o filtro
    }
}

function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const filterType = document.getElementById('filter-type').value;
    favoritesContainer.innerHTML = '';

    const currentUser = localStorage.getItem('currentUser'); // Pega o usuário atual do localStorage
    if (currentUser) {
        const user = JSON.parse(localStorage.getItem(currentUser));
        if (user && user.library) {
            user.library.forEach(item => {
                if (filterType === 'all' || filterType === item.type) {
                    const itemCard = document.createElement('div');
                    itemCard.classList.add(item.type === 'anime' ? 'anime-card' : 'manga-card');
                    itemCard.innerHTML = `
                        <img src="${item.attributes.posterImage.small}" alt="${item.attributes.titles.en_jp}">
                        <h3>${item.attributes.titles.en_jp}</h3>
                        <p>${item.attributes.synopsis}</p>
                        <p><strong>Data de Início:</strong> ${item.attributes.startDate}</p>
                        <p><strong>${item.type === 'anime' ? 'Episódios' : 'Capítulos'}:</strong> ${item.attributes.episodeCount || item.attributes.chapterCount}</p>
                        <p><strong>Avaliação Média:</strong> ${item.attributes.averageRating}</p>
                    `;
                    favoritesContainer.appendChild(itemCard);
                }
            });
        } else {
            favoritesContainer.innerHTML = '<p>Nenhum item na biblioteca.</p>';
        }
    } else {
        favoritesContainer.innerHTML = '<p>Nenhum usuário logado.</p>';
    }
}
