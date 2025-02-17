<script>
import { onMount } from "svelte";
import Module from "../ui/Module.svelte";
import Field from "../ui/Field.svelte";
import MIDI from "../inputs/MIDI.js";

export let mID;
export let hasHeader;

let input, output;
let inputs = [], outputs = [];

function createDeviceOptions(deviceMap = new Map()) {
    let options = [];

    if (deviceMap.size !== 0) {
        options.push({ value: "none", label: "No device selected." });
    }

    for (let entry of deviceMap) {
        let device = entry[1];
        const { id, name, manufacturer } = device;

        options.push({ value: id, label: `${manufacturer} ${name} – id: ${id}` });
    }

    if (options.length === 0) {
        options = [
            { value: "none", label: "No device detected."}
        ];
    }

    return options;
}

let messages = [];

$: {
    MIDI.selectedInputID = input;
}

$: {
    MIDI.selectedOutputID = output;
}

onMount(async () => {
    await MIDI.request();

    function refresh() {
        inputs = createDeviceOptions(MIDI.inputs);
        outputs = createDeviceOptions(MIDI.outputs);

        // if a single device is connected, select it by default
        input = (inputs.length === 2 ? inputs[1].value : inputs[0].value);
        output = (outputs.length === 2 ? outputs[1].value : outputs[0].value);
    }

    MIDI.addEventListener("connected", refresh);
    MIDI.addEventListener("disconnected", () => {
        refresh();
    });

    MIDI.addEventListener("message", (event) => {
        const { type, note, channel, value } = event;
        let date = new Date();
        let time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

        let noteLog = ["noteon", "noteoff"].includes(type) ? ` note:${note.name}` : ``; 

        messages = [
            ...messages,
            `${time} ${type} number:${note.number}${noteLog}`,
        ]
    });

    refresh();
});

</script>

<Module {mID} {hasHeader} name="MIDI" {...$$props} slug="midi">
    <Field
        key="inputs"
        value={input}
        on:change={(event) => input = event.detail}
        params={{
            options: inputs,
        }}
    />
    <Field
        key="outputs"
        value={output}
        on:change={(event) => output = event.detail}
        params={{
            options: outputs,
        }}
    />
    <Field
        key="messages"
        value={messages}
        type="list"
        params={{
            disabled: true
        }}
    />
</Module>
