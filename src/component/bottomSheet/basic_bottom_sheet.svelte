<script>
    import { slide } from 'svelte/transition';

    export let visible = false;
    export let onClose;
    export let title = '';
    function handleBackgroundClick(event) {
        if (event.target === event.currentTarget) {
            visible = false;
            onClose();
        }
    }

</script>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 1201;
    }

    .popup-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #2c2c2e;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        padding: 16px;
        box-sizing: border-box;
        z-index: 1202;
        display: flex;
        flex-direction: column;
       transition: transform 0.3s ease-out;
        transform: translateY(100%);
    }
    
    .popup-container.open {
      transform: translateY(0);
    }

    .overlay.active {
        visibility: visible;
        opacity: 1;
    }
    .bottom-sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #333;
      flex-shrink: 0; /* Prevents the header from shrinking or scrolling */
    }

    .bottom-sheet-header-title {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }
  
    .bottom-sheet-header-close {
      font-size: 18px;
      color: white; /* iOS-style blue */
      cursor: pointer;
    }
</style>

<div class="overlay" class:active={visible} on:click={handleBackgroundClick}></div>

<!-- Use Svelte's transition directive -->
<div class="popup-container" transition:slide={{ duration: 300 }} class:open={visible} id="bottom-sheet-container">
    <!-- Header with title and close button -->
    <div class="bottom-sheet-header">
        <span class="bottom-sheet-header-title">{title}</span>
        <span class="bottom-sheet-header-close" on:click={onClose}>✖</span>
    </div>

    <!-- Content Area -->
    <div class="content" id="content">
        <slot></slot>
    </div>
</div>
