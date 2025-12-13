const sqlite3 = require('sqlite3').verbose();
const dbFile = './data.db';
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  // Drop if exists (safe to re-run)
  db.run(`DROP TABLE IF EXISTS inventory`);

  // New schema (different fields)
  db.run(`
    CREATE TABLE inventory (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      location TEXT NOT NULL,
      received_on TEXT NOT NULL,
      supplier_email TEXT
    )
  `);

  // Insert sample data (clearly different sample data)
  const stmt = db.prepare(`
    INSERT INTO inventory (item_name, category, quantity, location, received_on, supplier_email)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run("XR-Headset Pro", "VR Hardware", 12, "Warehouse-A", "2025-11-20", "sales@xrtech.example");
  stmt.run("HoloGlove Mk2", "Accessories", 30, "Warehouse-B", "2025-10-01", "supplier@hologloves.example");
  stmt.run("Metaverse Server Lic.", "Software", 5, "Cloud", "2025-12-01", "licenses@metaserv.example");
  stmt.run("Avatar Skins Pack", "Digital Asset", 150, "Digital Vault", "2025-12-05", "market@avatars.example");
  stmt.run("Spatial Mic", "Audio Hardware", 20, "Warehouse-A", "2025-09-14", "audio@supplier.example");

  stmt.finalize(err => {
    if (err) console.error("Insert error:", err);
    else console.log("DB initialized and seeded (data.db).");
    db.close();
  });
});
