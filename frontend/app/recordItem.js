import React from 'react';

const RecordItem = ({ item }) => {
  let expired = false;
  if (Date.parse(item.expiration_date) < Date.now()) {
    expired = true;
  }
  return (
    <div>
      <h3>{item.name}</h3>
      <p>{item.expiration_date}</p>
      <p>{expired ? 'Expired' : 'Valid'}</p>
    </div>
  );
};

export default RecordItem;
