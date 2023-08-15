import { InitMap } from "./initmap.js";
import { Navi } from "./navi.js";

export class Search {
    constructor() {
        this.mapTool = new InitMap();
        this.naviTool = new Navi();

        this.currentLat, this.currentLon;
        this.map;

        this.gnbMode = "search"; //"search 와 navi 모드 있음"
        this.search_words = ["",""];
        this.markers = [];
      
        this.focusSearchBox();
    }

    setMap(map){
        this.map = map;
    }

    setPosition(lat, lon){
        this.currentLat = lat;
        this.currentLon = lon;
    }
   
    getList(lat, lng, search_word){
        return new Promise((resolve, reject)=>{     
            let searchKeyword = search_word;
            let headers = {};
            headers["appKey"]="l7xxed2c734830ae4364975ef11e67a76e81";
            
            $.ajax({
                method:"GET",
                headers : headers,
                url:"https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
                async:false,
                data:{
                    "searchKeyword" : searchKeyword,
                    "centerLat" : lat,
                    "centerLon" : lng,
                    "resCoordType" : "WGS84GEO",
                    "reqCoordType" : "WGS84GEO",
                    "count" : 10
                },
                success:function(response){
                    let search_list =[];
                    let search_coords = [];
                    let search_tel = [];
                    let search_addr = [];

                    if(response){
                        let resultpoisData = response.searchPoiInfo.pois.poi;
                        
                        for(let k in resultpoisData){
                            let noorLat = Number(resultpoisData[k].noorLat);
                            let noorLon = Number(resultpoisData[k].noorLon);
                            let coords = {
                                latitude : noorLat,
                                longitude : noorLon,
                            };
                            
                            let name = resultpoisData[k].name;

                            let address = resultpoisData[k].middleAddrName + " " + resultpoisData[k].lowerAddrName + " " + resultpoisData[k].roadName;
                            
                            let tel = resultpoisData[k].telNo;

                            search_list.push(name);
                            search_coords.push(coords);
                            search_addr.push(address);
                            search_tel.push(tel);
                        }

                        const result = {
                            name_list : search_list,
                            coords : search_coords,
                            addr : search_addr,
                            tel : search_tel,
                        };
                        
                        resolve(result);
                    }
                    else{
                        const result = {
                            name_list : search_list,
                            coords : search_coords,
                            addr : search_addr,
                            tel : search_tel,
                        };
                        
                        resolve(result);
                    }
                },
                error:function(request,status,error){
                    console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    const result = {
                        name_list : [],
                        coords : [],
                        addr : [],
                        tel : [],
                    };
                    resolve(result);
                }
            });
        });
      
    
    }

    focusSearchBox(){

        const searchBoxs = document.querySelectorAll('.searchBox'); // 서치 input text
        const searchIcon = document.querySelector('.searchIcon'); //돋보기 아이콘
        const search_cancle = document.querySelector('.search_cancle'); // 취소 아이콘
        const sideBarBtn = document.querySelector('.sideBarBtn'); // 햄버거
        const search_result = document.querySelector('.search_result'); // 검색 결과창

        const gnb = document.querySelector('.gnb');

        // 검색 창 활성화
        searchBoxs.forEach(ele => {
            //검색 창 활성화 된 경우
            ele.addEventListener("focus", ()=>{
                sideBarBtn.classList.toggle("unactive", true);
                searchIcon.classList.toggle('unactive', true);
                search_cancle.classList.toggle("unactive", false);
                search_result.classList.toggle("unactive", false);
    
                gnb.classList.toggle("search_gnb", true);
            });
            
            // 검색어 입력시
            this.preSearchWord="";
            this.searchtime; //setTimeout 함수
            //검색 창에 검색어 입력시
            ele.addEventListener('input', ()=>{
            
                const value = ele.value;
                console.log("검색어 : ", value);
    
                 // 3초간 입력된 글자가 바뀌지 않은 경우 검색 시작
                if(this.searchtime){
                    clearTimeout(this.searchtime);
                }
                 
                this.searchtime = setTimeout(()=>{
                    this.getList(this.currentLat, this.currentLon, value)
                    .then((result)=>{
                        const newresult = result;
    
                        search_result.innerHTML = ""; //내용 제거
                        console.log("검색 결과 : ", newresult);
    
                        for(let i in newresult.name_list){
                            const store_name = newresult.name_list[i];
                            const store_latitude = newresult.coords[i].latitude;
                            const store_longitude = newresult.coords[i].longitude;
                            const store_addr = newresult.addr[i];
                            const store_tel = newresult.tel[i]
    
                            const searchBlock = document.createElement('div');
                            searchBlock.classList.add("searchBlock");
                            searchBlock.textContent = `${store_name}`;
    
                            search_result.appendChild(searchBlock);
    
                            // 검색 결과를 클릭 한 경우
                            searchBlock.addEventListener('click',()=>{
                                search_result.innerHTML = ""; //내용 제거

                                sideBarBtn.classList.toggle("unactive", false);
                                searchIcon.classList.toggle('unactive', false);
                                search_result.classList.toggle("unactive", true);                
    
                                this.clickSearchBlock(store_latitude, store_longitude, store_name, store_addr, store_tel);
                            });
                        }
                    });
                },300);
    
            });
        });

        // 검색 취소 버튼 클릭
        search_cancle.addEventListener('click', this.clickSearchCancleBtn.bind(this));
    }

