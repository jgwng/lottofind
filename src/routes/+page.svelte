<script>
	import { onMount, onDestroy} from 'svelte';
	import {handleResize, setMarker, showMarker, hideMarker} from '../service/maputil';
	import { fade } from 'svelte/transition';
	import {getSidoData,uploadSidoData, uploadData} from '../service/firebase';
	import SelectCityModal from '../component/modal/city_select.svelte';
	import '../resources/app.css';
	import '../resources/pin.css';
	import data from '../resources/data.json';
    import Snackbar from '../component/snackbar/snackbar.svelte';
	
	let map;
	let sidoData = [];
	let markerList = [];

	let showSelectModal = false;
	let initCenter;
	let showRefreshButton = false;

	let isMarkerClick = true;
	
	let showSnackbar = false;
	let snackbarMsg = '';
	let idleListener;

	onMount(async () => {	
		let position;
	
		initializeMap();

		updateMarkers(map,markerList);
		
		await setCurrentPosition();

		return ()=>{
			window.removeEventListener('resize', () => handleResize(map));
			naver.maps.Event.removeListener(dragEndListener);
		}
	})

	async function setCurrentPosition(){
		if (navigator.geolocation) {
			// Wait for geolocation to resolve using a Promise wrapper
			let  position = await getGeolocation();
			initCenter = new naver.maps.LatLng(position.coords.latitude,position.coords.longitude);
		}else{
			initCenter = new naver.maps.LatLng(37.3595704, 127.105399);
		}

		map.setCenter(initCenter);
		if(initCenter){
			var latlng = {
				lat: initCenter.y,
				lng: initCenter.x
			}		
			var htmlMarker = setMarker(latlng,map,'#da1e37');
		}
		
	}
	
	function updateMarkers(map, markers) {
		var mapBounds = map.getBounds();
		var marker, position;

		for (var i = 0; i < markerList.length; i++) {

			marker = markers[i]
			position = marker.getPosition();

			if (mapBounds.hasLatLng(position)) {
				showMarker(map, marker);
			} else {
				hideMarker(map, marker);
			}
		}
	}

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
    		zoom: 16,
		};
		map = new naver.maps.Map('map', mapOptions);
		
		processMarkersInBackground(data.lottoMarkets, map);
		
		//렌더링 테스트로 임시로 갯수 설정 확인
		handleResize(map);
		
		// Attach resize event listener
		window.addEventListener('resize', () => handleResize(map));

		idleListener = naver.maps.Event.addListener(map, 'idle', function(e) {
			if(isMarkerClick === true){
				isMarkerClick = false;
			}else{
				showRefreshButton = true;
			}
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

	function refreshShowingMarker(){
		showRefreshButton = false;
		updateMarkers(map,markerList);
	}

	function processMarkersInBackground(markets, map) {
		let index = 0;
		const batchSize = 100; // Number of markers processed per batch

		function processBatch() {
			const end = Math.min(index + batchSize, markets.length);
			for (let i = index; i < end; i++) {
				const lottoMarker = setMarker(markets[i], map,'#30343f');
				naver.maps.Event.addListener(lottoMarker, 'click',  (e) => {
					var markerPosition =  new naver.maps.LatLng(e.coord.y,e.coord.x);
					map.panTo(markerPosition,{ duration: 200 });
					copyToClipboard(markets[i].roadAddr);
				});
				markerList.push(lottoMarker);
			}

			index = end;

			if (index < markets.length) {
				// Continue processing in the next available frame
				setTimeout(processBatch, 0); // Or use requestAnimationFrame(processBatch);
			}
		}
		processBatch(); // Start processing
	}

	async function copyToClipboard(msg) {
        try {
            await navigator.clipboard.writeText(msg);
			snackbarMsg = '가게 주소를 복사했습니다!'
			showSnackbar = true;
        }
		catch (err) {
			snackbarMsg = '가게 주소 복사를 실패했습니다.'
			showSnackbar = true;
            console.error('Failed to copy: ', err);
        }
    }

</script>

<SelectCityModal bind:isOpen={showSelectModal} onTapConfirm={onSearchMap}></SelectCityModal>

<Snackbar bind:isVisible={showSnackbar} bind:msg={snackbarMsg}></Snackbar>

<div style="width: 100%; height:400px;">
	<div id="map" style="width: 100%; height: 100%;"></div>
</div>

{#if showRefreshButton}
<button class="refresh" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }} on:click={refreshShowingMarker}>
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
