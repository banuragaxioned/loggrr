// split array into smaller chunks.
export const splitIntoChunk = (array: { id: number }[], size: number) => {
  const chunkedData = [];

  let index = 0;
  while (index < array.length) {
    chunkedData.push(array.slice(index, size + index));
    index += size;
  }

  return chunkedData;
}
