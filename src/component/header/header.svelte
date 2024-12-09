<script>
    // Logo link and button URLs
    const logoLink = "/";
    const mapLink = "/";
    const historyLink = "/history";
</script>

<style>
    header {
        width: 100vw; /* Make header span the full width of the viewport */
        max-width: 100%; /* Ensure it doesn't exceed the window width */
        box-sizing: border-box; /* Include padding in the total width */
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 16px;
        background-color: #f9f9f9;
        border-bottom: 1px solid #ddd;
    }


    .button-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    a {
        font-size: 16px;
        text-decoration: none;
        color: #333;
        transition: all 0.3s ease;
    }
    .logo{
        font-weight: bold;
        font-size: 20px;
        padding-left: 4px;
        color: #333;
    }
    a:hover {
        background-color: transparent;
        text-decoration:none;
        color: var(--main-color);
    }

    .divider {
        width: 1px;
        height: 24px; /* Adjust divider height */
        background-color: #ddd; /* Light grey color */
    }
</style>

<header>
    <!-- Logo Section -->
    <a href={logoLink} class="logo">대박날지도</a>

    <!-- Button Group -->
    <div class="button-group">
        <a href={mapLink}>로또 판매점 찾기</a>
        <div class="divider"></div>
        <a href={historyLink}>회차별 당첨결과</a>
    </div>
</header>
