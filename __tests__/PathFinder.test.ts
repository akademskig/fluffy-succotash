import { PathErrors, PathFinder } from '../src/PathFinder';

describe('test if pathfinder works', () => {
  test('correct output', () => {
    const pathArr = [
      ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+'],
    ];

    const lettersResult = ['A', 'C', 'B'];
    const pathResult = [
      '@',
      '-',
      '-',
      '-',
      'A',
      '-',
      '-',
      '-',
      '+',
      '|',
      'C',
      '|',
      '+',
      '-',
      '-',
      '-',
      '+',
      '|',
      '+',
      '-',
      'B',
      '-',
      'x',
    ];
    const { letters, pathCharacters } = new PathFinder(pathArr).init();
    expect(letters).toMatchObject(lettersResult);
    expect(pathCharacters).toMatchObject(pathResult);
  });
  test('correct output with intersection', () => {
    const pathArr = [
      ['@'],
      ['|', ' ', '+', '-', 'C', '-', '-', '+', ' ', ' '],
      ['A', ' ', '|', ' ', ' ', ' ', ' ', '|', '', ' '],
      ['+', '-', '-', '-', 'B', '-', '-', '+', ' ', ' '],
      [' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', 'x'],
      [' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', '+', '-', '-', '-', 'D', '-', '-', '+'],
    ];
    const expectedLetters = ['A', 'B', 'C', 'D'];
    const expectedPathCharacters = [
      '@',
      '|',
      'A',
      '+',
      '-',
      '-',
      '-',
      'B',
      '-',
      '-',
      '+',
      '|',
      '+',
      '-',
      '-',
      'C',
      '-',
      '+',
      '|',
      '|',
      '|',
      '+',
      '-',
      '-',
      '-',
      'D',
      '-',
      '-',
      '+',
      '|',
      'x',
    ];
    const { letters, pathCharacters } = new PathFinder(pathArr).init();
    expect(letters).toMatchObject(expectedLetters);
    expect(pathCharacters).toMatchObject(expectedPathCharacters);
  });
  test('if handles compact space correctly', () => {
    const pathArr = [['@', '-', 'B', '-', 'C', 'D', 'A', '-', 'x']];
    const { letters, pathCharacters } = new PathFinder(pathArr).init();
    const expectedLetters = ['B', 'C', 'D', 'A'];
    const expectedPathCharacters = ['@', '-', 'B', '-', 'C', 'D', 'A', '-', 'x'];
    expect(letters).toMatchObject(expectedLetters);
    expect(pathCharacters).toMatchObject(expectedPathCharacters);
  });

  test('if handles multiple entry points correctly', () => {
    const arr = [
      ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', '@', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+'],
    ];
    expect(() => new PathFinder(arr).init()).toThrowError(Error(PathErrors.MULTIPLE_ENTRY_POINTS_FOUND));
  });
  test('if handles missing entry point correctly', () => {
    const arr = [
      ['-', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+'],
    ];
    expect(() => new PathFinder(arr).init()).toThrowError(Error(PathErrors.NO_ENTRY_POINT_FOUND));
  });
  test('if handles broken path correctly', () => {
    const arr = [
      ['@', '-', '-', 'A', '-', ' ', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+'],
    ];
    expect(() => new PathFinder(arr).init()).toThrowError(Error(PathErrors.INVALID_PATH));
  });
  test('if handles fork in path correctly', () => {
    const pathArr = [
      ['@', '-', '-', '-', 'A', '-', '+', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', 'x', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+'],
    ];

    expect(() => new PathFinder(pathArr).init()).toThrowError(Error(PathErrors.INVALID_PATH));
  });
  test('if handles multiple starting paths correctly', () => {
    const pathArr = [['x', '-', 'B', '-', '@', '-', 'A', '-', 'x']];
    expect(() => new PathFinder(pathArr).init()).toThrowError(Error(PathErrors.INVALID_PATH));
  });
  test('if handles fake turn correctly', () => {
    const pathArr = [['@', '-', 'B', '+', 'C', 'D', 'A', '-', 'x']];
    expect(() => new PathFinder(pathArr).init()).toThrowError(Error(PathErrors.FAKE_TURN));
  });
  test('if handles invalid chars correctly', () => {
    const pathArr = [
      ['@', '-', 'B', '-', 'C', 'D'],
      ['x', '-', '-', '+', ' ', 'D', 'C', '-', '+'],
      [' ', ' ', ' ', '+', 'ć', '-', '-', '-', '+'],
    ];
    expect(() => new PathFinder(pathArr).init()).toThrowError(Error(PathErrors.INVALID_CHAR));
  });
});
