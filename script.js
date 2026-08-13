document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const dataInput = document.getElementById('data-raportu');
    dataInput.value = today;
    
    aktualizujInfoODacie();

    // Dodaj po jednym wierszu na start do L1 (linia 10) i L2 (linia 20)
    dodajWiersz('tbody-l1', '10');
    dodajWiersz('tbody-l2', '20');
});

// Zbiorcza funkcja wywoływana przy zmianie daty
function przeliczWszystkiePartieIInfo() {
    aktualizujInfoODacie();
    odswiezWszystkiePartie();
}

// Funkcja wyliczająca nazwisko dnia, dzień roku oraz nr tygodnia
function aktualizujInfoODacie() {
    const dataVal = document.getElementById('data-raportu').value;
    if (!dataVal) return;

    const d = new Date(dataVal + 'T00:00:00');

    const dniTygodnia = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const nazwaDnia = dniTygodnia[d.getDay()];

    const startRoku = new Date(d.getFullYear(), 0, 0);
    const roznicaCzasu = d - startRoku;
    const jedenDzien = 1000 * 60 * 60 * 24;
    const dzienRoku = Math.floor(roznicaCzasu / jedenDzien);

    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    const numerTygodnia = 1 + Math.round((firstThursday - target) / (7 * 24 * 3600 * 1000));

    document.getElementById('info-dzien-tygodnia').textContent = nazwaDnia;
    document.getElementById('info-dzien-roku').textContent = dzienRoku;
    document.getElementById('info-tydzien').textContent = numerTygodnia;
}

// Funkcja generująca numer partii w formacie: YY|DDD|ZZ|A|B|C|E
function generujKodPartii(nrLinii, paramB = "5", paramC = "0", paramE = "1") {
    const dataVal = document.getElementById('data-raportu').value;
    if (!dataVal) return '';

    const d = new Date(dataVal + 'T00:00:00');
    
    // YY - rok (dwie ostatnie cyfry)
    const yy = d.getFullYear().toString().slice(-2);

    // DDD - dzień roku + 2 (zawsze 3 cyfry, np. 005, 023, 214)
    const startRoku = new Date(d.getFullYear(), 0, 0);
    const roznicaCzasu = d - startRoku;
    const jedenDzien = 1000 * 60 * 60 * 24;
    const dzienRoku = Math.floor(roznicaCzasu / jedenDzien);
    const ddd = String(dzienRoku + 2).padStart(3, '0');

    // ZZ - linia (10 dla L1, 20 dla L2)
    const zz = nrLinii;

    // A - zakład (stała: 2)
    const a = "2";

    // Składamy w całość
    return `${yy}${ddd}${zz}${a}${paramB}${paramC}${paramE}`;
}

// Dodawanie wiersza z polem Partia i opcjami
function dodajWiersz(tbodyId, nrLinii) {
    const tbody = document.getElementById(tbodyId);
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-linia', nrLinii);
    
    const kodPartii = generujKodPartii(nrLinii);

    newRow.innerHTML = `
        <td>
            <input type="text" class="input-partia" value="${kodPartii}" readonly style="background-color: #f1f5f9; font-weight: bold; width: 110px;">
        </td>
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

// Odświeżanie kodów partii po zmianie daty
function odswiezWszystkiePartie() {
    const wiersze = document.querySelectorAll('tbody tr');
    wiersze.forEach(row => {
        const nrLinii = row.getAttribute('data-linia');
        const inputPartia = row.querySelector('.input-partia');
        if (inputPartia && nrLinii) {
            inputPartia.value = generujKodPartii(nrLinii);
        }
    });
}

function usunWiersz(button) {
    const row = button.closest('tr');
    row.remove();
    przeliczSumy();
}

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
