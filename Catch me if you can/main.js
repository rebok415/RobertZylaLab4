

//Inicjacja podstawowych zmiennych.
let latAndLng, map, marker, ws, player, name;
player = {};
name = window.prompt("podaj imie");
// dodanie własnego markera i mapy
function initMap() { 
	latAndLng = {
		lat: 50.068160,
		lng: 18.941041
	};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: latAndLng,
		keyboardShortcuts: false
	});

	var rozmiar = new google.maps.Size(32,32);
	var punkt_startowy = new google.maps.Point(0,0);
	var punkt_zaczepienia = new google.maps.Point(16,16);
	var ikona2 = new google.maps.MarkerImage("img/runner.png", rozmiar, punkt_startowy, punkt_zaczepienia);

	marker = new google.maps.Marker({
		position: latAndLng,
		map: map,
		animation: google.maps.Animation.BOUNCE,
		icon: ikona2
	});

	// Event po ruchu myszką.
	google.maps.event.addListener(map, 'mousemove', function (e) {
        // latlng zwraca wartosci w dziwnej funkcji, ktorych nie mozna uzyc.
		marker.setPosition(e.latLng); 
        var lat = marker.getPosition().lat(); 
        // wiec trzeba pobrac na nowo pozycje od markera
		var lng = marker.getPosition().lng();
		let wsData = {
			lat: lat,
			lng: lng,
			id: name
        }
        // Wysłanie danych do WebSocketa
		ws.send(JSON.stringify(wsData)) 
	});
	getLocalizationAccess()
	webSocetStart()
	addKeyevents()
}
// funkcje klawiszy
function addKeyevents() {
	window.addEventListener("keydown", poruszMarkerem)
}

function poruszMarkerem(ev) {
	let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    // zmiana położenia po klawiszu.
	switch (ev.code) { 
		case 'ArrowUp':
			lat += 0.1;
			break;
		case 'ArrowDown':
			lat -= 0.1;
			break;
		case 'ArrowLeft':
			lng -= 0.1;
			break;
		case 'ArrowRight':
			lng += 0.1;
			break;
	}
	let position = {
		lat,
		lng
	}
	let wsData = {
		lat: lat,
		lng: lng,
		id: name
	}
	marker.setPosition(position)
	// Wysłanie danych do WebSocketa      
	ws.send(JSON.stringify(wsData))
}

// Stworzenie websocketa
function webSocetStart() {
	let url = 'ws://szkolenia.design.net.pl:8010'
	ws = new WebSocket(url);
	ws.addEventListener('open', onWSOpen);
	ws.addEventListener('message', onWSMessage);
}

// otawrcie WS
function onWSOpen(data) {
	console.log(data)
}

function onWSMessage(e) {
	// Zmiany po sygnale od WS
	let data = JSON.parse(e.data)
	console.log("data received", data)
    // Dodanie gracza do listy, jeśli go nie ma
    // nie moze miec tego samego imienia
	if (!player['user' + data.id] && data.id !== name) { 
		player['user' + data.id] = new google.maps.Marker({
			position: {
				lat: data.lat,
				lng: data.lng
			},
			map: map
		})
    } 
    // Zmiana pozycji, jesli istnieje.
    else if (data.id !== name) { 
		player['user' + data.id].position = {
			lat: data.lat,
			lng: data.lng
        }
        //ustalenie pozycji gracza
		player['user' + data.id].setPosition(player['user' + data.id].position) 
	}

}

// Prośba o geolokalizacje.
function getLocalizationAccess() {
	navigator.geolocation.getCurrentPosition(geolocationAccessOK, geolocationAccessError)
}
// Powodzenie prośby.
function geolocationAccessOK(data) {
	let coords = {
		lat: data.coords.latitude,
		lng: data.coords.longitude
	}
	map.setCenter(coords);
	marker.setPosition(coords);
	markerPin(coords)

}

// zawieszenie markera
function markerPin(coords){
	// definiujemy ikonke
	var rozmiar = new google.maps.Size(32,32);
	var punkt_startowy = new google.maps.Point(0,0);
	var punkt_zaczepienia = new google.maps.Point(16,16);
	var ikona1 = new google.maps.MarkerImage("img/home.png", rozmiar, punkt_startowy, punkt_zaczepienia);

	// definiujemy punkt o moich współrzędnych 				
	var punkt = new google.maps.LatLng(coords.lat,coords.lng);  
	var opcjeMarkera = 
	{
		position: punkt,
		map: map,
		title: 'moja lokalizacja',
		icon: ikona1
	}
	new google.maps.Marker(opcjeMarkera);
}

// Niepowodzenie prośby.
function geolocationAccessError(error) {
	if (window.confirm(error.message)) {
		window.location.href = "https://support.google.com/maps/answer/7326816?co=GENIE.Platform%3DAndroid&hl=pl";
	}

}

