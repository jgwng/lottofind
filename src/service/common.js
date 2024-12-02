import { mount } from 'svelte';

export function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get the date part only
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