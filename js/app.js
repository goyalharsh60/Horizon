function goToCity(cityName) {
    if (!cityName) {
        return;
    }

    window.location.href = 'city.html?city=' + encodeURIComponent(cityName);
}

function searchCity() {
    var input = document.getElementById('searchInput');
    if (!input) {
        return;
    }

    var city = input.value.trim();

    if (city === '') {
        alert('Please enter a city name.');
        return;
    }

    goToCity(city);
}

function setupSearchInput() {
    var input = document.getElementById('searchInput');
    if (!input) {
        return;
    }

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            searchCity();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupSearchInput();
});
