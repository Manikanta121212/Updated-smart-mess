module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3', // SQLite DB file
    },
    useNullAsDefault: true, // Required for SQLite
  },
};