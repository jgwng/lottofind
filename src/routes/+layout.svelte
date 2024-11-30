<script>
    import Header from '../component/header/header.svelte';

    /** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>



<Header></Header>
{@render children()}