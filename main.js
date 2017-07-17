//changing topojson to geojson
L.TopoJSON = L
    .GeoJSON
    .extend({
        addData: function (jsonData) {
            if (jsonData.type === "Topology") {
                for (let key in jsonData.objects) {
                    if (jsonData.objects.hasOwnProperty(key)) {
                        let geojson = topojson.feature(jsonData, jsonData.objects[key]);
                        L
                            .GeoJSON
                            .prototype
                            .addData
                            .call(this, geojson);
                    }
                }
            } else {
                L
                    .GeoJSON
                    .prototype
                    .addData
                    .call(this, jsonData);
            }
        }
    });

// Initialize map
let map = L
        .map('map', {minZoom: 7})
        .setView([
            28.1734922968426, 83.98199462890626
        ], 7),
    topoLayer = new L.TopoJSON();

//tile layers
L
    .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'})
    .addTo(map);

let buildingIcon = L.icon({
    iconUrl: "/images/map-marker.svg",
    iconSize: [ 30, 30 ], // size of the icon
    shadowSize: [50, 64]
});
//Implementation marker in map
L.marker([
    27.89734922968426, 84.98199462890626
], {icon: buildingIcon})
    .addTo(map)
    .bindPopup('Hover data on Map')
    .on('mouseover', function () {
        this.openPopup();
    })
    .on('mouseout', function () {
        this.closePopup();
    });

$
    .getJSON('data/nepal-districts.topojson')
    .done(createDistrictLayer)

function createDistrictLayer(topoData) {
    topoLayer.addData(topoData);
    topoLayer.addTo(map);
    topoLayer.eachLayer(districtLayer);
}

//layer for disctrict

const districtLayer = (layer) => {
    layer.setStyle({fillColor: 'blue', weight: 1.5, color: 'white', opacity: 0.5, fillOpacity: 0.4});
    layer.on({mouseover: enterLayer, mouseout: leaveLayer, click: clickToDistrict});

    //functionality we can do on map layer
    function enterLayer() {
        console.log('add')
    }
    function leaveLayer() {
        console.log('remove')
    }
    function clickToDistrict() {
        alert('district')
    }
}
