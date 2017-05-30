import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RecordItem from './recordItem';


class Records extends Component {
  constructor(props) {
    super(props);

    this.style = {
      paperStyle: {
        width: 780,
        margin: 'auto',
        display: 'inline-block',
      },
      flexDisplay: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      },
      loaderIMG: {
        width: '5%',
      }
    };

    this.state = {
      expanded: false,
      tempText: '',
      loaderURL: './assets/loader.gif',
      loaderIMGWidth: {width: 50},
    }

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const { record } = this.props;
    let { globalKey } = this.props;

    if (!record.length) {
      setTimeout(() => {
        this.setState({tempText: 'No Results Found...'});
        this.setState({loaderIMGWidth: {width: 0}});
      }, 3000)
      return (
        <div style={{margin: '40 auto', textAlign: 'center'}}>
          <img style={Object.assign({}, this.style.loaderIMG, this.state.loaderIMGWidth)} src={this.state.loaderURL} className="loaderIMG" />
          <span>{this.state.tempText}</span>
        </div>
      );
    }

    return (
      <div style={this.style.flexDisplay}>
        <Paper style={this.style.paperStyle} zDepth={3} rounded={false}>
          {record.map(item => (
            <RecordItem key={globalKey++} item={item} toggleExpand={this.toggleExpand} anyExpanded={this.state.expanded} />
          ))}
        </Paper>
      </div>
    );
  }
};

export default Records;
