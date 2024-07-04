const MAX_SEQUENCE = (1n << 12n) - 1n;

function ensureLength(arg: bigint, bitLength: bigint): bigint {
  return arg & ((1n << bitLength) - 1n);
}

class Generator {
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
    if(this.sequence === MAX_SEQUENCE) {
      while(this.timestamp === this.oldTimestamp) {
        this.timestamp = BigInt(Date.now());
      }
      this.oldTimestamp = this.timestamp;
      this.sequence = 0n;
    }

    this.sequence = (this.sequence + 1n) & MAX_SEQUENCE;

    return (ensureLength(this.timestamp, 41n) << 22n) |
    (ensureLength(this.datacenterId, 5n) << 17n) |
    (ensureLength(this.machineId, 5n) << 12n) |
    ensureLength(this.sequence, 12n);
  }
}

function testUniqnes(timeoutInMs: number): boolean {
  const start = Date.now();
  const prev = -1n;
  const generator = new Generator(1n, 1n);

  while(true) {
    if(prev === generator.next()) {
      return false;
    }
    if(Date.now() - start >= timeoutInMs) {
      break;
    }
  }
  return true;
}

const testResult = testUniqnes(1000);
console.log(testResult);