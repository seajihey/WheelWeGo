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
                    zoom: 15,
                    // naviControl : true,
				    // scaleBar : true
                });

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
    
}