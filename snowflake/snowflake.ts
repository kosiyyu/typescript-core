let timestamp = BigInt(Date.now());
let sequence = 1n;
let datacenterId = 1n;
let machineId = 1n;

function getBinaryLength(arg: bigint): number {
  return (arg).toString(2).length;
}

function moveLength(arg: bigint, bitLength: number): bigint {
 return BigInt(bitLength - getBinaryLength(arg));
}

// Ensure upper limit
timestamp &= 0x1FFFFFFFFFFn; // <= 41 bits
sequence &= 0xFFFn;          // <=  12 bits
datacenterId &= 0x1Fn;       // <= 5 bits
machineId &= 0x1Fn;          // <= 5 bits

let snowflakeId = (timestamp << 22n);

sequence = sequence << moveLength(sequence, 22);
snowflakeId = snowflakeId | sequence;

datacenterId = datacenterId << moveLength(datacenterId, 10);
snowflakeId = snowflakeId | datacenterId;

machineId = machineId << moveLength(machineId, 5);
snowflakeId = snowflakeId | machineId;

snowflakeId = snowflakeId << 1n;

console.log((snowflakeId).toString(2));
console.log((snowflakeId).toString());
