import React from 'react';
export default function TableCell({ data, columnName, onClick, isLink }) {
  return (
    <td
      onClick={
        data[columnName] !== undefined && isLink === true ? onClick : null
      }
    >
      {data[columnName]}
    </td>
  );
}
