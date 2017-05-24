const apiHelpers = (function () {
    function getTopThirty(results) {
        let response = results.slice(0, 30).sort((r1, r2) => {
            let exp1 = new Date(r1.expiration_date);
            let exp2 = new Date(r2.expiration_date);
            if (exp1 > exp2) {
                return -1;
            }
            if (exp1 < exp2) {
                return 1;
            }
            return 0;
        })
        return response;
    }

    function getExpiredToday(results) {
        let response = results.filter(r => {
            let today = new Date();
            let exp = new Date(r.expiration_date).addDay();
            return today.isSame(exp);
        });
        return response;
    }

    return {
        getTopThirty,
        getExpiredToday
    }
})()
