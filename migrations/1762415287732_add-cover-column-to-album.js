export const up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'TEXT',
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn('albums', 'cover');
};