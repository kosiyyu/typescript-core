function ensureLength(arg: bigint, bitLength: bigint): bigint {
  return arg & ((1n << bitLength) - 1n);
}

function generate(datacenterId: bigint, machineId: bigint, sequence: bigint): bigint {
  return (ensureLength(BigInt(Date.now()), 41n) << 22n) |
    (ensureLength(datacenterId, 5n) << 17n) |
    (ensureLength(machineId, 5n) << 12n) |
    ensureLength(sequence, 12n);
}

const snowflakeId = generate(1n, 1n, 1n);

console.log(snowflakeId.toString(16));
console.log(snowflakeId.toString(10));
console.log(snowflakeId.toString(2));