<script>
    export let visible = false; // Prop to control visibility
    export let onClose; // Prop for the close action handler
    export let items = []; // List of SVG items
    export let title = '';
    export let onImageClick = (item) => {}; // Function to handle image click

    // Helper function to handle background click
    function handleBackgroundClick(event) {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }
    
    function handleImageClick(image) {
        onImageClick(image);
        onClose();
    }

    console.log(items);
  </script>
  
  <style>
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 1201;
    }
  
    .popup-container {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw; /* Full window width */
      max-width: 100vw; /* Ensure it doesn't exceed the window width */
      background-color: #2c2c2e;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      padding: 16px;
      box-sizing: border-box;
      transition: transform 0.3s ease-out;
      transform: translateY(100%);
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
  
    .popup-container.open {
      transform: translateY(0);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #333;
      flex-shrink: 0; /* Prevents the header from shrinking or scrolling */
    }

    .header-title {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }
  
    .header-close {
      font-size: 18px;
      color: white; /* iOS-style blue */
      cursor: pointer;
    }
    .content {
      flex-grow: 1; /* Takes the remaining height of the container */
      overflow-y: auto; /* Only the content inside will scroll */
      padding-top: 12px; /* Space between header and content */
    }
  </style>
  
  <div class="overlay" class:active={visible} on:click={handleBackgroundClick}></div>
  
  <div class="popup-container" class:open={visible}>
    <!-- Header with title and close button -->
    <div class="header">
      <span class="header-title">{title}</span>
      <span class="header-close" on:click={onClose}>✖</span>
    </div>
  
    <!-- Icon Grid -->
    <div class="content" id="content">
      <slot></slot>
    </div>
  </div>
  