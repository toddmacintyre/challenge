import React, { Component } from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


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
    const expiredClass = expired ? 'expired' : 'valid';
    const expanded = this.state.expanded;
    const expandedClass = expanded ? 'expanded' : 'collapsed';

    const itemClass = `itemCard ${expiredClass} ${expandedClass}`

    return (
      <Card
        className={itemClass}
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
        onBlur={() => {
          setTimeout(() => {
            this.handleReduce();
          }, 200);
        }}
      >
        <CardHeader
          title={item.name}
          subtitle={expiredClass.slice(0, 1).toUpperCase().concat(expiredClass.slice(1))}
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
