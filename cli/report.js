const { getProgressReport } = require("../lib/report");

(async () => {
    console.table(await getProgressReport());
})();
