import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('game.db');

const init = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT UNIQUE);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY NOT NULL, user_id INTEGER, score INT, FOREIGN KEY(user_id) REFERENCES users(id));'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS custom_cards (id INTEGER PRIMARY KEY NOT NULL, user_id INTEGER, uri TEXT, FOREIGN KEY(user_id) REFERENCES users(id));'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS card_images (id INTEGER PRIMARY KEY NOT NULL, uri TEXT);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS sound_uris (id INTEGER PRIMARY KEY NOT NULL, uri TEXT);'
    );
  }, (error) => {
    console.error("Database initialization failed: ", error);
  }, () => {
    console.log("Database initialization succeeded");
  });
};
const insertUser = (name, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO users (name) VALUES (?) ON CONFLICT(name) DO NOTHING;', 
        [name], 
        (_, result) => {
          if (callback) {
            callback(result.insertId);
          }
        }
      );
    },
    (error) => {
      console.error("Error inserting user: ", error);
    }
  );
};
const fetchUserByName = (name, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM users WHERE name = ?;', 
      [name], 
      (_, { rows }) => {
        callback(rows._array[0]);  
      }
    );
  });
};


const insertScore = (score, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql('INSERT INTO scores (score) VALUES (?);', [score], (_, result) => {
        if (callback) {
          callback(result.insertId);
        }
      });
    },
    (error) => {
      console.error("Error inserting score: ", error);
    }
  );
};

const fetchScores = (callback) => {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM scores;', [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};

const insertCustomCard = (uri, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql('INSERT INTO custom_cards (uri) VALUES (?);', [uri], (_, result) => {
        if (callback) {
          callback(result.insertId);
        }
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

// New methods for inserting and retrieving default card image URIs
const insertCardImageUri = (uri, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql('INSERT INTO card_images (uri) VALUES (?);', [uri], (_, result) => {
        if (callback) {
          callback(result.insertId);
        }
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
          if (callback) {
            callback(result.insertId);
          }
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
    insertScore,
    fetchScores,
    insertCustomCard,
    fetchCustomCards,
    insertCardImageUri,
    fetchCardImageUris,
    insertSoundUri,
    fetchSoundUris,
  };