let timestamp = BigInt(Date.now());
let sequence = 223n;
let datacenterId = 23n;
let machineId = 45n;

function ensureLength(arg: bigint, bitLength: bigint): bigint {
  return arg & ((1n << bitLength) - 1n);
}

timestamp = ensureLength(timestamp, 41n);
datacenterId = ensureLength(datacenterId, 5n);
machineId = ensureLength(machineId, 5n);
sequence = ensureLength(sequence, 12n);

const snowflakeId = (timestamp << 22n) | (datacenterId << 17n) | (machineId << 12n) | sequence;

console.log(snowflakeId.toString(16));
console.log(snowflakeId.toString(10));
console.log(snowflakeId.toString(2));