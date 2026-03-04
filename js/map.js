// Import modul Firebase yang diperlukan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyBuGq5pdtHczcSlT8x6r-KQKudPOeITc7U",
    authDomain: "gas-stasion-map.firebaseapp.com",
    databaseURL: "https://gas-stasion-map-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gas-stasion-map",
    storageBucket: "gas-stasion-map.appspot.com",
    messagingSenderId: "908134729036",
    appId: "1:908134729036:web:6312041f49383818733be9",
    measurementId: "G-BPKR1590SG"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);  
const database = getDatabase(app);

// Mengambil data dari Firebase Realtime Database
const dbRef = ref(database, '/');
onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    data.pertamina.forEach(location => markersPertamina.push(addMarker(location, 'pertamina')));
    data.shell.forEach(location => markersShell.push(addMarker(location, 'shell')));
    data.vivo.forEach(location => markersVivo.push(addMarker(location, 'vivo')));
    data.bp.forEach(location => markersBp.push(addMarker(location, 'bp')));

    showAllMarkers(); 
});

// Inisialisasi peta menggunakan Leaflet
let map = L.map('map').setView([-6.9175, 107.6191], 9);

// Jenis Layer Map
const defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri &mdash; Source: Esri, USGS, NOAA'
});

// Tambahkan layer default ke peta
defaultLayer.addTo(map);


// Fungsi untuk mengganti layer peta, tanpa menghapus marker
function setLayer(layer) {
    map.eachLayer(function(existingLayer) {
        if (!(existingLayer instanceof L.Marker)) {
            map.removeLayer(existingLayer); 
        }
    });
    layer.addTo(map);
}

// Opsi layer untuk Layer Control
const baseMaps = {
    "Default (OpenStreetMap)": defaultLayer,
    "Satellite (ESRI)": satelliteLayer
};

// Tambahkan Layer Control ke peta
L.control.layers(baseMaps).addTo(map);

// Variabel untuk menyimpan marker
let markersPertamina = [];
let markersShell = [];
let markersVivo = [];
let markersBp = [];

// Fungsi untuk menambahkan marker dengan popup
function addMarker(location, iconName) {
    let marker = L.marker([location.latitude, location.longitude], {
        icon: L.icon({
            iconUrl: `assets/${iconName}-icon.png`,
            iconSize: [24, 22] 
        })
    }).bindPopup(` 
        <b>${location.nama_spbu}</b><br>
        ${location.alamat}<br>
        ${location.latitude}<br>
        ${location.longitude}
    `); 
    return marker;
}

// Fungsi untuk menghapus semua marker
function clearAllMarkers() {
    clearMarkers(markersPertamina);
    clearMarkers(markersShell);
    clearMarkers(markersVivo);
    clearMarkers(markersBp);
}

// Fungsi untuk menghapus marker tertentu
function clearMarkers(markers) {
    markers.forEach(marker => map.removeLayer(marker));  
}

// Fungsi untuk menampilkan semua marker
function showAllMarkers() {
    markersPertamina.forEach(marker => marker.addTo(map)); 
    markersShell.forEach(marker => marker.addTo(map)); 
    markersVivo.forEach(marker => marker.addTo(map));
    markersBp.forEach(marker => marker.addTo(map));  
}

// Fungsi untuk memfilter marker berdasarkan input pencarian
function searchMarkers(query) {
    const lowerCaseQuery = query.toLowerCase();  
    clearAllMarkers();
    
    let matchedMarkers = [];
    markersPertamina.forEach(marker => {
        const popupContent = marker.getPopup().getContent().toLowerCase();
        if (popupContent.includes(lowerCaseQuery)) { 
            matchedMarkers.push(marker);
        }
    });

    // Mencari di marker Shell
    markersShell.forEach(marker => {
        const popupContent = marker.getPopup().getContent().toLowerCase();
        if (popupContent.includes(lowerCaseQuery)) {
            matchedMarkers.push(marker);
        }
    });

    // Mencari di marker Vivo
    markersVivo.forEach(marker => {
        const popupContent = marker.getPopup().getContent().toLowerCase();
        if (popupContent.includes(lowerCaseQuery)) {
            matchedMarkers.push(marker);
        }
    });

    // Mencari di marker Bp
    markersBp.forEach(marker => {
        const popupContent = marker.getPopup().getContent().toLowerCase();
        if (popupContent.includes(lowerCaseQuery)) {
            matchedMarkers.push(marker);
        }
    });

    // Menambahkan marker yang cocok ke peta
    matchedMarkers.forEach(marker => marker.addTo(map));

    // Jika ada marker yang cocok, arahkan peta ke marker pertama
    if (matchedMarkers.length > 0) {
        const firstMarker = matchedMarkers[0]; 
        const markerLatLng = firstMarker.getLatLng(); 
        map.setView(markerLatLng, 12.5);
    } else {

        const popup = L.popup()
            .setLatLng(map.getCenter()) 
            .setContent("<b>SPBU tidak ditemukan</b>")
            .openOn(map);

        setTimeout(() => {
            map.closePopup(popup);
        }, 1500);
    }
}

// Event listener untuk tombol pencarian
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        searchMarkers(query);  
    }
});

// Event listener untuk tombol Enter di field pencarian
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') { 
        const query = document.getElementById('search-input').value;
        if (query) {
            searchMarkers(query);
        }
    }
});

// Event listeners untuk tombol filter
document.getElementById('filter-pertamina').addEventListener('click', () => {
    clearAllMarkers();  
    markersPertamina.forEach(marker => marker.addTo(map));  
});

document.getElementById('filter-shell').addEventListener('click', () => {
    clearAllMarkers();
    markersShell.forEach(marker => marker.addTo(map));  
});

document.getElementById('filter-vivo').addEventListener('click', () => {
    clearAllMarkers();  
    markersVivo.forEach(marker => marker.addTo(map));  
});

document.getElementById('filter-bp').addEventListener('click', () => {
    clearAllMarkers();  
    markersBp.forEach(marker => marker.addTo(map));  
});

document.getElementById('show-all-markers').addEventListener('click', () => {
    showAllMarkers();  
});

document.getElementById('clear-markers').addEventListener('click', () => {
    clearAllMarkers();  
});

// tombol set default layer
document.getElementById('set-default-layer').addEventListener('click', () => {
    setLayer(defaultLayer);
});

// tombol set satellite layer
document.getElementById('set-satellite-layer').addEventListener('click', () => {
    setLayer(satelliteLayer);
});

// memusatkan peta ke Bandung
window.centerToBandung = function () {
    map.setView([-6.9175, 107.6191], 13);  
};