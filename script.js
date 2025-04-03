// Função para filtrar veículos
function filterVehicles(status) {
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const vehicles = document.querySelectorAll('.vehicle');
    const searchTerm = document.getElementById('search').value.toLowerCase();
    
    vehicles.forEach(vehicle => {
        const vehicleStatus = vehicle.classList.contains('online') ? 'online' : 
                             vehicle.classList.contains('offline') ? 'offline' : 'erro';
        const vehicleId = vehicle.getAttribute('data-veiculo');
        const vehicleInfo = veiculoData[vehicleId] || {};
        const vehicleSerie = vehicleInfo.serie ? vehicleInfo.serie.toString() : '';
        
        const matchesStatus = status === 'all' || vehicleStatus === status;
        const matchesSearch = searchTerm === '' || 
                            vehicleId.toLowerCase().includes(searchTerm) || 
                            vehicleSerie.toLowerCase().includes(searchTerm);
        
        vehicle.style.display = matchesStatus && matchesSearch ? 'block' : 'none';
    });
    
    checkNoResults();
}

// Função para buscar veículos
function searchVehicle() {
    filterVehicles('all');
}

// Verifica se não há resultados e exibe mensagem
function checkNoResults() {
    const visibleVehicles = document.querySelectorAll('.vehicle[style="display: block;"]');
    const noResults = document.getElementById('no-results');
    
    if (visibleVehicles.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

// Função para mostrar detalhes do veículo
function showVehicleDetails(prefixo) {
    const modal = document.getElementById('vehicleModal');
    const modalTitle = document.getElementById('modalTitle');
    const vehicleDetails = document.getElementById('vehicleDetails');
    const comunicacoesList = document.getElementById('comunicacoesList');
    
    const veiculo = veiculoData[prefixo] || {};
    const comunicacoes = comunicacoesData[prefixo] || [];
    
    // Preenche os detalhes do veículo
    modalTitle.textContent = `Veículo ${prefixo}`;
    
    let detailsHTML = `
        <div><strong>Prefixo:</strong> ${prefixo}</div>
        <div><strong>Série:</strong> ${veiculo.serie || 'N/A'}</div>
        <div><strong>Versão:</strong> ${veiculo.versao || 'N/A'}</div>
        <div><strong>EOD:</strong> ${veiculo.eod || 'N/A'}</div>
    `;
    
    vehicleDetails.innerHTML = detailsHTML;
    
    // Preenche o histórico de comunicações
    comunicacoesList.innerHTML = '';
    if (comunicacoes.length > 0) {
        comunicacoes.forEach(com => {
            const periodoEmoji = getPeriodoEmoji(new Date(com.dataHora));
            const div = document.createElement('div');
            div.className = 'comunicacao-item';
            div.innerHTML = `
                <span class="periodo-emoji">${periodoEmoji}</span>
                <strong>${com.dataHora || 'N/A'}</strong><br>
                <strong>Série:</strong> ${com.serie || 'N/A'}<br>
                <strong>EOD:</strong> ${com.eod || 'N/A'}
            `;
            comunicacoesList.appendChild(div);
        });
    } else {
        comunicacoesList.innerHTML = '<div>Nenhuma comunicação registrada</div>';
    }
    
    // Mostra o modal
    modal.style.display = 'block';
}

// Função auxiliar para obter emoji do período do dia
function getPeriodoEmoji(date) {
    if (!date || isNaN(date)) return '';
    const hora = date.getHours();
    if (hora >= 0 && hora < 6) return "🌙";
    if (hora >= 6 && hora < 12) return "☀️";
    if (hora >= 12 && hora < 18) return "🌤️";
    return "🌆";
}

// Fechar o modal quando clicar no X
document.querySelector('.close').onclick = function() {
    document.getElementById('vehicleModal').style.display = 'none';
}

// Fechar o modal quando clicar fora dele
window.onclick = function(event) {
    if (event.target == document.getElementById('vehicleModal')) {
        document.getElementById('vehicleModal').style.display = 'none';
    }
}