// Ustawienie domyślnej dzisiejszej daty po załadowaniu
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('data-raportu').value = today;
    
    // Dodaj po jednym pustym wierszu na start do L1 i L2
    dodajWiersz('tbody-l1');
    dodajWiersz('tbody-l2');
});

// Funkcja dodająca nowy wiersz do wybranej tabeli
function dodajWiersz(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td><input type="text" placeholder="np. Klient A"></td>
        <td><input type="text" placeholder="np. IND-123"></td>
        <td><input type="number" class="input-szarza-zam" min="0" value="0"></td>
        <td><input type="number" class="input-plan-kg" min="0" value="0"></td>
        <td><input type="number" class="input-szarza-wyk" min="0" value="0"></td>
        <td><input type="number" class="input-wykonano-kg" min="0" value="0" oninput="przeliczSumy()"></td>
        <td><button class="btn btn-danger" onclick="usunWiersz(this)">X</button></td>
    `;
    
    tbody.appendChild(newRow);
    przeliczSumy();
}

// Funkcja usuwająca wiersz
function usunWiersz(button) {
    const row = button.closest('tr');
    row.remove();
    przeliczSumy();
}

// Funkcja przeliczająca sumy w czasie rzeczywistym
function przeliczSumy() {
    let sumaL1 = 0;
    let sumaL2 = 0;

    // Pobieranie wartości z Linii 1
    const wierszeL1 = document.querySelectorAll('#tbody-l1 .input-wykonano-kg');
    wierszeL1.forEach(input => {
        sumaL1 += parseFloat(input.value) || 0;
    });

    // Pobieranie wartości z Linii 2
    const wierszeL2 = document.querySelectorAll('#tbody-l2 .input-wykonano-kg');
    wierszeL2.forEach(input => {
        sumaL2 += parseFloat(input.value) || 0;
    });

    // Aktualizacja na ekranie
    document.getElementById('suma-l1-kg').textContent = sumaL1.toFixed(1);
    document.getElementById('suma-l2-kg').textContent = sumaL2.toFixed(1);
    document.getElementById('suma-dzien-kg').textContent = (sumaL1 + sumaL2).toFixed(1);
}
