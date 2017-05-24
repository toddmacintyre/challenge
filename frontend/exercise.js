window.onload = function () {
    const records = {
        isLoading: false,
        data: [],
        init: function () {
            this.getDomElements();
            this.getData();
            this.bindEvents();
        },
        getDomElements: function () {
            this.ul = document.getElementById('records-display');
            this.loader = document.getElementById('loader');
            this.container = document.getElementById('container');
            this.allButton = document.getElementById('all');
            this.expButton = document.getElementById('exp');
            this.errorDiv = document.getElementById('error-div');
        },
        bindEvents: function () {
            this.expButton.onclick = this.filterExp.bind(this);
            this.allButton.onclick = this.showAll.bind(this);
        },
        render: function (data) {
            if (this.isLoading) {
                this.loader.style.display = 'block';
                this.container.style.display = 'none';
            } else {
                this.loader.style.display = 'none';
                this.container.style.display = 'block';
                this.ul.innerHTML = '';
                if (this.data) {
                    data.forEach(i => {
                        let line = helpers.createRow(i);
                        this.ul.appendChild(line);
                    })
                }
            }
        },
        getData: function () {
            this.isLoading = true;
            this.render();
            csApi.getData()
                .then(results => {
                    this.isLoading = false;
                    csApi.getData().then(results => {
                        this.data = apiHelpers.getTopThirty(results);
                        this.render(this.data);
                    })
                }).catch(e => {
                    this.isLoading = false;
                    let errorMessage = helpers.createErroMessage();
                    this.errorDiv.appendChild(errorMessage);
                    this.errorDiv.className = 'error-div';
                    this.render();
                });
        },
        filterExp: function () {
            this.isLoading = true;
            this.render();
            csApi.getData().then(results => {
                this.isLoading = false;
                this.data = apiHelpers.getExpiredToday(results);
                this.render(this.data);
            }).catch(e => {
                this.isLoading = false;
                let errorMessage = helpers.createErroMessage();
                this.errorDiv.appendChild(errorMessage);
                this.errorDiv.className = 'error-div';
                this.render();
            });
        },
        showAll: function () {
            this.getData();
        }
    }
    records.init();
}

Date.prototype.isSame = function (compareTo) {
    this.setHours(0, 0, 0, 0);
    compareTo.setHours(0, 0, 0, 0);
    return this.valueOf() === compareTo.valueOf();
}

Date.prototype.addDay = function () {
    let date = this;
    let day = date.getDate();
    date.setDate(day + 1);
    return date;
}







