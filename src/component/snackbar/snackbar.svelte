<script>
    import { fly } from 'svelte/transition';
    export let isVisible;
    export let msg;
    export let duration = 2000; // Default display duration for the snackbar

    // Reactive statement to trigger the snackbar display
    $: if (isVisible) {
        showSnackbar();
    }

    // Function to hide the snackbar after a delay
    function showSnackbar() {
        setTimeout(() => {
            isVisible = false; // Automatically hide the snackbar
        }, duration);
    }
</script>

<style>
    .snackbar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #323232;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
</style>

{#if isVisible}
    <div 
        class="snackbar" 
        in:fly={{ y: 100, duration: 300 }} 
        out:fly={{ y: 100, duration: 300 }}>
        {msg}
    </div>
{/if}
