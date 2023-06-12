let n = 6, w = 2
for (let i = 0; i < n; i++) {
    let s = ''
    for (let j = 0; j < 2 * n - 1; j++) {
        let lo = n - i + 1
        let li = lo + w
        let ro = n + i
        let ri = ro - w
        if ((lo <= j && j < li) && (ri > j && j < ro)) {
            s += '*'
        } else {
            s += ' '
        }
    }
    console.log(s);
}
