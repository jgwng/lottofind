<script>
    export let markets = [];
</script>


<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-top: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
    }
    
    .header-title{
        font-size: 20px;
        font-weight: bold;
        color: white;
    }
    
    .header-address{
        font-size: 16px;
        padding-top: 4px;
        font-weight:500;
        color: white;
    }
</style>

<ul>
        {#each markets as market}
           <div class="header">
                <div>
                    <div class="header-title">{market.name ?? '테스트'}</div>
                    <div class="header-address">{market.address ?? '테스트'}</div>
                </div>
        </div>
        {/each}
</ul>

