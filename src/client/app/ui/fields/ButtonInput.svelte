<script>
export let value = null;
export let label;
export let disabled = false;
export let showLabel = true;
export let title = "";
export let context = null;
export let key = "";

</script>

<div class="button-container" class:disabled={disabled}>
    <button class="button" {disabled} on:click {title} on:mouseenter on:mouseleave>
        <span class="label" class:visually-hidden={!showLabel}>{label}</span>
        <slot></slot>
    </button>
</div>

<style>
.button-container {
    display: flex;
    width: 100%;
}

.button {
    display: flex;
    width: 100%;
    min-width: var(--height-input);
    height: var(--height-input);
    justify-content: center;
    align-items: center;
    padding: 0 4px;

    color: rgba(255, 255, 255, 0.5);
    font-size: var(--font-size-input);
    
    border-radius: var(--border-radius-input);
    background-color: var(--background-color, var(--color-background-input));
    box-shadow: inset 0 0 0 1px var(--box-shadow-color, var(--color-border-input));
}

:global(.field.disabled) .button {
    color: rgba(255, 255, 255, 0.2);
}

.button:hover {
    color: var(--color-text);

    box-shadow: inset 0 0 0 1px var(--box-shadow-color-active, var(--color-active));
}

.button:active {
    box-shadow: 0 0 0 2px var(--box-shadow-color-active, var(--color-active));
}

</style>
