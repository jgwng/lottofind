<script>
	import { onMount, onDestroy} from 'svelte';
	import {handleResize} from '../service/maputil';
	import {getSidoData,uploadSidoData, uploadData} from '../service/firebase';
	import SelectCityModal from '../component/modal/city_select.svelte';
	
	
	let map;
	let sidoData = [];

	let showSelectModal = false;

	onMount(async () => {
		var mapOptions = {
			center: new naver.maps.LatLng(37.3595704, 127.105399), //지도의 초기 중심 좌표
    		zoom: 15,
		};
		map = new naver.maps.Map('map', mapOptions);
		handleResize(map);
		// Attach resize event listener
		window.addEventListener('resize', () => handleResize(map));
	
		onDestroy(() => {
			window.removeEventListener('resize', () => handleResize(map));
		});
	})
	function onSearchMap(city, address){
		console.log(city);
		showSelectModal = false;
		var newCity = new naver.maps.LatLng(city.centerLat, city.centerLon);
		map.setCenter(newCity); 
		map.setZoom(16);
	}
</script>

<SelectCityModal bind:isOpen={showSelectModal} onTapConfirm={onSearchMap}></SelectCityModal>
<button on:click={ () => {showSelectModal=true}}>모달 테스트</button>

<div style="width: 100%; height:400px;">
	<div id="map" style="width: 100%; height: 100%;"></div>
</div>
