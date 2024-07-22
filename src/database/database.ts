const sqlite3 = window.require("sqlite3").verbose();
const fs = window.require("fs");
const databasePath = "src/database/database.db";

async function execute(sql: string, params: any, callName: string) {
  if (!fs.existsSync(databasePath)) await createDatabase();

  const db = new sqlite3.Database(
    databasePath,
    sqlite3.OPEN_READWRITE,
    (err: any) => {
      if (err) return console.error(err.message);
    }
  );

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("PRAGMA foreign_keys = ON", [], (err: any) => {
        if (err) console.log(err);
      });
      db[callName](sql, params, (err: any, rows: any) => {
        if (err) return console.error(err.message);
        db.close((err: any) => {
          if (err) return console.error(err.message);
        });

        if (err) {
          reject(err);
        } else {
          rows ? resolve(rows) : resolve(true);
        }
      });
    });
  });
}

export async function createHabit(name: string, color: string) {
  const todaysDate = new Date().toLocaleDateString();
  const sql = `INSERT INTO habits (habit_id, name, color, date_created) VALUES(?,?,?,?)`;
  const params: any[] = [, name, color, todaysDate];
  await execute(sql, params, "run");
}

export async function getHabits() {
  const sql = `SELECT * FROM habits`;
  return await execute(sql, [], "all");
}

export async function deleteHabit(habitId: number) {
  const sqlOne = `DELETE FROM heatmap_data WHERE habit_id=${habitId}`;
  await execute(sqlOne, [], "run");
  const sql = `DELETE FROM habits WHERE habit_id=${habitId}`;
  await execute(sql, [], "run");
}

export async function getHeatmapData() {
  const sql = `SELECT * FROM heatmap_data`;
  return await execute(sql, [], "all");
}

export async function logHabit(habitId: number, count: number) {
  const todaysDate = new Date().toLocaleDateString();
  const sql = `INSERT INTO heatmap_data (heatmap_data_id, habit_id, date, count) VALUES (?,?,?,?)`;
  const params: any[] = [, habitId, todaysDate, count];
  await execute(sql, params, "run");
}

async function createDatabase() {
  await fs.writeFile(databasePath, "", function (err: any) {
    if (err) throw err;
  });

  await execute(
    `CREATE TABLE IF NOT EXISTS habits (
            habit_id INTEGER PRIMARY KEY, 
            name TEXT, 
            color TEXT, 
            date_created TEXT
        )`,
    [],
    "run"
  );

  await execute(
    `CREATE TABLE IF NOT EXISTS heatmap_data (
            heatmap_data_id INTEGER PRIMARY KEY, 
            habit_id INTEGER, 
            date TEXT, 
            count INTEGER, 
            FOREIGN KEY (habit_id) REFERENCES habits(habit_id)
        )`,
    [],
    "run"
  );
}
