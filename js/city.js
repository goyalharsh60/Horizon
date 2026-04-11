var allPlaces = [];
var currentFilter = 'all';
var currentSort = 'default';
 
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
        html += '<h3>' + places[i].name + '</h3>';
        html += '<p class="place-category">' + places[i].category + '</p>';
        html += '</article>';
    }
 
    grid.innerHTML = html;
}
 
function filterPlaces(btn, type) {
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
 
    currentFilter = type;
    applyFilterAndSort();
}
 
function sortPlaces(btn, order) {
    var buttons = document.querySelectorAll('.sort-btn');
    buttons.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
 
    currentSort = order;
    applyFilterAndSort();
}
 
function applyFilterAndSort() {
    var filtered = allPlaces.filter(function(place) {
        if (currentFilter === 'all') {
            return true;
        }
        return place.category.toLowerCase().includes(currentFilter);
    });

    if (currentSort === 'asc') {
        filtered = filtered.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    } else if (currentSort === 'desc') {
        filtered = filtered.sort(function(a, b) {
            return b.name.localeCompare(a.name);
        });
    }
 
    showPlaces(filtered);
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
        var rawPlaces = await getCityPlaces(city);
        allPlaces = rawPlaces.map(function(place) {
            return {
                name: place,
                category: getCategoryFromName(place)
            };
        });
 
        showPlaces(allPlaces);
 
        if (subtitle) subtitle.textContent = allPlaces.length + ' places found';
 
    } catch (error) {
        showPlaces([]);
        if (subtitle) subtitle.textContent = 'Could not load places right now';
    }
});
 
function getCategoryFromName(name) {
    var lower = name.toLowerCase();
 
    if (lower.includes('hotel') || lower.includes('inn') || lower.includes('lodge') || lower.includes('resort') || lower.includes('palace')) {
        return 'hotel';
    }
    if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('dhaba') || lower.includes('food') || lower.includes('kitchen') || lower.includes('bistro')) {
        return 'restaurant';
    }
    if (lower.includes('museum') || lower.includes('gallery') || lower.includes('heritage')) {
        return 'museum';
    }
    if (lower.includes('park') || lower.includes('garden') || lower.includes('lake') || lower.includes('forest')) {
        return 'park';
    }
 
    return 'attraction';
}
