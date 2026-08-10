const coordinates = listing.geometry.coordinates;

const map = L.map("map")
.setView([coordinates[1], coordinates[0]], 13);

L.tileLayer(
`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${apiKey}`,
{
attribution:
'© OpenStreetMap contributors © Geoapify'
}
).addTo(map);

L.marker([coordinates[1],coordinates[0]])
.addTo(map)
.bindPopup(listing.title)
.openPopup();