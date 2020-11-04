const UNIT_WEI = 'wei';
const WEI_MULTIPLIER = 1;
const UNIT_GWEI = 'gwei';
const GWEI_MULTIPLIER = 1000000000;
const UNIT_ETHER = 'ether';
const ETH_MULTIPLIER = 1000000000000000000;

export function toWei(value, unit) {
    switch (unit) {
        case UNIT_WEI:
            return value * WEI_MULTIPLIER;
        case UNIT_GWEI:
            return value * GWEI_MULTIPLIER;
        case UNIT_ETHER:
            return value * ETH_MULTIPLIER;
    }
}