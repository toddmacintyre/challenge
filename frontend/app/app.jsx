import React, { Component } from 'react';

import csApi from './csUtils';
import Records from './records';
// const cs = function(result) {
//   apiResults = result;
//   window.setTimeout(function() {
//     csApi.getData(cs);
//   }, 5000 * 60);
// };
// csApi.getData(cs);

// put this as app function. onComponentWillMount start it off. Update state on interval with new values.

class App extends Component {
  constructor(props) {
    super(props);

    this.globalKey = 0;

    this.state = {
      record: [],
    }

    this.setRecord = this.setRecord.bind(this);
    this.getRecordAtInterval = this.getRecordAtInterval.bind(this);
  }

  componentWillMount() {
    csApi.getData(this.setRecord);
    // this.getRecordAtInterval();
  }

  getRecordAtInterval() {
    setInterval(() => {csApi.getData(this.setRecord)}, 3000);
  }

  setRecord(record) {
    let newRecord = record.sort((item1, item2) => {
      return Date.parse(item1.expiration_date) - Date.parse(item2.expiration_date);
    })
    newRecord = newRecord.slice(0, 30);
    this.setState({record: newRecord});
    console.log('records set');
  }

  render() {
    return (
      <div>
        <div>Records shown: {this.state.record.length}</div>
        <Records record={this.state.record} globalKey={this.globalKey} />
      </div>
    );
  }
}

export default App;
