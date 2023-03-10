import { PathFinder } from './PathFinder';
import * as paths from './testPaths';

const arg = process.argv[2];

const init = () => {
  const selectedPath: Record<string, string[][]> = paths;
  if (!selectedPath[arg]) {
    console.error('Select one of the following paths: ', Object.keys(paths).slice(1));
  } else {
    const path = selectedPath[arg];
    const { pathCharacters, letters } = new PathFinder(path).init();
    console.log(`Path caracters: ${pathCharacters}`);
    console.log(`Letters: ${letters}`);
  }
};
init();
