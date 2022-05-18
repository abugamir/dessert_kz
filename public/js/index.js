
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat:51.1801, lng: 71.4459 },
    zoom: 8,
  });
}

window.initMap = initMap;
