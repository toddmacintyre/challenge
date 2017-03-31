(function () {
    csApi.getData(renderRecords.renderFilteredRecords.bind(this, 30));
    renderRecords.toggleRecordVisibility(document.getElementById('DEARecords'));
    var button = document.getElementById('expiredButton');
    var messageContainer = document.getElementById('message');
    renderRecords.filterExpired(button, messageContainer);
})();
