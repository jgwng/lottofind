<script>
    export let markets = [];
    export let map;

    function onTapMarket(market){
        var marketPos = new naver.maps.LatLng(market.lat, market.lng);
		map.setCenter(marketPos); 
    }
</script>


<style>
    .market {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-top: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
    }
    
    .market-name{
        font-size: 20px;
        font-weight: bold;
        color: white;
    }
    
    .market-address{
        font-size: 16px;
        padding-top: 4px;
        font-weight:500;
        color: white;
    }
    
    .market:hover {
        background-color: #f0f0f0;
        color: #333;
    }

    .market:hover .market-name,
    .market:hover .market-address {
        color: #333; 
    }
    
    ul {
        max-height: 400px; /* Set the maximum height for the list */
        overflow-y: auto; /* Enable vertical scrolling */
        padding: 0; /* Remove default padding */
        margin: 0; /* Remove default margin */
        list-style: none; /* Remove default list styling */
    }
</style>

<ul>
        {#each markets as market}
           <div class="market" on:click={() => onTapMarket(market)}>
                <div>
                    <div class="market-name">{market.storeName ?? ''}</div>
                    <div class="market-address">{market.roadAddr ?? ''}</div>
                </div>
        </div>
        {/each}
</ul>

