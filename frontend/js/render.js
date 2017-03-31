var renderRecords = function () {

    var expiredRecordsLength = 0;
    // include number paramenter to be able to change number of records displayed
    renderFilteredRecords = function (number, result) {
        debugger;
        var length = (result.length > number) ? number : result.length;
        var records = [];
        for (var i = 0; i < length; i++) {
            records.push(result[i]);
        }

        records.sort(function (a, b) {
            var first = a.expiration_date;
            var second = b.expiration_date;
            if (first < second) {
                return -1;
            }
            if (first > second) {
                return 1;
            }
            return 0;
            console.log(records);
        });

        var docFrag = document.createDocumentFragment();
        var outputLoc = document.getElementById('DEARecords');
        var today = new Date();
        today = today.toISOString().slice(0, 10);
        var idCount = 1;
        records.forEach(function (element, i, array) {
            if (today >= records[i].expiration_date) {
                expiredRecordsLength++;
            }
            var container = document.createElement('div');
            container.className = 'accordion-container';
            container.setAttribute('role', 'tablist');
            var rawName = records[i].name;
            formattedName = toTitleCase(rawName);
            var active = '<span class="success">Active</span>';
            var expired = '<span class="alert">Expired</span>';
            var status = (today >= records[i].expiration_date) ? expired : active;
            var id = '"ui-id-' + idCount + '"';
            var contentId = '"ui-id-' + (++idCount) + '"';
            var accessiblityAttr = 'role="tab" id=' + id + 'aria-controls=' + contentId + 'aria-selected="false" aria-expanded="false" tabindex="0"'
            var divElem = '<h3 class="accordion"' + accessiblityAttr + '>' + formattedName + status + '</h3>';
            var number = '<li>DEA number: ' + records[i].dea_number + '</li>';
            var npi = '<li>NPI: ' + records[i].npi + '</li>';
            var expirationDate = '<li>Expiration Date: ' + records[i].expiration_date + '</li>';
            var id = '<li>Provider ID: ' + records[i].provider_id + '</li>';
            var ULAccessiblity = 'id="ui-id-' + idCount + '" aria-labelledby="ui-id-' + (idCount - 1) + '" role="tabpanel" aria-hidden="true"'
            var unorderedList = '<ul hidden class="column-two"' + ULAccessiblity + '>' + number + npi + expirationDate + id + '</ul>';
            idCount++;
            container.innerHTML += divElem;
            container.innerHTML += unorderedList;
            docFrag.appendChild(container);
        });

        outputLoc.appendChild(docFrag);
    }

    toTitleCase = function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    toggle = function (e) {
        // remove hidden attribute on sibling ul and set aria props to true
        if (e.target && e.target.matches(".accordion")) {
            var allRecordNames = document.getElementsByClassName('accordion');
            var moreInfo = e.target.nextElementSibling;
            moreInfo.removeAttribute('hidden');
            moreInfo.setAttribute('aria-hidden', false);
            moreInfo.previousElementSibling.className = 'accordion open';
            moreInfo.previousElementSibling.setAttribute('aria-expanded', true);
            moreInfo.previousElementSibling.setAttribute('aria-selected', true);
            // iteratate through all other uls to check for any open and add hidden/aria false attributes
            for (var i = 0; i < allRecordNames.length; i++) {
                if (allRecordNames[i] !== e.target && allRecordNames[i].classList.contains('open')) {
                    var toHideElem = allRecordNames[i].nextElementSibling;
                    toHideElem.setAttribute('hidden', '');
                    toHideElem.setAttribute('aria-hidden', true);
                    toHideElem.previousElementSibling.className = 'accordion'
                    toHideElem.previousElementSibling.setAttribute('aria-expanded', false);
                    toHideElem.previousElementSibling.setAttribute('aria-selected', false);
                    // return because only one ul can be shown at a time
                    return false;
                }
            }
        }
    }

    toggleRecordVisibility = function (elem) {
        // add keyboard support
        elem.addEventListener('keypress', function (e) {
            if (e.which === 32 || e.which === 13) {
                toggle(e);
            }
        });
        elem.addEventListener('click', function (e) {
            toggle(e);
        });
    }

    filterExpired = function (button, message) {
        button.addEventListener('click', function () {
            var active = document.getElementsByClassName('success');
            if (button.innerText === 'Show only expired') {
                for (var i = 0; i < active.length; i++) {
                    active[i].parentNode.parentNode.setAttribute('hidden', '');
                }
                button.innerText = 'Show all';
                if (expiredRecordsLength === 0) {
                    message.innerText = 'There are no expired licenses';
                }
            } else {
                for (var i = 0; i < active.length; i++) {
                    active[i].parentNode.parentNode.removeAttribute('hidden', '');
                }
                message.innerText = '';
                button.innerText = 'Show only expired';
            }

        });
    }

    return {
        toTitleCase: toTitleCase,
        renderFilteredRecords: renderFilteredRecords,
        toggleRecordVisibility: toggleRecordVisibility,
        filterExpired: filterExpired
    }

}();