    clickSearchCancleBtn(){
        this.gnbMode = "search";
        const search = document.querySelector('.search');
        const searchBoxs = document.querySelectorAll('.searchBox');
        
        const searchIcon = document.querySelector('.searchIcon');
        const search_cancle = document.querySelector('.search_cancle');
        const sideBarBtn = document.querySelector('.sideBarBtn');
        const search_result = document.querySelector('.search_result');
        const search_navi = document.querySelector('.search_navi');

        const gnb = document.querySelector('.gnb');

        sideBarBtn.classList.remove("unactive");
        searchIcon.classList.remove('unactive');
        search_cancle.classList.add("unactive");
        search_result.classList.add("unactive");

        gnb.classList.remove("search_gnb");

        search.classList.toggle("unactive", false);
        search_navi.classList.toggle("unactive", true);
        

        searchBoxs.forEach(element => {
            
            element.value="";
        });
       
        search_result.innerHTML = ""; //내용 제거
        this.search_words = ["", ""]; //검색 내용 초기화
        console.log("마커 지우기!!!");
        this.eraseMarkers.bind(this); // 마커 지우기
        this.markers = []; //마커 기록 지우기

        this.mapTool.setMapCenter(this.map, this.currentLat, this.currentLon);
    }

    //검색 결과중 하나 클릭시
    clickSearchBlock(lat, lng, name, addr, tel){
        //gnb모드 변경
        this.gnbMode = "navi";

        //도착 지점과 시작 지점에 모두 값이 들어가면 Navi 시작
        const gnb = document.querySelector(".gnb");
        const departures = document.querySelector(".departures");
        const arrivals = document.querySelector(".arrivals");
        const search_cancle = document.querySelector(".search_cancle");

        //둘다 검색어가 있는 경우
        if (departures.value && arrivals.value){
            if(this.search_words[0] ==""){
                departures.value = `${name}`;
                this.search_words[0] = {
                    name : name,
                    latitude : lat,
                    longitude : lng
                }
            }else{
                arrivals.value = `${name}`;
                this.search_words[1] = {
                    name : name,
                    latitude : lat,
                    longitude : lng
                }
            }

            gnb.classList.toggle("search_gnb", true);
            search_cancle.classList.toggle("unactive", false);

            const marker = this.mapTool.createMark(this.map, lat, lng);
            this.markers.push(marker);

            this.mapTool.setMapCenter(this.map, lat, lng);
            
            this.displayStoreInfo(lat, lng, name, addr, tel);
            
            // ------------------------------------------- Navi 시작 -------------------------------------------
            console.log("내비 시작");
            this.naviTool.navi(this.search_words[0].latitude, this.search_words[0].longitude, this.search_words[1].latitude, this.search_words[1].longitude);
        
        }
        //아직 길찾기가 아니야
        else{
            const search_navi = document.querySelector(".search_navi");
            const search = document.querySelector(".search");
            const placeInfo = document.querySelector('.placeInfo');
            const searchItem = document.querySelector(".searchItem");

            search_cancle.classList.toggle("unactive", true);
            search_navi.classList.toggle("unactive", true);
            search.classList.toggle("unactive", false);
            gnb.classList.toggle("search_gnb", false);
            placeInfo.classList.remove("unactive");
        
            searchItem.value = `${name}`;

            this.eraseMarkers.bind(this);
            const marker = this.mapTool.createMark(this.map, lat, lng);
            this.mapTool.setMapCenter(this.map, lat, lng);
            
            this.displayStoreInfo(lat, lng, name, addr, tel);
        }
    }

    displayStoreInfo(lat, lng, name, addr, tel){
        const palceName = document.querySelector('.placeName');
        const teldiv = document.querySelector('.tel');
        const addrdiv = document.querySelector('.addr');
        const startPointBtn = document.querySelector('.startPointBtn');
        const endPointBtn = document.querySelector('.endPointBtn');

        palceName.textContent = `${name}`;

        if(tel != ""){
            teldiv.textContent += `${tel}`;
        }
        else{
            teldiv.textContent +="전화번호 미등록";
        }

        addrdiv.textContent += `${addr}`;

        startPointBtn.addEventListener('click', 
            this.searchNavi.bind(this, false, name, lat, lng)
        );

        endPointBtn.addEventListener("click", 
            this.searchNavi.bind(this, true, name, lat, lng)
        );
    }

    // 길찾기 버튼(도착지로 설정, 출발지로 설정 버튼) 눌렀을 때
    searchNavi(isArrival, name, lat, lng){
        const search_result = document.querySelector('.search_result');
        const placeInfo = document.querySelector('.placeInfo');
        const search_navi = document.querySelector('.search_navi');
        const search = document.querySelector('.search');
        const sideBarBtn = document.querySelector('.sideBarBtn');
        const search_cancle = document.querySelector(".search_cancle");
        const gnb = document.querySelector(".gnb");

        search.classList.toggle("unactive", true);
        sideBarBtn.classList.toggle("unactive", true);
        search_navi.classList.toggle("unactive", false);
        search_cancle.classList.toggle("unactive", false);
        gnb.classList.toggle("search_gnb", true);
        placeInfo.classList.toggle("unactive", true);
        search_result.classList.toggle("unactive", false);

        const departures = document.querySelector('.departures');
        const arrivals = document.querySelector('.arrivals');

        //도착지 선택을 눌렀을 경우
        if(isArrival){
            arrivals.value = `${name}`;
            this.search_words[1] = {
                name : name,
                latitude : lat,
                longitude : lng
            }
        }
        //출발지 선택을 눌렀을 경우
        else{
            departures.value = `${name}`;
            this.search_words[0] = {
                name : name,
                latitude : lat,
                longitude : lng
            }

        }
    }

    eraseMarkers(){
        console.log(this.markers);
        this.markers.forEach(element => {
            console.log("마커지우기 : ", element);
            element.setMap(null);
        });
    }
}