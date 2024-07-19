export const MAX_SEQUENCE = (1n << 12n) - 1n;

function ensureLength(arg: bigint, bitLength: bigint): bigint {
  return arg & ((1n << bitLength) - 1n);
}

export class IdGenerator {
  private timestamp: bigint;
  private oldTimestamp: bigint;
  private sequence: bigint;
  private datacenterId: bigint;
  private machineId: bigint;

  constructor(datacenterId: bigint, machineId: bigint) {
    this.timestamp = BigInt(Date.now());
    this.oldTimestamp = -1n;
    this.sequence = 0n;
    this.datacenterId = datacenterId;
    this.machineId = machineId;
  }

  public next(): bigint {
    this.oldTimestamp = this.timestamp;
    if (this.sequence === MAX_SEQUENCE) {
      this.sequence = 0n;
      while (this.timestamp === this.oldTimestamp) {
        this.timestamp = BigInt(Date.now());
      }
    } else this.sequence = (this.sequence + 1n) & MAX_SEQUENCE;

    return (ensureLength(this.timestamp, 41n) << 22n) |
      (ensureLength(this.datacenterId, 5n) << 17n) |
      (ensureLength(this.machineId, 5n) << 12n) |
      ensureLength(this.sequence, 12n);
  }

  public nextInHex(): string {
    return this.next().toString(16);
  }
}