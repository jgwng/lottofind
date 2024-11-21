<script>
	import { onMount, onDestroy} from 'svelte';
	import {handleResize, setMarker} from '../service/maputil';
	import { fade } from 'svelte/transition';
	import {getSidoData,uploadSidoData, uploadData} from '../service/firebase';
	import SelectCityModal from '../component/modal/city_select.svelte';
	import '../resources/app.css';
	import '../resources/pin.css';
	import data from './data.json';
	
	let map;
	let sidoData = [];

	let showSelectModal = false;
	let initCenter;
	let showRefreshButton = false;

	let dragEndListener;

	onMount(async () => {	
		let position;
		if (navigator.geolocation) {
			// Wait for geolocation to resolve using a Promise wrapper
			position = await getGeolocation();
			initCenter = new naver.maps.LatLng(position.coords.latitude,position.coords.longitude);
		}else{
			initCenter = new naver.maps.LatLng(37.3595704, 127.105399);
		}
	
		initializeMap();
		
		//렌더링 테스트로 임시로 갯수 설정 확인
		for(let i = 0;i<100;i++){
			setMarker(data.lottoMarkets[i],map);
		}

		return ()=>{
			window.removeEventListener('resize', () => handleResize(map));
			naver.maps.Event.removeListener(dragEndListener);
		}
	})
	
	function getGeolocation() {
		return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
		});
  	}	


	function onSearchMap(city, address){
		console.log(city);
		showSelectModal = false;
		var newCity = new naver.maps.LatLng(city.centerLat, city.centerLon);
		map.setCenter(newCity); 
		map.setZoom(16);
	}

	function initializeMap(){
		var mapOptions = {
			center: initCenter, //지도의 초기 중심 좌표
    		zoom: 16,
		};
		map = new naver.maps.Map('map', mapOptions);
		
		
		handleResize(map);
		
		if(initCenter){
			var position = {
				lat: initCenter.y,
				lng: initCenter.x
			}		
			var htmlMarker = setMarker(position,map);
		}
		
		// Attach resize event listener
		window.addEventListener('resize', () => handleResize(map));
		dragEndListener = naver.maps.Event.addListener(map, 'dragend', function(e) {
			showRefreshButton = true;
		});
	}
	
	function handleFabClick(){
		if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					initCenter = new naver.maps.LatLng(position.coords.latitude,position.coords.longitude);
					map.setCenter(initCenter);
					map.setZoom(16);
				}, ()=>{});
		}
	}

</script>

<SelectCityModal bind:isOpen={showSelectModal} onTapConfirm={onSearchMap}></SelectCityModal>
<div style="width: 100%; height:400px;">
	<div id="map" style="width: 100%; height: 100%;"></div>
</div>

{#if showRefreshButton}
<button class="refresh" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} on:click={() => { showRefreshButton = false }}>
	<div class="content">
		현 위치에서 검색
		<img class ="buttonImg" src="./assets/refresh.svg" alt="search" />
	  </div>
  </button>
{/if}

  <button
  class="searchArea"
  on:click={() => { showSelectModal = true }}
>
  <div class="content">
    지역검색
    <img class ="buttonImg" src="./assets/down.svg" alt="search" />
  </div>
</button>


<button
  class="fab"
  on:click={handleFabClick}
>
  <img src='./assets/location.svg' style="width:24px;height:24px;" alt='search'>
</button>
