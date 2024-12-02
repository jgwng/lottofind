<script>
    import {getTodayDate} from '../../service/common';

    export let showModal = true;

    function closeModal() {
        const today = getTodayDate();
        localStorage.setItem('modalLastSeen', today); // Save today's date
        showModal = false; // Hide the modal
    }
</script>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8); /* Dark background */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .mobile-modal {
        background-color: #1a1a1a; /* Dark gray */
        color: white;
        border-radius: 10px;
        text-align: center;
        width: 80%;
        max-width: 400px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .mobile-modal p {
        padding-top: 16px;
        padding-bottom: 8px;
        font-size: 14px;
        line-height: 1.5;
    }

    .mobile-modal button {
        padding-top: 16px;
        padding-bottom: 16px;
        font-size: 16px;
        color: #007BFF; /* Blue text for button */
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .mobile-modal button:hover {
        text-decoration: underline;
    }

    .divider {
        width: 100%;
        height: 1px;
        background-color: rgb(55, 54, 55); /* Divider color */
       
    }
</style>

{#if showModal}
    <div class="modal-backdrop">
        <div class="mobile-modal">
            <p>본 서비스는 PC 환경과<br>Chrome 환경에 최적화되어있습니다.</p>
             <div class="divider"></div>
            <button on:click={closeModal}>확인</button>
        </div>
    </div>
{/if}
