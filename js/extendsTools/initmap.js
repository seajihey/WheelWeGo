export class InitMap {
    constructor() {
      
    }
  
    createTmap(lat, lon) {
        try {
            return new Promise((resolve, reject)=>{
                let map = new Tmapv3.Map("map_div", {
                    center: new Tmapv3.LatLng(lat, lon),
                    width: "100vw",
                    height: "100vh",
                    zoom: 18,
                    scaleBar: true
                });
                
                console.log("맵 만드는 중 ...");
                resolve(map);
            });
        } catch (error) {
            console.error('지도 초기화 중 오류 발생:', error);
            return null;
        }
    }
    
    updateMap(map, lat, lon){
        const newcenter = new Tmapv3.LatLng(lat, lon);
        map.setCenter(newcenter);

        return map;
    }

    setMapCenter(map, lat, lon){
        const position = new Tmapv3.LatLng(lat, lon);
        map.setCenter(position);
    }

    createMark(map, lat, lon){
        const position = new Tmapv3.LatLng(lat,lon);
        const marker = new Tmapv3.Marker({
            position : position,
            map : map
        });

        return marker;
    }
    
}