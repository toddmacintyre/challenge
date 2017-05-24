const helpers = (function () {
    function createRow(i) {
        let li = document.createElement('li');
        let nameSpan = document.createElement('span');
        let toggleButton = document.createElement('span');
        toggleButton.className = 'toggle-button';
        nameSpan.appendChild(document.createTextNode(i.name));
        nameSpan.appendChild(document.createTextNode(" - "));
        nameSpan.appendChild(document.createTextNode(i.expiration_date));
        nameSpan.className = 'name-span';
        let today = new Date();
        let exp = new Date(i.expiration_date).addDay();
        if (exp < today || exp.isSame(today)) {
            nameSpan.appendChild(document.createTextNode(" EXPIRED"))
        }
        li.appendChild(nameSpan);
        li.className = 'line-item';
        li.appendChild(toggleButton);
        li.onclick = () => toggleInfoDiv(li, i)
        return li;
    }

    function createCollapsingDiv(item) {
        let extraInfoDiv = document.createElement('div');
        let deaNumber = document.createElement('p');
        let npi = document.createElement('p');
        let providerId = document.createElement('p');
        let expDate = document.createElement('p');
        deaNumber.classList.add('details-span');
        npi.classList.add('details-span');
        providerId.classList.add('details-span');
        expDate.classList.add('details-span');
        deaNumber.appendChild(document.createTextNode('DEA Number: ' + item.dea_number));
        npi.appendChild(document.createTextNode('NPI: ' + item.npi));
        providerId.appendChild(document.createTextNode('Provider ID: ' + item.provider_id));
        expDate.appendChild(document.createTextNode('EXP Date: ' + item.expiration_date));
        extraInfoDiv.appendChild(deaNumber);
        extraInfoDiv.appendChild(npi);
        extraInfoDiv.appendChild(providerId);
        extraInfoDiv.appendChild(expDate);
        return extraInfoDiv;
    }

    function toggleInfoDiv(li, item) {
        let isAdding = true;
        li.childNodes.forEach(node => {
            if (node.tagName === 'DIV') {
                isAdding = false;
                li.classList.remove('expanded');
                li.classList.add('collapsed');
                li.removeChild(node);
            }
        })
        if (isAdding) {
            let ul = document.getElementById('records-display');
            let allLines = ul.childNodes;
            allLines.forEach(line => {
                let children = line.childNodes;
                children.forEach(node => {
                    if (node.tagName === 'DIV') {
                        line.classList.remove('expanded');
                        line.classList.add('collapsed');
                        line.removeChild(node);
                    }
                })
            })
            let div = createCollapsingDiv(item);
            li.classList.remove('collapsed');
            li.classList.add('epanded');
            li.appendChild(div);
        }
    }

    function createErroMessage() {
        let errorMessage = document.createElement('h3');
        errorMessage.className = 'error-msg';
        errorMessage.appendChild(document.createTextNode("Seems like something went wrong"))
        return errorMessage;
    }

    return {
        createRow,
        createErroMessage
    }
})()













