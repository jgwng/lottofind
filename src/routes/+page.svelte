<script>
	import { onMount } from 'svelte';
	let containerHeight;
	let containerWidth;
  
	onMount(() => {
	  updateContainerSize();
	  window.addEventListener('resize', updateContainerSize);
	  return () => {
		window.removeEventListener('resize', updateContainerSize);
	  };
	});
  
	function updateContainerSize() {
	  containerHeight = window.innerHeight - 60;
	  containerWidth = window.innerWidth;
	}
  </script>
  
  <main 
	class="container"
	style="width: {containerWidth}px; height: {containerHeight}px;"
  >
	<div class="hero-section">
	  <h1 class="main-title">
		<span class="highlight">대박날지도</span>
	  </h1>
	  
	  <div class="features-container">
		<div class="feature-card">
		  <h2 class="feature-title">로또 판매점 찾기</h2>
		  <p class="feature-description">
			내 주변 가까운 로또 판매점을<br />
			쉽고 빠르게 찾아보세요
		  </p>
		  <a href="/map" class="feature-button">
			판매점 찾기
		  </a>
		</div>
  
		<div class="divider"></div>
  
		<div class="feature-card">
		  <h2 class="feature-title">회차별 당첨결과</h2>
		  <p class="feature-description">
			회차별 당첨번호와<br />
			당첨 통계를 확인해보세요
		  </p>
		  <a href="/history" class="feature-button">
			당첨결과 보기
		  </a>
		</div>
	  </div>
	</div>
  </main>
  
  <style>
	.container {
	  position: relative;
	  background: #EFF1F6;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  overflow: hidden;
	}
  
	.hero-section {
	  position: absolute;
	  left: 50%;
	  top: 50%;
	  transform: translate(-50%, -50%);
	  text-align: center;
	  max-width: 1200px;
	  width: 90%;
	  padding: 2rem;
	}
  
	.main-title {
	  font-size: 3rem;
	  margin-bottom: 3rem;
	  color: #1F1F1F;
	  text-align: center;
	}
  
	.features-container {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  gap: 2rem;
	  margin-top: 2rem;
	}
  
	.feature-card {
	  flex: 1;
	  max-width: 400px;
	  padding: 2rem;
	  background: rgba(255, 255, 255, 0.9);
	  border-radius: 16px;
	  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	  transition: transform 0.3s ease;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  text-align: center;
	}
  
	.feature-card:hover {
	  transform: translateY(-5px);
	}
  
	.feature-title {
	  font-size: 1.8rem;
	  color: #1F1F1F;
	  margin-bottom: 1rem;
	  text-align: center;
	}
  
	.feature-description {
	  font-size: 1.1rem;
	  color: #666;
	  line-height: 1.6;
	  margin-bottom: 2rem;
	  text-align: center;
	}
  
	.feature-button {
	  display: inline-block;
	  padding: 1rem 2rem;
	  background: #da1e37;
	  color: white;
	  text-decoration: none;
	  border-radius: 25px;
	  font-weight: bold;
	  transition: all 0.3s ease;
	}
  
	.feature-button:hover {
	  background: #b91830;
	  transform: scale(1.05);
	}
  
	.divider {
	  width: 2px;
	  background: linear-gradient(to bottom, transparent, #ddd, transparent);
	  align-self: stretch;
	}
  
	@media (max-width: 768px) {
	  .features-container {
		flex-direction: column;
		gap: 1.5rem;
	  }
  
	  .divider {
		display: none;
	  }
  
	  .feature-card {
		max-width: 100%;
	  }
  
	  .hero-section {
		padding: 1rem;
	  }
	}
  </style>