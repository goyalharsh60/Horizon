var UNSPLASH_KEY = 'MXjwO0Oh76jNuRkj_wYxAMCfRSe-Bj2mLuiJ32q5YCY';
var GEOAPIFY_KEY = 'ffbf6fb9a9174e38bb728a9a5d532396';

async function getCityHeroImage(cityName) {
    var query = encodeURIComponent(cityName + ' skyline travel');
    var url = 'https://api.unsplash.com/search/photos?query=' + query + '&orientation=landscape&per_page=1&client_id=' + UNSPLASH_KEY;

    var response = await fetch(url);
    if (!response.ok) {
        throw new Error('Could not get image');
    }

    var data = await response.json();
    if (!data.results || data.results.length === 0) {
        return null;
    }

    var firstPhoto = data.results[0];
    if (!firstPhoto.urls) {
        return null;
    }

    if (firstPhoto.urls.regular) {
        return firstPhoto.urls.regular;
    }

    return firstPhoto.urls.full || null;
}

async function getCityCoordinates(cityName) {
    var city = encodeURIComponent(cityName);
    var url = 'https://api.geoapify.com/v1/geocode/search?text=' + city + '&limit=1&apiKey=' + GEOAPIFY_KEY;

    var response = await fetch(url);
    if (!response.ok) {
        throw new Error('Could not get city location');
    }

    var data = await response.json();
    if (!data.features || data.features.length === 0) {
        return null;
    }

    var place = data.features[0].properties;
    return {
        lat: place.lat,
        lon: place.lon
    };
}

async function getCityPlaces(cityName) {
    var coordinates = await getCityCoordinates(cityName);
    if (!coordinates) {
        return [];
    }

    var categories = 'tourism.sights,tourism.attraction';
    var url =
        'https://api.geoapify.com/v2/places?categories=' + categories +
        '&filter=circle:' + coordinates.lon + ',' + coordinates.lat + ',7000' +
        '&limit=20&apiKey=' + GEOAPIFY_KEY;

    var response = await fetch(url);
    if (!response.ok) {
        throw new Error('Could not get places');
    }

    var data = await response.json();
    var places = data.features || [];

    var placeNames = [];
    var usedNames = {};

    for (var i = 0; i < places.length; i++) {
        var item = places[i];
        if (!item.properties || !item.properties.name) {
            continue;
        }

        var cleanName = item.properties.name.trim();
        var key = cleanName.toLowerCase();

        if (cleanName === '' || usedNames[key]) {
            continue;
        }

        usedNames[key] = true;
        placeNames.push(cleanName);
    }

    return placeNames;
}