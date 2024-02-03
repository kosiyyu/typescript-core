import bubbleSort from "./bubble-sort";

describe("bubbleSort asc", () => {
  it("test default array", () => {
    const array: Array<number> = [-2, 4, 12, -1, 6, 9, 1, -3, 0, 7, 2, 5, 8, 3, 10, 11];
    const sorted: Array<number> = bubbleSort(array);
    expect(sorted).toEqual([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
});