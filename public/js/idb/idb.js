let dbPromised = idb.open("soccer", 1, (upgradeDB) => {
  let footBallObjectStore = upgradeDB.createObjectStore("details-team", {
    keyPath: "id",
  });
  footBallObjectStore.createIndex("namaTeam", "name", { unique: false });
});

const saveForLater = (item) => {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("details-team", "readwrite");
      let store = tx.objectStore("details-team");
      store.put(item);
      return tx.complete;
    })
    .then(() => {
      M.toast({ html: "Berhasil Ditambahkan ke Favorit." });
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("Score Football Website", {
            body: `Anda menambahkan tim ${item.name} ke favorit.`,
            icon: "../../assets/images/score-512x512.png",
          });
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const getAll = () => {
  return new Promise((resolve) => {
    dbPromised
      .then((db) => {
        let tx = db.transaction("details-team", "readonly");
        let store = tx.objectStore("details-team");

        return store.getAll();
      })
      .then((teams) => {
        document.querySelector("#linear-progress").style.display = "block";
        resolve(teams);
      });
  });
};

const getDataByID = (id) => {
  return new Promise((resolve) => {
    dbPromised
      .then((db) => {
        let tx = db.transaction("details-team", "readonly");
        let store = tx.objectStore("details-team");

        return store.get(id);
      })
      .then((teams) => {
        resolve(teams);
      });
  });
};

const deleteById = (id, name) => {
  return new Promise(() => {
    dbPromised
      .then((db) => {
        var tx = db.transaction("details-team", "readwrite");
        var store = tx.objectStore("details-team");
        store.delete(id);
        return tx.complete;
      })
      .then(() => {
        M.toast({ html: "Delete Sukses" });
        if (Notification.permission === "granted") {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification("Score Football Website", {
              body: `Berhasil menghapus tim ${name} dari favorit.`,
              icon: "../../assets/images/score-512x512.png",
            });
          });
        }
      });
  });
};

export { saveForLater, getAll, deleteById, getDataByID };
