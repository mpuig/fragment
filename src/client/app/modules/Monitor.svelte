<script context="module">
let ID = 0;
</script>

<script>
import { onMount, onDestroy } from "svelte";
import Module from "../ui/Module.svelte";
import SketchRenderer from "../ui/SketchRenderer.svelte";
import OutputRenderer from "../ui/OutputRenderer.svelte";
import SketchSelect from "../ui/SketchSelect.svelte";
import { sketchesKeys } from "../stores/sketches.js";
import { monitors, preview } from "../stores/rendering";

export let mID;
export let hasHeader = true;
export let sketchKey = null;

let id = ID++;
let name = "monitor";
let selected = sketchKey ?
    sketchKey :
    ($preview ? $preview : $sketchesKeys[Math.min(id, $sketchesKeys.length - 1)]);

sketchesKeys.subscribe((keys) => {
    if (!selected && keys.length > 0) {
        $monitors = $monitors.map(monitor => {
            if (monitor.id === id) {
                monitor.selected = $sketchesKeys[Math.min(id, $sketchesKeys.length - 1)];
            }

            return monitor;
        });
    }
});

onMount(() => {
    $monitors = [
        ...$monitors,
        {
            id,
            selected,
        }
    ];
});

monitors.subscribe((all) => {
    const current = all.find((monitor) => monitor.id === id);

    if (current && current.selected !== selected) {
        selected = current.selected;
    }
})

onDestroy(() => {
    $monitors = $monitors.filter((m) => m.id !== id);
});

$: index = $monitors.findIndex(monitor => monitor.id === id);
$: moduleName = `${name} ${$monitors.length > 1 ? (index + 1) : ""}`;
</script>

<Module {hasHeader} {mID} slug="monitor" name={moduleName} scrollable={false}>
    <svelte:fragment slot="header-left">
        <SketchSelect
            monitorID={id}
            {selected}
        />
    </svelte:fragment>
    {#if selected && selected !== "output"}
        <SketchRenderer key={selected} {id} />
    {:else if selected }
        <OutputRenderer />
    {/if}
</Module>
