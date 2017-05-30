import React, { Component } from 'react';

import csApi from './csUtils';
import Records from './records';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';


class App extends Component {
  constructor(props) {
    super(props);

    this.globalKey = 0;

    this.state = {
      record: [],
      filtered: false,
    }

    this.setRecord = this.setRecord.bind(this);
    this.getRecordAtInterval = this.getRecordAtInterval.bind(this);
    this.filterExpiredToday = this.filterExpiredToday.bind(this);
  }

  componentWillMount() {
    csApi.getData(this.setRecord);
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
  }

  filterExpiredToday() {
    if (!this.state.filtered) {
      let currentDate = new Date;
      const year = currentDate.getFullYear().toString();
      let month = (currentDate.getMonth() + 1).toString();
      if (month.length < 2) month = ('0').concat(month);
      let day = currentDate.getDate().toString();
      if (day.length < 2) day = ('0').concat(day);
      currentDate = Date.parse(`${year}-${month}-${day}`);

      const record = this.state.record.filter(val => {
        return val.expiration_date === currentDate;
      });

      this.setState({record});
      this.setState({filtered: !this.state.filtered});
    } else {
      csApi.getData(this.setRecord);
      this.setState({filtered: !this.state.filtered})
    }
  }

  render() {
    const filterText = this.state.filtered ? 'Remove Filter' : 'Filter Expired Today';
    return (
      <div>
        <AppBar
          className="appBar"
          title={<span>Simple DEA</span>}
          iconElementRight={
            <FlatButton
              label={filterText}
              onTouchTap={() => {
                this.filterExpiredToday();
              }}
            />
          }
        />
        <Records record={this.state.record} globalKey={this.globalKey} />
      </div>
    );
  }
}

export default App;
