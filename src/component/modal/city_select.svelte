<script>
    import { onMount, onDestroy} from 'svelte';
    import {getSidoData} from '../../service/firebase';
    import '../../resources/style.css';
    export let isOpen = false;
    export let onTapConfirm = (city,address) => {};

    let currentStep = 0;
    let cities = [];
    let selectCityData = ['','',''];
    let selectCity = [];
    
    let selectLatLng;
    let lastCortarCode;

    const openModal = () => {
      isOpen = true;
    };
  
    const closeModal = () => {
      isOpen = false;
    };
    
    onMount(async () => {
        fetchSidoData("sido/0000000000",);
	  });

    async function fetchSidoData(directory) {
        try {
            const queryDocument = await getSidoData(directory, false);

            if (queryDocument.exists()) {
            const documentData = queryDocument.data();
            
            let regionList = documentData.regionList || [];
            let cortarList = documentData.cortarList || [];
            let centerLatList = documentData.centerLatList || [];
            let centerLonList = documentData.centerLonList || [];
            
            if(document.centerLat && document.centerLon){
                selectLatLng = { 
				    lat:  document.centerLat,
				    lng: document.centerLon
                };
            }    
            if(cities.length ===0){
                cities = regionList.map((name, index) => ({
                name: name, // For display under the image
                code: cortarList[index],
                centerLat: centerLatList[index],
                centerLon: centerLonList[index],
            }));
            }else{
                // Create the items array for asset-grid
                for(var i = 0; i < regionList.length; i++){
                    if(i < cities.length){
                        cities[i].name = regionList[i];
                        cities[i].code = cortarList[i];
                        cities[i].centerLat = centerLatList[i];
                        cities[i].centerLon = centerLonList[i];
                    }else{
                        cities = [
                        ...cities,
                        {
                            name: regionList[i], // For display under the image
                            code: cortarList[i],
                            centerLat: centerLatList[i],
                            centerLon: centerLonList[i],
                        }
                        ];
                    }
                }
                if (cities.length > regionList.length) {
                    cities = cities.slice(0, regionList.length);
                }
            }
             return;
            } else {
             return;
            }
        } catch (error) {
            return [];
        }
    }
    function resetDataBelowStep(step) {
        // Reset all elements lower than the given step
        for (let i = step; i < selectCityData.length; i++) {
            selectCityData[i] = '';
            selectCity[i] = {};
        }
    }

    function selectStep(step) {
        resetDataBelowStep(step);
        currentStep = step;
        if(currentStep === 0){
            fetchSidoData("sido/0000000000");
        }else if(currentStep === 1){
            fetchSidoData(`sido/${selectCity[0].code}`);
        }
    }
    
    function onTapCity(city){
        selectCityData[currentStep] = city.name;
        selectCity[currentStep] = {
          name: city.name, 
          code: city.code,
          centerLat: city.centerLat,
          centerLon: city.centerLon,
        };
        if(currentStep === 0){
            fetchSidoData(`sido/${city.code}`);
            lastCortarCode = city.code;
            currentStep = 1;
        }else if(currentStep === 1){
            fetchSidoData(`sido/${selectCity[0].code}/region/${selectCity[1].code}`);
            currentStep = 2;
        }
    }
  </script>

  
  <!-- Modal -->
  {#if isOpen}
    <div class="modal-overlay" on:click={closeModal}>
        <div class="modal-overlay" on:click={closeModal}>
            <div class="modal" on:click|stopPropagation>
              <div class="modal-header">
                <h2>지역 선택</h2>
                <button on:click={closeModal}>취소</button>
              </div>
              <div class="modal-content">
                <div class="breadcrumb">
                  <a href="#"
                    class={selectCityData[0] === '' ? 'empty' : 'filled'}
                    on:click={() => selectStep(0)}>{selectCityData[0] === '' ? '시/도' : selectCityData[0]}</a> /
                  <a href="#"
                    class={selectCityData[1] === '' ? 'empty' : 'filled'}
                    on:click={() => selectStep(1)}>{selectCityData[1] === '' ? '시/구/군' : selectCityData[1]}</a> /
                  <a href="#"
                    class={selectCityData[2] === '' ? 'empty' : 'filled'}
                    on:click={() => selectStep(2)}>{selectCityData[2] === '' ? '읍/면/동' : selectCityData[2]}</a>
                </div>
                <div class="city-grid">
                  {#each cities as city}
                    <div on:click={() => onTapCity(city)}>{city.name}</div>
                  {/each}
                </div>
              </div>
              <button 
                class="wbottom-button"
                id="modal-bottom-button"
                disabled={selectCityData.every(item => item === '')}
                on:click={() => onTapConfirm(selectCity[selectCity.length - 1],selectCityData.join(' '))}>{selectCityData.join(' ')} 선택
              </button>
            </div>
          </div>
    </div>
  {/if}
  