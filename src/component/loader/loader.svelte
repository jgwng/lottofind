<div class="loader-3">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
</div>

<style>
    .loader-3 {
        width: 20em;
        display: flex;
        justify-content: space-evenly;
    }

    .circle {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        position: relative;
    }

    .circle:nth-child(1) {
        background-color: #FBC400;
    }
    .circle:nth-child(2) {
        background-color: #69C8F2;
    }
    .circle:nth-child(3) {
        background-color: #FF7272;
    }
    .circle:nth-child(4) {
        background-color: #AAAAAA;
    }
    .circle:nth-child(5) {
        background-color: #B0D840;
    }

    .circle::before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 50%;
        opacity: 0.5;
        animation: animateLoader38 2s ease-out infinite;
    }

    .circle:nth-child(1)::before {
    background-color: rgba(251, 196, 0, 0.5); /* Slightly transparent version of #FBC400 */
}
.circle:nth-child(2)::before {
    background-color: rgba(105, 200, 242, 0.5); /* Slightly transparent version of #69C8F2 */
    animation-delay: 0.2s;
}
.circle:nth-child(3)::before {
    background-color: rgba(255, 114, 114, 0.5); /* Slightly transparent version of #FF7272 */
    animation-delay: 0.4s;
}
.circle:nth-child(4)::before {
    background-color: rgba(170, 170, 170, 0.5); /* Slightly transparent version of #AAAAAA */
    animation-delay: 0.6s;
}
.circle:nth-child(5)::before {
    background-color: rgba(176, 216, 64, 0.5); /* Slightly transparent version of #B0D840 */
    animation-delay: 0.8s;
}

    @keyframes animateLoader38 {
    0% {
        transform: scale(1);
    }

    50%,
    75% {
        transform: scale(2.5);
    }

    80%,
    100% {
        opacity: 0;
    }
    }
</style>