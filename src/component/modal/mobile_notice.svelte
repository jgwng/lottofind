<script>
    import {getTodayDate} from '../../service/common';
    import '../../resources/style.css';
    export let showModal = true;

    function closeModal() {
        const today = getTodayDate();
        localStorage.setItem('modalLastSeen', today); // Save today's date
        showModal = false; // Hide the modal
    }
</script>

{#if showModal}
    <div class="modal-overlay">
        <div class="mobile-modal">
            <p>본 서비스는 PC 환경과<br>Chrome 환경에 최적화되어있습니다.</p>
             <div class="divider"></div>
            <button on:click={closeModal}>확인</button>
        </div>
    </div>
{/if}
