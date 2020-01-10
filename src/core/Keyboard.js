import { Trigger } from "./Trigger.js";

const Keyboard = function() {
    let triggers = [];

    window.addEventListener('keypress', onKeyPress);

    function onKeyPress(event) {
        for (let i = 0; i < triggers.length; i++) {
            if (triggers[i].value.includes(event.key) && triggers[i].enabled) {
                triggers[i].trigger();
            }
        }
    }

    function key(value) {
        let trigger = new Trigger('keyboard', value);

        triggers.push(trigger);

        return trigger;
    }

    return {
        key,
    };
}();

export { Keyboard };