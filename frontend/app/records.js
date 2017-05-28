import React from 'react';
import RecordItem from './recordItem';

const Records = ({ record, globalKey }) => {
  return (
    <div>
      {record.map(item => (
        <RecordItem key={globalKey++} item={item} />
      ))}
    </div>
  );
};

export default Records;
