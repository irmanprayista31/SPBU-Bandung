// Fitur Dark Mode
tailwind.config = {
    darkMode: 'selector',
}

// Nonaktifkan transisi awal
document.documentElement.classList.add('no-transition');

// Aktifkan transisi setelah halaman selesai dimuat
window.addEventListener('load', () => {
    document.documentElement.classList.remove('no-transition');
    document.documentElement.classList.add('transition-active');
});

// Logika toggle tema untuk beralih light ke dark atau sebaliknya
function toggleTheme() {
    const html = document.documentElement;
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');

    // Toggle antara light dan dark mode
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeIconLight.classList.remove('hidden');
        themeIconDark.classList.add('hidden');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeIconLight.classList.add('hidden');
        themeIconDark.classList.remove('hidden');
    }
}

// Atur tema saat pertama kali memuat halaman
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');

    // Menampilkan ikon bulan saat dark mode
    document.getElementById('theme-icon-light').classList.add('hidden');
    document.getElementById('theme-icon-dark').classList.remove('hidden');
} else {

    // Menampilkan ikon matahari saat light mode
    document.getElementById('theme-icon-light').classList.remove('hidden');
    document.getElementById('theme-icon-dark').classList.add('hidden');
}