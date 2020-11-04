const HEX_PREFIX = "0x";

export function hexStringWithPrefix(str) {
    if (!str.startsWith(HEX_PREFIX)) {
        str = HEX_PREFIX.concat(str);
    }
    return str;
}
