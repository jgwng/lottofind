<script>
    import { slide } from 'svelte/transition';

    export let visible = false;
    export let onClose;
    export let items = [];
    export let title = '';
    export let onImageClick = (item) => {};

    function handleBackgroundClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    function handleImageClick(image) {
        onImageClick(image);
        onClose();
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
        height: 45vh;
        max-height: 45vh;
        display: flex;
        flex-direction: column;
    }

    .overlay.active {
        visibility: visible;
        opacity: 1;
    }
</style>

<div class="overlay" class:active={visible} on:click={handleBackgroundClick}></div>

<!-- Use Svelte's transition directive -->
<div class="popup-container" transition:slide={{ duration: 300 }} class:open={visible}>
    <!-- Header with title and close button -->
    <div class="header">
        <span class="header-title">{title}</span>
        <span class="header-close" on:click={onClose}>✖</span>
    </div>

    <!-- Content Area -->
    <div class="content" id="content">
        <slot></slot>
    </div>
</div>
