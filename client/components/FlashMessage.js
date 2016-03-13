import React, { PropTypes } from 'react';

const FlashMessage = ({ onCloseClick, text, messageType, isVisible }) => {
  const flashMessageVisibility = isVisible ? 'show' : '';
  return (
    <div className={ `notification has-icon is-text-centered is-${messageType} ${flashMessageVisibility}` }>
      <button onClick={onCloseClick} className="delete"></button>
      <h3 className="title is-5"><i className="fa fa-check-circle"></i>&nbsp;{text}</h3>
    </div>
  );
};

FlashMessage.propTypes = {
  onCloseClick: PropTypes.func,
  text: PropTypes.string.isRequired,
  messageType: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

module.exports = FlashMessage;
