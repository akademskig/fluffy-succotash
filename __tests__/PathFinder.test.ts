import { PathErrors, PathFinder } from '../src/PathFinder';
import {
  compactSpace,
  mulitpleEntry,
  standard,
  intersection,
  missingEntry,
  broken,
  fork,
  multipleStartingPaths,
  fakeTurn,
  invalidChars,
} from '../src/testPaths';

describe('test if pathfinder works', () => {
  test('correct output', () => {
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
    const { letters, pathCharacters } = new PathFinder(standard).init();
    expect(letters).toMatchObject(lettersResult);
    expect(pathCharacters).toMatchObject(pathResult);
  });
  test('correct output with intersection', () => {
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
    const { letters, pathCharacters } = new PathFinder(intersection).init();
    expect(letters).toMatchObject(expectedLetters);
    expect(pathCharacters).toMatchObject(expectedPathCharacters);
  });
  test('if handles compact space correctly', () => {
    const { letters, pathCharacters } = new PathFinder(compactSpace).init();
    const expectedLetters = ['B', 'C', 'D', 'A'];
    const expectedPathCharacters = ['@', '-', 'B', '-', 'C', 'D', 'A', '-', 'x'];
    expect(letters).toMatchObject(expectedLetters);
    expect(pathCharacters).toMatchObject(expectedPathCharacters);
  });

  test('if handles multiple entry points correctly', () => {
    expect(() => new PathFinder(mulitpleEntry).init()).toThrowError(Error(PathErrors.MULTIPLE_ENTRY_POINTS_FOUND));
  });
  test('if handles missing entry point correctly', () => {
    expect(() => new PathFinder(missingEntry).init()).toThrowError(Error(PathErrors.NO_ENTRY_POINT_FOUND));
  });
  test('if handles broken path correctly', () => {
    expect(() => new PathFinder(broken).init()).toThrowError(Error(PathErrors.INVALID_PATH));
  });
  test('if handles fork in path correctly', () => {
    expect(() => new PathFinder(fork).init()).toThrowError(Error(PathErrors.INVALID_PATH));
  });
  test('if handles multiple starting paths correctly', () => {
    expect(() => new PathFinder(multipleStartingPaths).init()).toThrowError(Error(PathErrors.INVALID_PATH));
  });
  test('if handles fake turn correctly', () => {
    expect(() => new PathFinder(fakeTurn).init()).toThrowError(Error(PathErrors.FAKE_TURN));
  });
  test('if handles invalid chars correctly', () => {
    expect(() => new PathFinder(invalidChars).init()).toThrowError(Error(PathErrors.INVALID_CHAR));
  });
});
