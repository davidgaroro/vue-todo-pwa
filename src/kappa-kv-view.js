import makeView from "kappa-view";

const makeKvView = (storage) => {
  return makeView(storage, { valueEncoding: "json" }, function (db) {
    return {
      map: function (entries, next) {
        const batch = entries.map(function (entry) {
          const { id, type, ...value } = entry.value;
          return {
            type: type === "del" ? "del" : "put",
            key: id,
            value: value,
          };
        });
        db.batch(batch, next);
      },

      api: {
        get: function (core, key, cb) {
          core.ready(function () {
            db.get(key, cb);
          });
        },
        all: function (core, cb) {
          core.ready(() => {
            const data = [];
            db.createReadStream()
              .on("data", (entry) => {
                data.push(entry);
              })
              .on("end", () => {
                cb(data);
              });
          });
        },
        on: (core, event, cb) => {
          core.ready(() => {
            db.on(event, cb);
          });
        },
      },
    };
  });
};
export default makeKvView;
