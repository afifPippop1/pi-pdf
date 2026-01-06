import { openDB, type IDBPDatabase } from "idb";
import { useEffect, useState } from "react";

export function useOpenDb() {
  const [db, setDb] = useState<IDBPDatabase>();

  useEffect(() => {
    (async function () {
      const db = await openDB("pi-pdf", 1, {
        upgrade(db) {
          db.createObjectStore("documents");
        },
      });
      setDb(db);
    })();
  }, []);

  return db;
}
