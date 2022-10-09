module.exports = {
  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
  generateToken: async () => {
    const rand = () => {
      return Math.random().toString(3).substr();
    };

    return `${rand() + rand()}`;
  }
}