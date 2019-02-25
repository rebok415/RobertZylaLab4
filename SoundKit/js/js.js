// ewent dla puszczenia przycisku
window.addEventListener("keydown", keyDown);
// ewent dla wcisniecia przycisku
window.addEventListener("keyup", keyUp);
// ewent dla wcisniecia myszka
window.addEventListener("mouseup", mouseUp);
//ewent dla zwolnienia przycisku myszki
window.addEventListener("mousedown", mouseDown);
// ewent dla klikncieca
window.addEventListener("click", clickHandler);
//tablica sciezek
let sciezka = [
    []
];
//tablic nagrania
let record = [];
// tablica czasu
let time = [];
// tablica dzwieków
let sound = [];
// tablica poszczegolnych dzwiekow przypisanych do klawiszy
let soundList = {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        0: "10"
    }
    //wczytanie dzwięków
function wczytajDzwieki() {
        Object.values(soundList).forEach((e) => sound[e] = new Audio('./sounds-wav/' + e + '.wav'));
    }
    // nacisniecie klawisza
function keyDown(e) {
        if (document.getElementById(e.key)) {
            //jesli element istnieje, to dodaje do niego klase
            document.getElementById(e.key).classList.add('key-pressed') 
            odtwarzaniePrzycisk(e);
        }
    }
    // puszczenie klawisza
function keyUp(e) {
        if (document.getElementById(e.key)) {
            document.getElementById(e.key).classList.remove('key-pressed')
        }
    }
    // nacisniecie przycisku msyzki
function mouseDown(e) {
        if (Object.keys(soundList).indexOf(e.target.id) > -1) {
            e.target.classList.add('key-pressed')
        }
    }
    // puszczenie przycisku myszki
function mouseUp(e) {
    if (Object.keys(soundList).indexOf(e.target.id) > -1) {
        e.target.classList.remove('key-pressed')
    }
}

// funkcja sprawdza na ktorym klawiszu jest myszka i włącza go.
function clickHandler(e) {
        if (Object.keys(soundList).indexOf(e.target.id) > -1) {
            odtwarzaniePrzycisk({
                key: e.target.id
            });
        }
    }
    // nagrywanie sciezki
function startNagrywania(numer_sciezki) {
        // jesli nie ma sciezki o danym numerze, tworzy ją z aktualnym czasem, zaczyna nagrywań i zmienia napis na przycisku
        if (!record[numer_sciezki]) {
            record[numer_sciezki] = true;
            time[numer_sciezki] = Date.now();
            sciezka[numer_sciezki] = [];
            document.getElementById("rButton" + numer_sciezki).innerText = "STOP";

        }
        // jesli istnieje sciezka, to przestaje ją nagrywać i wyswietla informacje o sciezce.
        else {
            record[numer_sciezki] = false;
            document.getElementById("rButton" + numer_sciezki).innerText = "Nagraj utwór " + numer_sciezki;
            document.getElementById("status" + numer_sciezki).innerText = sciezka[numer_sciezki].length + " Utwór nagrany w " + Math.round(sciezka[numer_sciezki][sciezka[numer_sciezki].length - 1].delay / 100) / 10 + "sec";
            document.getElementById("playButton" + numer_sciezki).style.display = "block"; 
        
        }
    }
    // funkcja grania muzyki
function odtwarzaniePrzycisk(e) {
    // zeruje czas dzwieku
    sound[soundList[e.key]].currentTime = 0
    sound[soundList[e.key]].play();
    // sprawdza, czy włączone jest nagrywanie dla każdej ścieżki
    for (i = 1; i <= sciezka.length; i++) {
        if (record[i]) {
            //jeżli naciskany jest poprawny klawisz, dodaje go do sciezki z czasem nagrania
            if (Object.keys(soundList).indexOf(e.key) > -1) {
                sciezka[i].push({
                    delay: Date.now() - time[i],
                    key: e.key
                })
            }
        }
    }
}
let timeout = [];
let theand = [];

//odtwarzanie sciezki
function odtwarzanieNagrania(numer_sciezki) {
    // jeśli nie ma timeout dla ścieżki, tworzy go dla każdego elementu sciezki z opóźnieniem.
    if (!timeout[numer_sciezki] && sciezka[numer_sciezki][0]) { 
        sciezka[numer_sciezki].forEach((e) => {
            timeout[numer_sciezki] = setTimeout(() => {
                odtwarzaniePrzycisk(e)
            }, e.delay);
        })
        document.getElementById("playButton" + numer_sciezki).innerText = "STOP";
        // gdy skończy się sciezka, przycisk automatycznie zmienia się ponownie na "play"
        theand[numer_sciezki] = setTimeout(() => odtwarzanieNagrania(numer_sciezki), sciezka[numer_sciezki][sciezka[numer_sciezki].length - 1].delay + 10)
    }
    // jeśli naciśnięty będzie przycisk podczas grania sciezki, usuwa się wszystkie timeouty i przywraca przycisk do "Play" 
    else {
        clearTimeout(theand[numer_sciezki]);
        do {
            clearTimeout(timeout[numer_sciezki]);
        }
        while (timeout[numer_sciezki] --)
        timeout[numer_sciezki] = false;
        document.getElementById("playButton" + numer_sciezki).innerText = "PLAY nagranie " + numer_sciezki;
    }
}