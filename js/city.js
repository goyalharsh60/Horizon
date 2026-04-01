function showPlaces(places) {
    var grid = document.getElementById('cityGrid');
    if (!grid) return;

    if (!places || places.length === 0) {
        grid.innerHTML = '<p class="empty-state">No places found for this city right now.</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < places.length; i++) {
        html += '<article class="place-card">';
        html += '<span class="place-index">' + (i + 1) + '</span>';
        html += '<h3>' + places[i] + '</h3>';
        html += '</article>';
    }

    grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async function () {
    var params = new URLSearchParams(window.location.search);
    var city = (params.get('city') || 'Jaipur').trim();
    if (!city) city = 'Jaipur';

    var title = document.getElementById('cityTitle');
    var subtitle = document.getElementById('citySubtitle');
    var breadcrumb = document.getElementById('cityBreadcrumb');
    var placesCityName = document.getElementById('placesCityName');
    var heroImg = document.getElementById('cityHeroImg');

    if (title) title.textContent = city;
    if (subtitle) subtitle.textContent = 'Loading city data...';
    if (breadcrumb) breadcrumb.textContent = 'Home / ' + city;
    if (placesCityName) placesCityName.textContent = city;

    try {
        var imageUrl = await getCityHeroImage(city);
        if (imageUrl && heroImg) {
            heroImg.src = imageUrl;
            heroImg.alt = city + ' image';
        }
    } catch (error) {
        console.log('Image not loaded');
    }

    try {
        var places = await getCityPlaces(city);
        showPlaces(places);
        if (subtitle) subtitle.textContent = places.length + ' places found';
    } catch (error) {
        showPlaces([]);
        if (subtitle) subtitle.textContent = 'Could not load places right now';
    }
});
