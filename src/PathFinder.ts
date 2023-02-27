export enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

export enum PathErrors {
  INVALID_PATH = 'INVALID_PATH',
  INVALID_CHAR = 'INVALID_CHAR',
  NO_ENTRY_POINT_FOUND = 'NO_ENTRY_POINT_FOUND',
  NO_END_FOUND = 'NO_END_FOUND',
  MULTIPLE_ENTRY_POINTS_FOUND = 'MULTIPLE_ENTRY_POINTS_FOUND',
  FAKE_TURN = 'FAKE_TURN',
  FORK_IN_PATH = 'FORK_IN_PATH',
  MULTIPLE_STARTING_PATHS = 'MULTIPLE_STARTING_PATHS',
}

type Position = {
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

const VALID_CHARS_REGEX = RegExp(/[A-Z@x+\-\| ]/);
const TURNS_REGEX = RegExp(/[A-Z@+]/);
const VALID_HORIZONTAL = RegExp(/[-+A-Z@x]/);
const VALID_VERTICAL = RegExp(/[|+A-Z@x]/);

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

  checkDirection = ({ x, y, dir }: Position): Direction => {
    const directions: Direction[] = [];
    if ((this.arrPath[y]?.[x + 1] || '').match(VALID_HORIZONTAL)) {
      directions.push(Direction.right);
    }
    if ((this.arrPath[y]?.[x - 1] || '').match(VALID_HORIZONTAL)) {
      directions.push(Direction.left);
    }
    if ((this.arrPath[y + 1]?.[x] || '').match(VALID_VERTICAL)) {
      directions.push(Direction.down);
    }
    if ((this.arrPath[y - 1]?.[x] || '').match(VALID_VERTICAL)) {
      directions.push(Direction.up);
    }
    const validDirections = dir ? directions.filter((d) => d !== OPOSITES[dir]) : directions; // dont go back
    if (validDirections.length > 1 && !dir) {
      throw Error(PathErrors.MULTIPLE_STARTING_PATHS);
    }
    if (validDirections.length === 1 && this.arrPath[y]?.[x].match(/\+/) && validDirections[0] === dir)
      throw Error(PathErrors.FAKE_TURN);
    if (validDirections.length === 2) {
      throw Error(PathErrors.FORK_IN_PATH);
    }
    const sameDirection = dir && validDirections.find((validDirection) => validDirection === dir);
    return sameDirection || validDirections[0];
  };

  collectChar = ({ x, y }: Position) => {
    if (this.arrPath[y][x].match(/[A-Z]/) && !this.collectedIndexes[`${x}-${y}`]) {
      this.letters.push(this.arrPath[y][x]);
    }
    this.pathCharacters.push(this.arrPath[y][x]);
    this.collectedIndexes[`${x}-${y}`] = 1;
  };

  isValidChar = ({ x, y }: Position) => {
    return this.arrPath[y]?.[x] && !!this.arrPath[y][x].match(VALID_CHARS_REGEX);
  };

  getNextPosition = ({ x, y, dir }: Position): Position => {
    if (this.arrPath[y][x].match(TURNS_REGEX)) {
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

  traverse = ({ x, y, dir }: Position): Boolean => {
    if (!this.isValidChar({ x, y })) {
      throw Error(PathErrors.INVALID_CHAR);
    }
    this.collectChar({ x, y });
    const char = this.arrPath[y][x];
    if (char === 'x') {
      return true;
    } else {
      const nextIndex = this.getNextPosition({ x, y, dir });
      return this.traverse(nextIndex);
    }
  };

  init = () => {
    const start = this.findStart(); // start position
    const { x, y } = start;
    const end = this.traverse({ x, y });
    if (end) {
      return { letters: this.letters, pathCharacters: this.pathCharacters };
    } else {
      throw Error(PathErrors.NO_END_FOUND);
    }
  };
}
