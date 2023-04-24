import { html } from './html.js'
import { getUserLocation } from './utils/userlocation.js'
import { signal } from 'https://esm.sh/@preact/signals'

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popUpAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popUpAnchor: [1, -34],
  shadowSize: [41, 41]
})

let markers = []
const usrLocation = await getUserLocation()
const places = ['hospital', 'clinic']

const getMapData = async (radius, map) => {
  markers.forEach(marker => marker.remove())
  markers = []
  const p = places.join('|')

  const nodeQuery = `node["amenity"~"${p}"](around:${radius},${usrLocation.coords.latitude},${usrLocation.coords.longitude});`
  const query = '?data=[out:json][timeout:15];(' + nodeQuery + ');out;'

  const res = await fetch(`https://www.overpass-api.de/api/interpreter${query}`)
  const result = await res.json()

  result.elements.forEach(place => {
    let icon
    if ((place.tags.name && place.tags.name.toLowerCase().includes('clinic')) || (place.tags.clinic) || (place.tags.amenity.toLowerCase().includes('clinic'))) {
      icon = greenIcon
    } else if ((place.tags.name && place.tags.name.toLowerCase().includes('hospital')) || (place.tags.hospital) || (place.tags.amenity.toLowerCase().includes('hospital'))) {
      icon = redIcon
    }
    console.log(icon)
    let marker = L.marker([place.lat, place.lon], { icon: icon }).addTo(map);
    markers.push(marker)
  })
}

const Home = async () => {
  let radius = 5000

  let map = L.map('map').setView([usrLocation.coords.latitude, usrLocation.coords.longitude], 15); // could find a way to modify this 15 number to modify zoom automaticcally
  const radiusButtons = ['rad_5km', 'rad_10km', 'rad_20km'];

  let circle = L.circle([usrLocation.coords.latitude, usrLocation.coords.longitude], {
    color: 'blue',
    radius: 5000
  }).addTo(map)

  radiusButtons.forEach(buttonId => {
    markers = []
    const button = document.getElementById(buttonId);
    button.addEventListener('click', async () => {
      const rad = buttonId === 'rad_5km' ? 5000 :
        buttonId === 'rad_10km' ? 10000 :
          buttonId === 'rad_20km' ? 20000 : 0

      radius = rad
      getMapData(rad, map)
      circle.setRadius(rad)
      map.setView([usrLocation.coords.latitude, usrLocation.coords.longitude], Math.round(15 - Math.log(rad / 500) / Math.LN2));
    });
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  getMapData(radius, map)

  return html`
<h1 style=>Maps</h1>
`
}

export default Home
