import React, { Component } from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

class RecordItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      expired: false,
    };

    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.handleReduce = this.handleReduce.bind(this);
  }

  componentWillMount() {
    if (Date.parse(this.props.item.expiration_date) < Date.now()) {
      this.setState({expired: true});
    }
  }

  handleExpandChange() {
    this.setState({expanded: !this.state.expanded});
  };

  handleReduce () {
    this.setState({expanded: false});
  };

  render() {
    const { item, toggleExpand, anyExpanded } = this.props;
    const expired = this.state.expired;

    return (
      <Card
        className="itemCard"
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
        onBlur={() => {
          setTimeout(() => {
            this.handleReduce();
          }, 100);
        }}
      >
        <CardHeader
          title={item.name}
          subtitle={expired ? 'Expired' : 'Valid'}
          className={expired ? 'expired' : 'valid'}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>
            DEA number: {item.dea_number}
          </div>
          <div>
            Expiration: {item.expiration_date}
          </div>
          <div>
            NPI: {item.npi}
          </div>
          <div>
            Provider ID: {item.provider_id}
          </div>
        </CardText>
      </Card>
    );
  }
};

export default RecordItem;



// dea_number
// :
// "MS2485818"
// expiration_date
// :
// "2014-02-28"
// name
// :
// "Dominick Savino"
// npi
// :
// 1134364045
// provider_id
// :
// 5601