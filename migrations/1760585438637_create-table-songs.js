/* eslint-disable camelcase */
export const up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
    },
    album_id: {
      type: 'VARCHAR(50)'
    },
  });

  pgm.addConstraint(
    'songs',
    'fk_songs.album_id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
  );
};

export const down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id');
  pgm.dropTable('songs');
};
