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

  componentDidUpdate() {
    console.log(this.state.record);
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

  // write function to filter only expired entries. Either filter them in this component, or pass down state and have each individual component decide whether or not to render.

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
