document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value;
    const url = `https://kitsu.io/api/edge/characters?filter[name]=${searchInput}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const characterInfo = document.getElementById('characterInfo');
            characterInfo.innerHTML = '';

            if (data.data.length > 0) {
                const character = data.data[0].attributes;
                characterInfo.innerHTML = `
                    <h2>${character.name}</h2>
                    <p>${character.description}</p>
                    <img src="${character.image.original}" alt="${character.name}" style="width:100%;">
                `;
            } else {
                characterInfo.innerHTML = '<p>Nenhum personagem encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
