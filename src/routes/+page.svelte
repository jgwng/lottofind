<script>
	import { onMount, onDestroy} from 'svelte';
	import {handleResize, setMarker, showMarker, hideMarker,setInitCenter} from '../service/map';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import {getSidoData} from '../service/firebase';
	import SelectCityModal from '../component/modal/city_select.svelte';
	import '../resources/app.css';
	import '../resources/pin.css';
	import data from '../resources/data.json';
	import {isMobileDevice} from '../service/device';
    import Snackbar from '../component/snackbar/snackbar.svelte';
	import MobileNotice from '../component/modal/mobile_notice.svelte';
	import {getTodayDate, create, openBottomSheet, getLocalToday} from '../service/common';
	import CurrentMarkerList from '../component/bottomSheet/current_marker_list.svelte';

	let map;
	let sidoData = [];
	let markerList = [];
	let currentMarkerList = [];
	let initCenter;

	let showSelectModal = false;
	let showRefreshButton = false;

	let isMarkerClick = true;
	
	let showSnackbar = false;
	let snackbarMsg = '';
	let idleListener;

	let centerLatlng;
	$: centerLatlng, saveCenterLatLng();


	onMount(async () => {	
		checkShowModal();
		initializeMap();
		return ()=>{
			window.removeEventListener('resize', () => handleResize(map));
			naver.maps.Event.removeListener(dragEndListener);
		};
	});
	
	function checkShowModal(){
		if(isMobileDevice() === false) return;

		const today = getLocalToday();
    	const lastSeenDate = localStorage.getItem('modalLastSeen'); 
		if (lastSeenDate !== today) {
			create(
				MobileNotice,
				document.querySelector('#modal'),
			);
			localStorage.setItem('modalLastSeen', today);
		}
	}

	function initializeMap(){
		let lastCenter = setInitCenter();
		initCenter = new naver.maps.LatLng(
					lastCenter.lat,
					lastCenter.lng
		);
		var mapOptions = {
			center: initCenter,
    		zoom: 16,
		};
		map = new naver.maps.Map('map', mapOptions);
		
		if(navigator.geolocation){
			var latlng = {
				lat: initCenter.y,
				lng: initCenter.x
			};		
			var htmlMarker = setMarker(latlng,map,'#da1e37');
		}
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
			centerLatlng = { 
				lat:  map.getCenter().y,
				 lng: map.getCenter().x };
		});
	}

	function saveCenterLatLng(){
		if(browser && centerLatlng){
			localStorage.setItem("lastLatLng", JSON.stringify(centerLatlng));
		}
	}

	function updateMarkers(map, markers,isInit) {
		var mapBounds = map.getBounds();
		var marker, position;
		currentMarkerList = [];
		let dataList = [];
		
		for (var i = 0; i < markerList.length; i++) {

			marker = markers[i];
			position = marker.getPosition();
			console.log('position : ', position);
			if (mapBounds.hasLatLng(position)) {
				showMarker(map, marker);
				currentMarkerList.push(marker);
				data.lottoMarkets[i].marker = marker;
				dataList.push(data.lottoMarkets[i]);
			} else {
				hideMarker(map, marker);
			}
		}
		console.log(dataList);
		if(dataList.length > 0 && isInit !== true){
			openBottomSheet(CurrentMarkerList,{
				markets: dataList
			},'지도 내의 복권 판매점 목록');
		}
	}

	function getGeolocation() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		});
  	}	


	function onSearchMap(city, address){
		showSelectModal = false;
		var newCity = new naver.maps.LatLng(city.centerLat, city.centerLon);
		map.setCenter(newCity); 
		map.setZoom(16);
		showRefreshButton = true;
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
		updateMarkers(map,markerList,false);
	}

	function processMarkersInBackground(markets, map) {
		return new Promise((resolve) => {
			let index = 0;
			const batchSize = 100;

			function processBatch() {
				const end = Math.min(index + batchSize, markets.length);
				const bounds = map.getBounds();
				for (let i = index; i < end; i++) {
					var position = new naver.maps.LatLng(markets[i].lat, markets[i].lng);
					let isInBoundary = bounds.hasLatLng(position);
					console.log('isInBoundary : ', isInBoundary);
					if(isInBoundary === true){
						const lottoMarker = setMarker(markets[i], map, '#30343f');
						var contentString = `
							<div class="infoWindow">
								<div class="infoWindow-text">${markets[i].storeName}</div>
							</div>
						`;

						const infowindow = new naver.maps.InfoWindow({
							content: contentString,
							borderWidth: 0,
							pixelOffset: new naver.maps.Point(-27, -35),
							disableAnchor: true,
							backgroundColor: 'transparent',
						});

						naver.maps.Event.addListener(lottoMarker, 'click', (e) => {
							var markerPosition = new naver.maps.LatLng(e.coord.y, e.coord.x);
							map.panTo(markerPosition, { duration: 200 });
							console.log(markets[i]);
							copyToClipboard(markets[i].roadAddr);
						});

						if (isMobileDevice() === false) {
							naver.maps.Event.addListener(lottoMarker, 'mouseover', function() {
								console.log('mouseover');
								infowindow.open(map, lottoMarker);
							});

							naver.maps.Event.addListener(lottoMarker, 'mouseout', function() {
								console.log('mouseout');
								infowindow.close();
							});
						}
						showMarker(map, lottoMarker);
						markerList.push(lottoMarker);
					}
					console.log(markerList);
				}

				index = end;

				if (index < markets.length) {
					setTimeout(processBatch, 0);
				} else {
					resolve(); // Resolve the promise when processing is complete
				}
			}

			processBatch();
		});
	}

	async function copyToClipboard(msg) {
        try {
            await navigator.clipboard.writeText(msg);
			snackbarMsg = '가게 주소를 복사했습니다!';
			create(
				Snackbar,
				document.querySelector('#snackbar'),
				{ 
					isVisible: true,
					msg: snackbarMsg
				}
    		);
        }
		catch (err) {
			snackbarMsg = '가게 주소 복사를 실패했습니다.';
			create(
				Snackbar,
				document.querySelector('#snackbar'),
				{ 
					isVisible: true,
					msg: snackbarMsg
				}
    		);
            console.error('Failed to copy: ', err);
        }
    }

	function onTapSearchArea(){
		create(
			SelectCityModal,
			document.querySelector('#modal'),
			{ 
				isOpen: true,
				onTapConfirm: onSearchMap
			}
    	);
	}
</script>

<div style="width: 100%; height:400px;">
	<div id="map"></div>
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
  on:click={onTapSearchArea}
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
