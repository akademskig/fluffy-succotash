enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

export enum PathErrors {
  INVALID_PATH = 'INVALID_PATH',
  NO_ENTRY_POINT_FOUND = 'NO_ENTRY_POINT_FOUND',
  NO_END_FOUND = 'NO_END_FOUND',
  MULTIPLE_ENTRY_POINTS_FOUND = 'MULTIPLE_ENTRY_POINTS_FOUND',
  FAKE_TURN = 'FAKE_TURN',
}

type Coords = {
  x: number;
  y: number;
  dir?: Direction;
};

const OPOSITES = {
  [Direction.up]: Direction.down,
  [Direction.down]: Direction.up,
  [Direction.right]: Direction.left,
  [Direction.left]: Direction.right,
};
export class PathFinder {
  letters: string[] = [];
  pathCharacters: string[] = [];
  collectedIndexes: Record<string, number> = {};
  arrPath;

  constructor(arrPath: string[][]) {
    this.arrPath = arrPath;
  }

  findStart = () => {
    const starts = [];
    for (let row = 0; row <= this.arrPath.length - 1; row++) {
      for (let char = 0; char <= this.arrPath[row].length - 1; char++) {
        if (this.arrPath[row][char] === '@') {
          starts.push({ y: row, x: char });
        }
      }
    }
    if (starts.length > 1) {
      throw Error(PathErrors.MULTIPLE_ENTRY_POINTS_FOUND);
    } else if (starts.length === 0) {
      throw Error(PathErrors.NO_ENTRY_POINT_FOUND);
    }
    return starts[0];
  };

  checkDirection = ({ x, y, dir }: Coords): Direction => {
    const directions: Direction[] = [];
    if ((this.arrPath[y]?.[x + 1] || '').match(/[-+A-Z]/)) {
      directions.push(Direction.right);
    }
    if ((this.arrPath[y]?.[x - 1] || '').match(/[-+A-Z]/)) {
      directions.push(Direction.left);
    }
    if ((this.arrPath[y + 1]?.[x] || '').match(/[|+A-Z]/)) {
      directions.push(Direction.down);
    }
    if ((this.arrPath[y - 1]?.[x] || '').match(/[|+A-Z]/)) {
      directions.push(Direction.up);
    }
    const validDirections = dir ? directions.filter((d) => d !== OPOSITES[dir]) : directions;
    if (validDirections.length !== 1) throw Error(PathErrors.INVALID_PATH);
    if (this.arrPath[y]?.[x].match(/\+/) && validDirections[0] === dir) throw Error(PathErrors.FAKE_TURN);
    return validDirections[0];
  };

  collectChar = ({ x, y }: Coords) => {
    if (this.collectedIndexes[`${x}-${y}`]) return;
    if (this.arrPath[y][x].match(/[A-Z]/)) {
      this.letters.push(this.arrPath[y][x]);
    }
    this.pathCharacters.push(this.arrPath[y][x]);
    this.collectedIndexes[`${x}-${y}`] = 1;
  };

  getNextIndex = ({ x, y, dir }: Coords): Coords => {
    if (this.arrPath[y][x].match(/[A-Z@+]/)) {
      dir = this.checkDirection({ x, y, dir });
    }
    switch (dir) {
      case Direction.left:
        return { x: x - 1, y, dir };
      case Direction.right:
        return { x: x + 1, y, dir };
      case Direction.down:
        return { x, y: y + 1, dir };
      case Direction.up:
        return { x, y: y - 1, dir };
    }

    throw Error(PathErrors.INVALID_PATH);
  };

  traverse = ({ x, y, dir }: Coords): Boolean => {
    this.collectChar({ x, y });
    const char = this.arrPath[y][x];
    if (char === 'x') {
      return true;
    } else {
      const nextIndex = this.getNextIndex({ x, y, dir });
      return this.traverse(nextIndex);
    }
  };

  init = () => {
    const start = this.findStart(); // start coord
    const { x, y } = start;
    const end = this.traverse({ x, y });
    if (end) {
      return { letters: this.letters, pathCharacters: this.pathCharacters };
    } else {
      throw Error(PathErrors.NO_END_FOUND);
    }
  };
}
