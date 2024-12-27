/* eslint-disable @typescript-eslint/no-explicit-any */

export const getCharacterMapping = (value: number, slice: number) => {
  const rowCount = Math.ceil((value + 1) / slice);
  const colCount = (value + 1) % slice;

  return slice * Math.floor(rowCount / 2) + colCount - 1;
};

export const getSpritesheetParams = (
  sliceX: number,
  sliceY: number,
  animations: any[],
  globalParams: any
) => {
  const anims = animations.reduce(
    (prev, { name, values: [from, to], params }) => {
      prev[name] = { from, to, ...globalParams, ...params };
      return prev;
    },
    {}
  );

  return {
    sliceX,
    sliceY,
    anims,
  };
};

export const getSpriteParamsWithOffset = (
  sliceX: number,
  sliceY: number,
  animations: any[],
  globalParams: any
) => {
  const anims = animations.reduce((prev, { name, values, params }) => {
    prev[name] = {
      from: getCharacterMapping(values[0], sliceX),
      to: getCharacterMapping(values[1], sliceX),
      ...globalParams,
      ...params,
    };
    return prev;
  }, {});

  return {
    sliceX,
    sliceY,
    anims,
  };
};
