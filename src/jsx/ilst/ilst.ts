import {
  helloVoid,
  helloError,
  helloStr,
  helloNum,
  helloArrayStr,
  helloObj,
} from "../utils/samples";
export { helloError, helloStr, helloNum, helloArrayStr, helloObj, helloVoid };
import { dispatchTS } from "../utils/utils";

// Page Numbering
import { getArtboardCount, getArtboards, insertPageNumbers } from "./pageNumbering";
export { getArtboardCount, getArtboards, insertPageNumbers };

export const helloWorld = () => {
  alert("Hello from Illustrator");
};
