import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { IdGenerator, MAX_SEQUENCE } from "./snowflake.ts";

Deno.test(`${IdGenerator.name} - should handle sequence overflow`, () => {
  const generator = new IdGenerator(1n, 1n);

  for (let i = 0; i <= Number(MAX_SEQUENCE); i++) {
    generator.next();
  }

  const id1 = generator.next();
  const id2 = generator.next();

  assert(id1 !== id2, "IDs should be different after sequence overflow");
});

Deno.test(`${IdGenerator.name} - should use correct bit lengths`, () => {
  const generator = new IdGenerator(1n, 1n);
  const id = generator.next();

  // Check timestamp (41 bits)
  assert(id >> 22n < 1n << 41n, "Timestamp should be less than 2^41");

  // Check datacenter ID (5 bits)
  assertEquals((id >> 17n) & 0b11111n, 1n, "Datacenter ID should be 1");

  // Check machine ID (5 bits)
  assertEquals((id >> 12n) & 0b11111n, 1n, "Machine ID should be 1");

  // Check sequence (12 bits)
  assert((id & 0b111111111111n) < 1n << 12n, "Sequence should be less than 2^12");
});

Deno.test(`${IdGenerator.name} - should generate monotonically increasing IDs`, () => {
  const generator = new IdGenerator(1n, 1n);
  const id1 = generator.next();
  const id2 = generator.next();
  assert(id2 > id1, "Second ID should be greater than the first");
});

Deno.test(`${IdGenerator.name} - should generate unique IDs (note - it can take a few seconds)`, () => {
  const generator = new IdGenerator(1n, 1n);
  const ids = new Set<bigint>();
  const numIds = MAX_SEQUENCE ** 2n;

  for (let i = 0n; i < numIds; i++) {
    const id = generator.next();
    if (!ids.has(id)) ids.add(id);
  }

  assertEquals(BigInt(ids.size), numIds, `Should have generated ${numIds} unique IDs`);
});