function getMapSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return new naver.maps.Size(width, height);
  }


export function handleResize(map) {
    if (map) {
        map.setSize(getMapSize());
    }
}


export function setMarker(position, map, pinColor = '#30343f') { // Default color
    var position = new naver.maps.LatLng(position.lat, position.lng);
    
    var htmlMarker = new naver.maps.Marker({
        position: position,
        map: map,
        title: 'htmlMarker',
        icon: {
            content: [
                `<div class="pin" style="background: ${pinColor};"></div>`,
                '<div class="pulse"></div>',
            ].join(''),
            size: new naver.maps.Size(38, 58),
            anchor: new naver.maps.Point(19, 58),
        },
    });
    return htmlMarker;
}


export function showMarker(map, marker) {

    if (marker.getMap()) return;
    marker.setMap(map);
}

export function hideMarker(map, marker) {
    if (!marker.getMap()) return;
    marker.setMap(null);
}

