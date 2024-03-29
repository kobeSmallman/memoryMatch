import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('game.db');

const init = () => {
  db.transaction((tx) => {
   // tx.executeSql('DROP TABLE IF EXISTS scores;');  // I will Remove this line after the database structure is fixed
   // tx.executeSql('DROP TABLE IF EXISTS users;');   // I will Remove this line after the database structure is fixed too these are to clear the tables
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT UNIQUE);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS scores (' +
      'id INTEGER PRIMARY KEY NOT NULL, ' +
      'user_id INTEGER, ' +
      'score INT, ' +
      'difficulty TEXT, ' +
      'FOREIGN KEY(user_id) REFERENCES users(id));'
      
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS custom_cards (id INTEGER PRIMARY KEY NOT NULL, uri TEXT);'
    );
    
  }, (error) => {
    console.error("Database initialization failed: ", error);
  }, () => {
    console.log("Database initialization succeeded");
  });
};
const deleteAllCustomCards = (callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql('DELETE FROM custom_cards;', [], (_, result) => {
        console.log('Custom cards deleted, rows affected:', result.rowsAffected);
        callback(true);
      });
    },
    (error) => {
      console.error("Error deleting custom cards: ", error);
      callback(false);
    }
  );
};

const insertUser = (name, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO users (name) VALUES (?)', 
        [name], 
        (_, result) => callback(result.insertId)
      );
    },
    (error) => console.error("Error inserting user: ", error)
  );
};

const fetchUserByName = (name, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM users WHERE name = ?;',
      [name],
      (_, { rows }) => callback(rows.length > 0 ? rows._array[0] : null),
      (_, error) => console.error("Error fetching user by name: ", error)
    );
  });
};


const insertScore = ({ user_id, score, difficulty }, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO scores (user_id, score, difficulty) VALUES (?, ?, ?);', 
        [user_id, score, difficulty], 
        (_, result) => callback && callback(result.insertId)
      );
    },
    (error) => console.error("Error inserting score: ", error)
  );
};



const fetchScores = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT users.name, scores.score, scores.difficulty FROM scores INNER JOIN users ON users.id = scores.user_id ORDER BY scores.score DESC;',
      [],
      (_, { rows }) => callback(rows._array),
      (error) => console.error("Error fetching scores: ", error)
    );
  });
};



const insertCustomCard = (uri, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql('INSERT INTO custom_cards (uri) VALUES (?);', [uri], (_, result) => {
        callback(result.insertId);
      });
    },
    (error) => {
      console.error("Error inserting custom card: ", error);
    }
  );
};

const fetchCustomCards = (callback) => {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM custom_cards;', [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};

const insertCardImageUri = (uri, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql('INSERT INTO card_images (uri) VALUES (?);', [uri], (_, result) => {
        callback(result.insertId);
      });
    },
    (error) => {
      console.error("Error inserting card image URI: ", error);
    }
  );
};

const fetchCardImageUris = (callback) => {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM card_images;', [], (_, { rows }) => {
      callback(rows._array.map(row => row.uri));
    });
  });
};

const insertSoundUri = (uri, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql('INSERT INTO sound_uris (uri) VALUES (?);', [uri], (_, result) => {
        callback(result.insertId);
      });
    },
    (error) => {
      console.error("Error inserting sound URI: ", error);
    }
  );
};

const fetchSoundUris = (callback) => {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM sound_uris;', [], (_, { rows }) => {
      callback(rows._array.map(row => row.uri));
    });
  });
};

export const database = {
  init,
  insertUser,
  fetchUserByName,
  insertScore,
  fetchScores,
  insertCustomCard,
  fetchCustomCards,
  insertCardImageUri,
  fetchCardImageUris,
  insertSoundUri,
  fetchSoundUris,
  deleteAllCustomCards,
};
