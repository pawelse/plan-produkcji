// Ustawienie domyślnej dzisiejszej daty po załadowaniu
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const dataInput = document.getElementById('data-raportu');
    dataInput.value = today;
    
    // Oblicz i wyświetl szczegóły daty dla dzisiejszego dnia
    aktualizujInfoODacie();

    // Dodaj po jednym pustym wierszu na start do L1 i L2
    dodajWiersz('tbody-l1');
    dodajWiersz('tbody-l2');
});

// Funkcja wyliczająca nazwisko dnia, dzień roku oraz nr tygodnia
function aktualizujInfoODacie() {
    const dataVal = document.getElementById('data-raportu').value;
    if (!dataVal) return;

    const d = new Date(dataVal + 'T00:00:00');

    // 1. Nazwa dnia tygodnia po polsku
    const dniTygodnia = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const nazwaDnia = dniTygodnia[d.getDay()];

    // 2. Dzień roku (1 - 365/366)
    const startRoku = new Date(d.getFullYear(), 0, 0);
    const roznicaCzasu = d - startRoku;
    const jedenDzien = 1000 * 60 * 60 * 24;
    const dzienRoku = Math.floor(roznicaCzasu / jedenDzien);

    // 3. Numer tygodnia roku (ISO 8601)
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    const numerTygodnia = 1 + Math.round((firstThursday - target) / (7 * 24 * 3600 * 1000));

    // Wyświetlenie wyników w oknie
    document.getElementById('info-dzien-tygodnia').textContent = nazwaDnia;
    document.getElementById('info-dzien-roku').textContent = dzienRoku;
    document.getElementById('info-tydzien').textContent = numerTygodnia;
}

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

    const wierszeL1 = document.querySelectorAll('#tbody-l1 .input-wykonano-kg');
    wierszeL1.forEach(input => {
        sumaL1 += parseFloat(input.value) || 0;
    });

    const wierszeL2 = document.querySelectorAll('#tbody-l2 .input-wykonano-kg');
    wierszeL2.forEach(input => {
        sumaL2 += parseFloat(input.value) || 0;
    });

    document.getElementById('suma-l1-kg').textContent = sumaL1.toFixed(1);
    document.getElementById('suma-l2-kg').textContent = sumaL2.toFixed(1);
    document.getElementById('suma-dzien-kg').textContent = (sumaL1 + sumaL2).toFixed(1);
}
