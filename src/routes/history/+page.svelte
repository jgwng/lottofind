<script>
  import './styles.css';
  import { onMount, onDestroy} from 'svelte';
  import {getRecentDrwNo, getLottoDrawNo} from '../../service/firebase';  
  
  let lastDrwNo = 0;
  let currentDrwNo = 0;

  let lotteryData = {};
  let lottoNoResult = [];

  onMount(async () => {	
		let result = await getRecentDrwNo();
        const documentData = result.data();
        lastDrwNo = documentData.drwNo-1;
        currentDrwNo = lastDrwNo;

        await getLottoData();
  });

  async function getLottoData(){
        let drawResult = await getLottoDrawNo(currentDrwNo);
        const resultDocument = drawResult.data();
        
        lotteryData = resultDocument;
        lottoNoResult = [
            lotteryData.drwtNo1, lotteryData.drwtNo2, lotteryData.drwtNo3,
            lotteryData.drwtNo4, lotteryData.drwtNo5, lotteryData.drwtNo6
        ];
  } 

  
  // Function to determine CSS class for bonus ball
  function getClassName(number) {
    if (number >= 1 && number <= 10) return "ball1";
    if (number >= 11 && number <= 20) return "ball2";
    if (number >= 21 && number <= 30) return "ball3";
    if (number >= 31 && number <= 40) return "ball4";
    if (number >= 41 && number <= 45) return "ball5";
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  }

  function onFetchLottoDrawData(isPlus){
    if(isPlus){
        if(currentDrwNo === lastDrwNo){
            alert('가장 최신 회차입니다!');
            return;
        }
        currentDrwNo += 1;
    }else{
        if(currentDrwNo === 1){
             alert('이전 회차 정보가 없습니다!');
            return;
        }
        currentDrwNo -= 1;
    }
    getLottoData();
  }
</script>

<div class="window">
    <div class="lottery-container">
    {#if lottoNoResult.length >0} 
        <div class="title">{lotteryData.drwNo}회 당첨결과</div>
        <div class="subtitle">({formatDate(lotteryData.drwNoDate)} 추첨)</div>

        <div class="number-container">
            {#each lottoNoResult as number}
            <div class="lottoBall lrg {getClassName(number)}">{number}</div>
            {/each}
            <div class="plus-sign">+</div>
            <div class="lottoBonusBall {getClassName(lotteryData.bnusNo)}">{lotteryData.bnusNo}</div>
        </div>
    {:else}
        <div class="title">{lotteryData.drwNo}회 당첨결과</div>
    {/if}
    </div>
    <div class='button-container'>
        <button class="bottom-button" style=" width: 56px;" on:click={() => onFetchLottoDrawData(false)}>이전 회차</button>
        <button class="bottom-button" style=" width: 56px;" on:click={() => onFetchLottoDrawData(true)}>다음 회차</button>
    </div>
   
</div>