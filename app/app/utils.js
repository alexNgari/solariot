/**
 * @param  {...String} str
 */
export function empty(...str) {
    return str.some(e => e === undefined || e === null || e.trim() === '');
}

/**
 * @param {String} str
 */
export function uppercase(str) {
    if (str.length < 1) return '';
    return str.charAt(0).toUpperCase() + ((str.length > 1) ? str.substring(1) : '');
}

export function onUpdate(e, then = null) {
    const {
        id, value, checked, name,
    } = e.target;
    const ipType = e.target.getAttribute('type');
    switch (ipType) {
        case 'checkbox':
            this.$data[id] = checked;
            console.log(`update checked: ${checked}`);
            break;
        case 'radio':
            this.$data[name] = id;
            console.log(`update checked: ${id}`);
            break;
        default:
            this.$data[id] = value;
            console.log(`update ${value}`);
            break;
    }
    if (then !== null) then();
}

// /**
//  * @param {Object} obj
//  * @param  {...String} exclude
//  */
// export function objToArray(obj, ...exclude) {
//     const result = [];
//     Object.keys(obj)
//         .reduce((prev, key) => {
//             if (!exclude.includes(key)) {
//                 result.push(obj[key]);
//             }
//             return result;
//         });
// }

/**
 * @param {Array} arr
 * @param  {...any} exclude
 * @returns {Array}
 */
export function arrayRemove(arr, ...exclude) {
    exclude.forEach((key) => {
        const i = arr.indexOf(key);
        if (i > -1) arr.splice(i, 1);
    });
    return arr;
}

/**
 * @param {Event} e
 * @param {function} fn
 */
export function load(e, fn) {
    const { id } = e.target
    this.$data[id] = true;
    fn();
    this.$data[id] = false;
}
