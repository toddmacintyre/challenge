import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RecordItem from './recordItem';



class Records extends Component {
  constructor(props) {
    super(props);

    this.style = {
      width: 780,
      margin: 'auto',
      display: 'inline-block',
    };

    this.state = {
      expanded: false,
    }

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const { record } = this.props;
    let { globalKey } = this.props;

    return (
      <Paper style={this.style} zDepth={3} rounded={false}>
        {record.map(item => (
          <RecordItem key={globalKey++} item={item} toggleExpand={this.toggleExpand} anyExpanded={this.state.expanded} />
        ))}
      </Paper>
    );
  }
};

export default Records;



          // onTouchTap={(e) => {
          //   this.setState({expanded: !this.state.expanded});
          //   console.log(this.state.expanded);
          // }}




