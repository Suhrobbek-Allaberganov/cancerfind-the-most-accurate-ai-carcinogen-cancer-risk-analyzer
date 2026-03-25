
import { iarcGroup1, iarcGroup2A, iarcGroup2B, iarcGroup3 } from '../src/lib/iarc-data';

const allCarcinogens = [
  ...iarcGroup1,
  ...iarcGroup2A,
  ...iarcGroup2B,
  ...iarcGroup3
];

console.log(JSON.stringify(allCarcinogens, null, 2));
