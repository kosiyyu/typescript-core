import { pi } from 'npm:mathjs';

type Pair = {
  arg1: string | number;
  arg2: string | number;
}

type Output = {
  solution: string | number;
  stepByStep: Map<number, Pair>;
}

export class Solver {
  private static circleArea(radius: number): number {
    if (radius < 0) {
      throw new Error("Radius cannot be less than 0.");
    }
    return pi * radius ** 2;
  }

  public outputCircleArea(radius: number): Output {
    const area = Solver.circleArea(radius);
    const steps = new Map<number, Pair>();
    steps.set(
      1,
      {
        arg1: "Calculate the area as π multiplied by the square of the radius.",
        arg2: area
      }
    );

    const result: Output = {
      solution: area,
      stepByStep: steps
    };
    return result;
  }
}