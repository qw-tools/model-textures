export const CHARACTERS_PER_COLUMN = 16;
export const CHARACTERS_PER_ROW = 16;
export const CHARACTER_COUNT = CHARACTERS_PER_COLUMN * CHARACTERS_PER_ROW;
export const ROWS_PER_THEME = 8;

export enum Type {
  ASCII = "ascii",
  GRAPHIC = "graphic",
}

export enum Theme {
  WHITE = "white",
  BROWN = "brown",
  GOLD = "gold",
  GREEN = "green",
}

export interface Index {
  number: number;
  column: number;
  row: number;
}

export class Character {
  index: Index;
  type: Type;
  value: string;
  theme: Theme;

  constructor(index: Index, type: Type, value: string, theme: Theme) {
    this.index = index;
    this.type = type;
    this.value = value;
    this.theme = theme;
  }
}

const ascii =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ";

function getCharByIndex(index: Index): Character {
  const themeRowIndex = index.row % ROWS_PER_THEME;
  const theme = index.row < ROWS_PER_THEME ? Theme.WHITE : Theme.BROWN;

  if (0 === themeRowIndex) {
    return new Character(index, Type.GRAPHIC, "", theme);
  } else if (1 === themeRowIndex) {
    if (index.column > 1 && index.column < 12) {
      return new Character(
        index,
        Type.ASCII,
        (index.column - 2).toString(),
        Theme.GREEN
      );
    } else {
      return new Character(index, Type.ASCII, "", theme);
    }
  } else {
    const asciiRowOffset = 2;
    const asciiIndex =
      (themeRowIndex - asciiRowOffset) * CHARACTERS_PER_ROW + index.column;
    return new Character(index, Type.ASCII, ascii[asciiIndex], theme);
  }
}

export const characters: Character[] = [
  ...new Array(CHARACTER_COUNT).keys(),
].map((n) =>
  getCharByIndex({
    number: n,
    column: n % CHARACTERS_PER_COLUMN,
    row: Math.floor(n / CHARACTERS_PER_ROW),
  })
);
