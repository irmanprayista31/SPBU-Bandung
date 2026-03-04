// Menghubungkan ke graphic.json
const databasePath = "database/graphic.json";

// Fungsi untuk mengambil data dari JSON dan memprosesnya
async function fetchData() {
  try {
    const response = await fetch(databasePath);
    const data = await response.json();

    // Data untuk Pie Chart
    const totalSPBU = {
      PERTAMINA: data.pertamina.length,
      SHELL: data.shell.length,
      VIVO: data.vivo.length,
      BP: data.bp.length,
    };

    // Buat Pie Chart
    createPieChart(totalSPBU);

    // Data untuk Bar Chart
    const kecamatanData = {};

    // Helper untuk memproses data
    const processData = (category, items) => {
      items.forEach((item) => {
        
        // Ambil kecamatan dari alamat (termasuk "Kecamatan" atau "Kec.")
        const kecamatanMatch = item.alamat.match(/(?:Kecamatan|Kec\.)\s*([^,]+)/i);

        // Jika tidak ditemukan kecamatan, abaikan data ini
        if (!kecamatanMatch) {
          return; 
        }

        const kecamatan = kecamatanMatch[1].trim();

        // Inisialisasi kecamatan jika belum ada
        if (!kecamatanData[kecamatan]) {
          kecamatanData[kecamatan] = { PERTAMINA: 0, SHELL: 0, VIVO: 0, BP: 0 };
        }

        // Tambahkan jumlah sesuai kategori
        kecamatanData[kecamatan][category]++;
      });
    };

    // Proses setiap kategori SPBU
    processData("BP", data.bp || []);
    processData("PERTAMINA", data.pertamina || []);
    processData("SHELL", data.shell || []);
    processData("VIVO", data.vivo || []);

    // Format data untuk Bar Chart
    const kecamatanLabels = Object.keys(kecamatanData);
    const pertaminaCounts = kecamatanLabels.map((kec) => kecamatanData[kec].PERTAMINA);
    const shellCounts = kecamatanLabels.map((kec) => kecamatanData[kec].SHELL);
    const vivoCounts = kecamatanLabels.map((kec) => kecamatanData[kec].VIVO);
    const bpCounts = kecamatanLabels.map((kec) => kecamatanData[kec].BP);

    // Buat Bar Chart
    createBarChart(kecamatanLabels, pertaminaCounts, shellCounts, vivoCounts, bpCounts);
  } catch (error) {
    console.error("Gagal mengambil data JSON:", error);
  }
}

// Fungsi untuk membuat Pie Chart
function createPieChart(data) {
  const ctx = document.getElementById("pieChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pertamina", "Shell", "Vivo", "BP"],
      datasets: [
        {
          label: "Persentase SPBU",
          data: Object.values(data),
          backgroundColor: ["rgb(255, 97, 97)","rgb(255, 205, 86)" ,"rgb(54, 162, 235)", "rgb(86, 255, 123)"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const total = Object.values(data).reduce((sum, value) => sum + value, 0);
              const value = tooltipItem.raw;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${tooltipItem.label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

// Fungsi untuk membuat Bar Chart
function createBarChart(labels, pertamina, shell, vivo, bp) {
  const ctx = document.getElementById("barChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Pertamina",
          data: pertamina,
          barThickness: 5,
          backgroundColor: "rgb(255, 97, 97)",
        },
        {
          label: "Shell",
          data: shell,
          barThickness: 5,
          backgroundColor: "rgb(255, 205, 86)",
        },
        {
          label: "Vivo",
          data: vivo,
          barThickness: 5,
          backgroundColor: "rgb(54, 162, 235)",
        },
        {
          label: "BP",
          data: bp,
          barThickness: 5,
          backgroundColor: "rgb(86, 255, 123)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Kecamatan",
            font: {
              size: 14,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "Jumlah SPBU",
            font: {
              size: 14,
            },
          },
          beginAtZero: true,
        },
      },
    },
  });
}

// Panggil fungsi fetchData
fetchData();

// Scroll ke Pie Chart
function scrollToChart() {
  const chartSection = document.getElementById('pieChartSection');
  const headerHeight = document.querySelector('header').offsetHeight;
  const offset = -25;

  window.scrollTo({
    top: chartSection.offsetTop - headerHeight - offset, 
    behavior: 'smooth'
  });
}

// Scroll ke Bar Chart
function scrollToBarChart() {
  const chartSection = document.getElementById('barChartSection');
  const headerHeight = document.querySelector('header').offsetHeight;
  const offset = -35; 

  window.scrollTo({
    top: chartSection.offsetTop - headerHeight - offset,
    behavior: 'smooth'
  });
}