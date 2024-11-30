<script>
    // Logo link and button URLs
    const logoLink = "/";
    const mapLink = "/";
    const historyLink = "/history";
</script>

<style>
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 20px;
        background-color: #f9f9f9; /* Light background color */
        border-bottom: 1px solid #ddd; /* Optional border */
    }

    .button-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    a {
        padding: 8px 16px;
        font-size: 16px;
        text-decoration: none;
        color: #333;
        transition: all 0.3s ease;
    }
    .logo{
        font-weight: bold;
        font-size: 20px;
    }
    a:hover {
        background-color: #f0f0f0;
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
        <a href={historyLink}>역대 당첨번호 조회</a>
    </div>
</header>
