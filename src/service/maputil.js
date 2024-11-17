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