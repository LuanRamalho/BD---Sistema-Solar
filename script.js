// Verifica em qual página está o script sendo executado
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('planetForm')) {
        // Página de Cadastro
        const planetForm = document.getElementById('planetForm');

        planetForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Coleta os dados do formulário
            const nome = document.getElementById('nome').value.trim();
            const rotacao = document.getElementById('rotacao').value.trim();
            const translacao = document.getElementById('translacao').value.trim();
            const diametro = document.getElementById('diametro').value.trim();
            const temperatura = document.getElementById('temperatura').value.trim();
            const distancia = document.getElementById('distancia').value.trim();
            const imagem = document.getElementById('imagem').value.trim();

            // Cria um objeto planeta
            const planeta = {
                id: Date.now(),
                nome,
                rotacao,
                translacao,
                diametro,
                temperatura,
                distancia,
                imagem
            };

            // Recupera planetas existentes do localStorage
            let planetas = JSON.parse(localStorage.getItem('planetas')) || [];

            // Adiciona o novo planeta
            planetas.push(planeta);

            // Salva de volta no localStorage
            localStorage.setItem('planetas', JSON.stringify(planetas));

            // Limpa o formulário
            planetForm.reset();

            alert('Planeta cadastrado com sucesso!');
        });
    }

    if (document.getElementById('planetsTable')) {
        // Página de Exibição
        const planetsTableBody = document.querySelector('#planetsTable tbody');
        const searchBar = document.getElementById('searchBar');

        // Função para exibir os planetas na tabela
        function displayPlanets(planetas) {
            planetsTableBody.innerHTML = '';

            planetas.forEach(planeta => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${planeta.nome}</td>
                    <td>${planeta.rotacao}</td>
                    <td>${planeta.translacao}</td>
                    <td>${planeta.diametro}</td>
                    <td>${planeta.temperatura}</td>
                    <td>${planeta.distancia}</td>
                    <td><img src="${planeta.imagem}" alt="${planeta.nome}"></td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${planeta.id}">Editar</button>
                        <button class="action-btn delete-btn" data-id="${planeta.id}">Excluir</button>
                    </td>
                `;

                planetsTableBody.appendChild(tr);
            });
        }

        // Função para carregar os planetas do localStorage
        function loadPlanets() {
            let planetas = JSON.parse(localStorage.getItem('planetas')) || [];
            displayPlanets(planetas);
        }

        loadPlanets();

        // Função de busca
        searchBar.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            let planetas = JSON.parse(localStorage.getItem('planetas')) || [];

            const filteredPlanetas = planetas.filter(planeta => 
                planeta.nome.toLowerCase().includes(searchTerm)
            );

            displayPlanets(filteredPlanetas);
        });

        // Delegação de eventos para Editar e Excluir
        planetsTableBody.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.getAttribute('data-id');
                deletePlanet(id);
            }

            if (e.target.classList.contains('edit-btn')) {
                const id = e.target.getAttribute('data-id');
                editPlanet(id);
            }
        });

        // Função para deletar um planeta
        function deletePlanet(id) {
            if (confirm('Tem certeza que deseja excluir este planeta?')) {
                let planetas = JSON.parse(localStorage.getItem('planetas')) || [];
                planetas = planetas.filter(planeta => planeta.id != id);
                localStorage.setItem('planetas', JSON.stringify(planetas));
                loadPlanets();
            }
        }

        // Função para editar um planeta
        function editPlanet(id) {
            let planetas = JSON.parse(localStorage.getItem('planetas')) || [];
            const planeta = planetas.find(p => p.id == id);

            if (planeta) {
                // Cria um formulário de edição
                const tr = [...planetsTableBody.children].find(row => {
                    return row.querySelector('.edit-btn').getAttribute('data-id') == id;
                });

                tr.innerHTML = `
                    <td><input type="text" value="${planeta.nome}" id="nome-${id}"></td>
                    <td><input type="text" value="${planeta.rotacao}" id="rotacao-${id}"></td>
                    <td><input type="text" value="${planeta.translacao}" id="translacao-${id}"></td>
                    <td><input type="text" value="${planeta.diametro}" id="diametro-${id}"></td>
                    <td><input type="text" value="${planeta.temperatura}" id="temperatura-${id}"></td>
                    <td><input type="text" value="${planeta.distancia}" id="distancia-${id}"></td>
                    <td><input type="url" value="${planeta.imagem}" id="imagem-${id}"></td>
                    <td>
                        <button class="action-btn save-btn" data-id="${id}">Salvar</button>
                        <button class="action-btn cancel-btn" data-id="${id}">Cancelar</button>
                    </td>
                `;

                // Adiciona evento para salvar a edição
                tr.querySelector('.save-btn').addEventListener('click', function() {
                    saveEdit(id);
                });

                // Adiciona evento para cancelar a edição
                tr.querySelector('.cancel-btn').addEventListener('click', function() {
                    loadPlanets();
                });
            }
        }

        // Função para salvar a edição
        function saveEdit(id) {
            const nome = document.getElementById(`nome-${id}`).value.trim();
            const rotacao = document.getElementById(`rotacao-${id}`).value.trim();
            const translacao = document.getElementById(`translacao-${id}`).value.trim();
            const diametro = document.getElementById(`diametro-${id}`).value.trim();
            const temperatura = document.getElementById(`temperatura-${id}`).value.trim();
            const distancia = document.getElementById(`distancia-${id}`).value.trim();
            const imagem = document.getElementById(`imagem-${id}`).value.trim();

            let planetas = JSON.parse(localStorage.getItem('planetas')) || [];
            const planetaIndex = planetas.findIndex(p => p.id == id);

            if (planetaIndex > -1) {
                planetas[planetaIndex] = {
                    id: Number(id),
                    nome,
                    rotacao,
                    translacao,
                    diametro,
                    temperatura,
                    distancia,
                    imagem
                };

                localStorage.setItem('planetas', JSON.stringify(planetas));
                loadPlanets();
                alert('Planeta atualizado com sucesso!');
            }
        }
    }
});
