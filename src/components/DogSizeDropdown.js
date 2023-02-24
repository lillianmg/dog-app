import React from 'react';

function DogSizeDropdown(props) {
  return (
    <div>
        Size:  
    <select id="dog-size" onChange={props.onSelect}>
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
    </select>
    </div>
  );
}

export default DogSizeDropdown;
