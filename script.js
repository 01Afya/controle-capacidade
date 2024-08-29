document.addEventListener("DOMContentLoaded", function() {
    const polos = {
        "Campus - Barra da Tijuca": 2763,
        "Campus - Duque de Caxias": 29732,
        "Campus - Nova Iguaçu": 10724,
        "Polo Abaetetuba - PA": 228,
        "Polo Austin": 621,
        "Polo Bangu": 593,
        "Polo Barra da Tijuca - Office Tower": 1025,
        "Polo Barra Mansa": 124,
        "Polo Bragança - PA": 413,
        "Polo Cabo Frio": 255,
        "Polo Campo Grande": 824,
        "Polo Carioca Penha Circular": 1756,
        "Polo Copacabana": 190,
        "Polo Cruzeiro do Sul - AC": 658,
        "Polo Curicica": 412,
        "Polo Fesar Redenção - PA": 472,
        "Polo Fragoso": 831,
        "Polo Garanhuns - PE": 208,
        "Polo Guanambi - BA": 58,
        "Polo Ipatinga - MG": 162,
        "Polo Itabuna - BA": 311,
        "Polo Itacoatiara - AM": 77,
        "Polo Itajubá - MG": 725,
        "Polo Itpac Palmas - TO": 147,
        "Polo Itpac Porto Nacional - TO": 123,
        "Polo Jaboatão dos Guararapes - PE": 54,
        "Polo Ji-Paraná - EAD": 8,
        "Polo João Pessoa - PB": 62,
        "Polo Macaé": 867,
        "Polo Maceió - AL": 497,
        "Polo Madureira": 778,
        "Polo Manacapuru - AM": 424,
        "Polo Marabá - PA": 112,
        "Polo Méier 2 Dias da Cruz": 465,
        "Polo Mesquita": 537,
        "Polo Niterói": 330,
        "Polo Paciência": 135,
        "POLO PALHOÇA - SC - Centro Educacional Porta do Céu": 125,
        "Polo Parnaíba - PI": 285,
        "Polo Petrópolis": 630,
        "Polo Queimados": 213,
        "Polo Recreio": 164,
        "Polo Santa Cruz": 466,
        "Polo Santa Cruz da Serra - DC": 399,
        "Polo Santa Inês - MA": 15,
        "Polo São Gonçalo": 275,
        "Polo São João de Meriti": 1586,
        "Polo Sete Lagoas - MG": 263,
        "Polo Taquara": 462,
        "Polo Tijuca": 662,
        "Polo Uni São Lucas Ji-Paraná - RO": 657,
        "Polo Uni São Lucas Porto Velho - RO": 592,
        "Polo Unidep Pato Branco - PR": 569,
        "Polo Unifipmoc Montes Claros": 417,
        "Polo Uninovafapi Teresina - PI": 894,
        "Polo Uniptan São João Del Rei - MG": 490,
        "Polo Uniredentor Itaperuna - RJ": 407,
        "Polo Unitpac Araguaína - TO": 450,
        "Polo Vitória da Conquista - BA": 453,
        // ... outros polos ...
    };

    const poloSelect = document.getElementById("polo");
    Object.keys(polos).forEach(polo => {
        let option = document.createElement("option");
        option.value = polo;
        option.textContent = polo;
        poloSelect.appendChild(option);
    });

    const times = [];
    for (let i = 8; i <= 21; i++) {
        let hour = i < 10 ? `0${i}` : i;
        times.push(`${hour}:00`);
    }

    const dates = [];
    for (let date = new Date('2024-10-31'); date <= new Date('2024-11-20'); date.setDate(date.getDate() + 1)) {
        let dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
        let formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        // Excluir domingos e o feriado de 02/11/2024
        if (dayOfWeek !== 'domingo' && formattedDate !== '02/11/2024' && formattedDate !== '15/11/2024') {
            dates.push({ formattedDate, dayOfWeek });
        }
    }

    const dateBody = document.getElementById("dateBody");
    dates.forEach(date => {
        let row = document.createElement("tr");
        row.className = date.dayOfWeek === 'sábado' ? 'saturday' : '';
        row.innerHTML = `
            <td>${date.formattedDate}</td>
            <td>${date.dayOfWeek}</td>
            <td><input type="checkbox" name="date" value="${date.formattedDate}"></td>
        `;
        dateBody.appendChild(row);
    });

    const timeBody = document.getElementById("timeBody");
    times.forEach(time => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${time}</td>
            <td><input type="checkbox" name="time" value="${time}"></td>
        `;
        timeBody.appendChild(row);
    });

    const poloForm = document.getElementById("poloForm");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const selectedPoloElement = document.getElementById("selectedPolo");
    const remainingSeatsElement = document.getElementById("remainingSeats");
    const labForm = document.getElementById("labForm");
    const labTable = document.getElementById("labTable").querySelector("tbody");
    const exportBtn = document.getElementById("exportBtn");

    let remainingSeats;
    const entries = [];

    let userIP = "";
    let selectedPolo = "";

    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            userIP = data.ip;
        } catch (error) {
            console.error('Erro ao obter o IP:', error);
        }
    }

    getUserIP();

    poloForm.addEventListener("submit", function(event) {
        event.preventDefault();
        selectedPolo = poloSelect.value;
        remainingSeats = polos[selectedPolo];
        remainingSeatsElement.textContent = remainingSeats;
        selectedPoloElement.textContent = selectedPolo;
        step1.style.display = "none";
        step2.style.display = "block";
    });

    labForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const labName = document.getElementById("labName").value;
        const vagas = parseInt(document.getElementById("vagas").value);
        const selectedDates = Array.from(document.querySelectorAll("input[name='date']:checked")).map(cb => cb.value);
        const selectedTimes = Array.from(document.querySelectorAll("input[name='time']:checked")).map(cb => cb.value);

        selectedDates.forEach(date => {
            let dayOfWeek = dates.find(d => d.formattedDate === date).dayOfWeek;
            selectedTimes.forEach(time => {
                if (dayOfWeek === "sábado" && parseInt(time.split(":")[0]) >= 18) {
                    alert(`Horário ${time} não permitido aos sábados. Selecione horários até 17:00.`);
                    return;
                }

                const existingEntry = entries.find(entry => entry.date === date && entry.time === time && entry.labName === labName);
                if (existingEntry) {
                    alert(`O laboratório ${labName} já está registrado no dia ${date} às ${time}.`);
                    return;
                }
                
                const entry = { polo: selectedPolo, labName, vagas, date, time, dayOfWeek, userIP };
                entries.push(entry);
                remainingSeats -= vagas;
                remainingSeatsElement.textContent = remainingSeats;
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${entry.labName}</td>
                    <td>${entry.date}</td>
                    <td>${entry.dayOfWeek}</td>
                    <td>${entry.time}</td>
                    <td>${entry.vagas}</td>
                    <td><button class="deleteBtn">Excluir</button></td>
                `;
                labTable.appendChild(row);
            });
        });

        document.getElementById("labName").value = "";
        document.getElementById("vagas").value = "";
        document.querySelectorAll("input[name='date']:checked").forEach(cb => cb.checked = false);
        document.querySelectorAll("input[name='time']:checked").forEach(cb => cb.checked = false);
    });

    exportBtn.addEventListener("click", function() {
        if (entries.length === 0) {
            alert("Nenhum dado para exportar.");
            return;
        }

        let wb = XLSX.utils.book_new();
        let ws_data = [["Polo", "Nome do Laboratório", "Vagas", "Dia", "Dia da Semana", "Horário", "IP"]];
        
        entries.forEach(entry => {
            ws_data.push([entry.polo, entry.labName, entry.vagas, entry.date, entry.dayOfWeek, entry.time, entry.userIP]);
        });

        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Controle de Vagas");
        XLSX.writeFile(wb, `controle_vagas_${selectedPolo.replace(/\s+/g, '_')}.xlsx`);
    });

    labTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("deleteBtn")) {
            let row = event.target.closest("tr");
            let vagas = parseInt(row.cells[4].textContent);
            let labName = row.cells[0].textContent;
            let date = row.cells[1].textContent;
            let time = row.cells[3].textContent;

            entries.splice(entries.findIndex(entry => entry.labName === labName && entry.date === date && entry.time === time), 1);

            remainingSeats += vagas;
            remainingSeatsElement.textContent = remainingSeats;

            row.remove();
        }
    });
});
