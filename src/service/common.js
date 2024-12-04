import { mount } from 'svelte';
import BottomSheet from '../component/bottomSheet/basic_bottom_sheet.svelte';
export function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get the date part only
}
export function getLocalToday() {
    const today = new Date();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    // Return only the date in 'YYYY-MM-DD' format
    const formattedDate = new Intl.DateTimeFormat(undefined, options).format(today);
    return formattedDate; // 'YYYY-MM-DD' (e.g., '2024-12-04')
}

export function create(Component, target, props = {}) {
    return mount(Component, { target: target, props });
}

export function isRedirectedFromAPP() {
    const referrerChecks = ["threads", "slack"];
    const userAgentChecks = ["KAKAO", "FB", "Instagram", "trill"];

    // Check referrer
    const isRedirectedFromReferrer = referrerChecks.some(referrer => document.referrer.includes(referrer));

    // Check user agent
    const isRedirectedFromUserAgent = userAgentChecks.some(agent => navigator.userAgent.includes(agent));

    // If either referrer or user agent matches, set isRedirected to true
    const isRedirect = isRedirectedFromReferrer || isRedirectedFromUserAgent;

    return isRedirect;
}

export function openBottomSheet(Component, props, title) {
    const bottomSheet = document.querySelector('#bottom-sheet');
    if (!bottomSheet) {
        const container = document.createElement('div');
        container.id = 'bottom-sheet';
        document.body.appendChild(container);
    }

    var result = create(BottomSheet, document.querySelector('#bottom-sheet'), {
        visible: true,
        onClose: hideBottomSheet,
        title: title,
    });
    mount(Component, { target: document.querySelector('#content'), props });
}



function hideBottomSheet() {
    const container = document.querySelector('#bottom-sheet');
    if (container) {
        container.remove(); // Cleanup the DOM
    }
}