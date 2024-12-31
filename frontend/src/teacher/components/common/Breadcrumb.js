import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common/breadcrumb.css';

function Breadcrumb({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="separator">/</span>}
          {item.link ? (
            <Link to={item.link}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb; 