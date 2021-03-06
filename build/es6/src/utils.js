import { unpackFrom, pack } from "python-struct";
import LGXDevice, { getDevice, getVendor } from "./lgxDevice";
import { PinMappingError } from "./errors";
import PLC from "./PLC";
export function getWordCount(start, length, bits) {
    var newStart = start % bits;
    var newEnd = newStart + length;
    var totalWords = (newEnd - 1) / bits;
    return totalWords + 1;
}
export function parseTagName(tag, offset) {
    var bt = tag, ind = 0;
    try {
        if (tag.endsWith("]")) {
            var pos = tag.length - tag.indexOf("[");
            bt = tag.slice(0, -pos);
            var temp = tag.slice(-pos);
            ind = temp.slice(1, -1);
            var s = ind.split(",");
            if (s.length === 1) {
                ind = parseInt(ind, 10);
            }
            else {
                ind = s.map(function (n) { return Math.round(parseInt(n)); });
            }
        }
        return [tag, bt, ind];
    }
    catch (error) {
        return [tag, bt, 0];
    }
}
export function BitofWord(tag) {
    var s = tag.split(".");
    return /^\d+$/.test(s[s.length - 1]);
}
export function BitValue(value, bitno) {
    return value & (1 << bitno);
}
export function getBitOfWord(tag, value) {
    var split_tag = tag.split("."), stripped = split_tag[split_tag.length - 1];
    var returnValue;
    if (stripped.endsWith("]")) {
        var val = parseInt(stripped.slice(stripped.indexOf("[") + 1, stripped.lastIndexOf("]")), 10);
        var bitPos = val & 0x1f;
        returnValue = BitValue(value, bitPos);
    }
    else {
        try {
            var bitPos = parseInt(stripped, 10);
            if (bitPos <= 31)
                returnValue = BitValue(value, bitPos);
        }
        catch (error) { }
    }
    return returnValue;
}
export function nameFunction(name, body) {
    var _a;
    return (_a = {},
        _a[name] = function () {
            return body();
        },
        _a)[name];
}
export function _replacePin(str, pin) {
    if (str === void 0) { str = ""; }
    if (typeof str !== "string")
        throw new TypeError("Pin must be a string not a " + typeof str);
    if (typeof pin === "string" && !/\d{1,}/.test(pin))
        throw new TypeError("Pin must has number to assing pin value: " + pin);
    var match = str.match(/{(d+)}/);
    if (match === null)
        throw new PinMappingError("Replace: " + str + " no match with {d} or {dd}");
    if (match.index == undefined)
        throw new PinMappingError("No match found to pin");
    return str.replace(match[0], String(pin).padStart(match[1].length, "0"));
}
export var flatten = function (arr) {
    return arr.reduce(function (flat, next) { return flat.concat(next); }, []);
};
export function parseIdentityResponse(data, rinfo, resp) {
    if (!resp)
        resp = new LGXDevice(rinfo);
    try {
        if (!(resp instanceof PLC)) {
            resp.length = unpackFrom("<H", data, true, 28)[0];
            resp.encapsulationVersion = unpackFrom("<H", data, true, 30)[0];
            var longIP = unpackFrom("<I", data, true, 36)[0];
            resp.IPAddress = pack("<L", longIP).join(".");
        }
        resp.vendorId = unpackFrom("<H", data, true, 48)[0];
        resp.vendor = getVendor(resp.vendorId);
        resp.deviceType = unpackFrom("<H", data, true, 50)[0];
        resp.device = getDevice(resp.deviceType);
        resp.productCode = unpackFrom("<H", data, true, 52)[0];
        var major = unpackFrom("<B", data, true, 54)[0];
        var minor = unpackFrom("<B", data, true, 55)[0];
        resp.revision = major === minor ? String(major) : major + "." + minor;
        resp.status = unpackFrom("<H", data, true, 56)[0];
        resp.serialNumber = unpackFrom("<I", data, true, 58)[0];
        resp.productName = data
            .slice(63, 63 + unpackFrom("<B", data, true, 62)[0])
            .toString();
        resp.state = data.slice(-1)[0];
        return resp;
    }
    catch (_a) {
    }
}
export { unpackFrom, pack };
//# sourceMappingURL=utils.js.map