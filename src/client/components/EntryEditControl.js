import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const EntryEditControl = ({ entryID }) => {
  return (
    <div className="entry-control">
      <p>
        <Link to={`/entry/yt/edit/${entryID}`} className="button is-success"><i className="fa fa-pencil"></i>Edit Entry</Link>
      </p>
    </div>
  );
};

EntryEditControl.propTypes = {
  entryID: PropTypes.number.isRequired,
};

module.exports = EntryEditControl;
