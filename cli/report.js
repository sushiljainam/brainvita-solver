const { getProgressReport } = require("../lib/report");

(async () => {
    console.table(await getProgressReport());
})();
console.log('printing formatted report on console');
