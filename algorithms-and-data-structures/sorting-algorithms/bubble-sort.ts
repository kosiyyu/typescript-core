const arr: Array<number> = [-2, 4, 12, -1, 6, 9, 1, -3, 0, 7, 2, 5, 8, 3, 10, 11];
let sortedArr: Array<number> | undefined = undefined;

console.log(arr);

function bubbleSort(arr: Array<number>): Array<number> {
    const n: number = arr.length;

    for(let i: number = 0; i < n - 1; i++) {
        for(let j: number = 0; j < n - i - 1; j++) {
            if(arr[j] > arr[j + 1]){
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}
console.log(bubbleSort(arr));