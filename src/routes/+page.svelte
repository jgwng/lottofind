<script>
	import { onMount, onDestroy} from 'svelte';
	import {handleResize, setMarker, showMarker, hideMarker} from '../service/map';
	import { fade } from 'svelte/transition';
	import {getSidoData} from '../service/firebase';
	import SelectCityModal from '../component/modal/city_select.svelte';
	import '../resources/app.css';
	import '../resources/pin.css';
	import data from '../resources/data.json';
	import {isMobileDevice} from '../service/device';
    import Snackbar from '../component/snackbar/snackbar.svelte';
	import MobileNotice from '../component/modal/mobile_notice.svelte';
	import {getTodayDate} from '../service/common';

	let map;
	let sidoData = [];
	let markerList = [];

	let showSelectModal = false;
	let initCenter;
	let showRefreshButton = false;

	let isMarkerClick = true;
	
	let showSnackbar = false;
	let showMobileNotice = true;
	let snackbarMsg = '';
	let idleListener;

	onMount(async () => {	
		let position;
		const today = getTodayDate();
        const lastSeenDate = localStorage.getItem('modalLastSeen');

        if (lastSeenDate !== today && isMobileDevice) {
            showMobileNotice = true; // Show the modal if it hasn't been seen today
        }else{
			showMobileNotice = false;
		}
		initializeMap();

		updateMarkers(map,markerList);

		await setCurrentPosition();

		return ()=>{
			window.removeEventListener('resize', () => handleResize(map));
			naver.maps.Event.removeListener(dragEndListener);
		};
	});

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
			};		
			var htmlMarker = setMarker(latlng,map,'#da1e37');
		}
		
	}
	
	function updateMarkers(map, markers) {
		var mapBounds = map.getBounds();
		var marker, position;

		for (var i = 0; i < markerList.length; i++) {

			marker = markers[i];
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
				var contentString = `
            		<div style="width:150px;text-align:center;padding:10px; background-color:var(--info-color); border-radius:20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
                		<div>${markets[i].storeName}</div>
            		</div>
            	`;
				
				const infowindow = new naver.maps.InfoWindow({
                        content: contentString,
                        borderWidth: 0,
                        pixelOffset: new naver.maps.Point(-25, -25),
                        disableAnchor: true,
                        backgroundColor: 'transparent',
                    });
				
				naver.maps.Event.addListener(lottoMarker, 'click',  (e) => {
					var markerPosition =  new naver.maps.LatLng(e.coord.y,e.coord.x);
					map.panTo(markerPosition,{ duration: 200 });
					copyToClipboard(markets[i].roadAddr);
				});

				if(isMobileDevice() === false){
					// 마커에 마우스 오버 이벤트 추가
					naver.maps.Event.addListener(lottoMarker, 'mouseover', function() {
						console.log('mouseover');
						infowindow.open(map, lottoMarker);
					});

					// 마커에 마우스 아웃 이벤트 추가
					naver.maps.Event.addListener(lottoMarker, 'mouseout', function() {
						console.log('mouseout');
						infowindow.close();
					});
				}
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
			snackbarMsg = '가게 주소를 복사했습니다!';
			showSnackbar = true;
        }
		catch (err) {
			snackbarMsg = '가게 주소 복사를 실패했습니다.';
			showSnackbar = true;
            console.error('Failed to copy: ', err);
        }
    }
	

</script>

<MobileNotice bind:showModal={showMobileNotice}></MobileNotice>
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
  on:click={() => { showSelectModal = true; }}
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
