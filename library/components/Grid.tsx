import React from "react";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/ui/grid-pattern";

function Grid() {
  return (
    <>
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_left,white,transparent)]",
          "inset-x-0 inset-y-[-20%] h-[200%] skew-y-12"
        )}
      />
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_right,white,transparent)]",
          "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12"
        )}
      />
    </>
  );
}

export default Grid;
