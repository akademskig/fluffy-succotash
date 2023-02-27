import { Direction, PathErrors, PathFinder } from '../src/PathFinder';
import { basic, goonies, invalidChars } from '../src/testPaths';

describe('pathfinder unit tests', () => {
  test('findStart', () => {
    const startBasic = new PathFinder(basic).findStart();
    const startGoonies = new PathFinder(goonies).findStart();
    expect(startBasic).toMatchObject({ x: 0, y: 0 });
    expect(startGoonies).toMatchObject({ x: 0, y: 3 });
  });
  test('checkDirection', () => {
    const directionBasic = new PathFinder(basic).checkDirection({ x: 0, y: 0 });
    const directionGoonies = new PathFinder(goonies).checkDirection({ x: 8, y: 4, dir: Direction.left });
    expect(directionBasic).toMatch('right');
    expect(directionGoonies).toMatch('up');
  });
  test('isValidChar', () => {
    const pathfinder = new PathFinder(invalidChars);
    const valid = pathfinder.isValidChar({ x: 2, y: 0 });
    const invalid = pathfinder.isValidChar({ x: 4, y: 2 });
    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });
  test('getNextPosition', () => {
    const positionBasic = new PathFinder(basic).getNextPosition({ x: 0, y: 0 });
    const positionGoonies = new PathFinder(goonies).getNextPosition({ x: 8, y: 4, dir: Direction.left });
    expect(positionBasic).toMatchObject({ x: 1, y: 0, dir: 'right' });
    expect(positionGoonies).toMatchObject({ x: 8, y: 3, dir: 'up' });
  });
});
