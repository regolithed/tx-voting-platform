import React, { PropTypes } from 'react';

const EntryViewEdit = ({ isCreatingNew, isWorking, updateEntry, createEntry, entry, onTitleChange, onDescriptionChange, inputFields }) => {
  
  const loadingClass = isWorking ? 'is-loading' : '';
  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <div className="box">
          <div className="video-wrapper">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${entry.embedID}`} frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
        <br /><br />
        <p className="control">
          <input onChange={onTitleChange} className="input is-large" type="text" value={entry.title} />
        </p>
        <p className="control">
          <textarea onChange={onDescriptionChange} className="textarea" defaultValue={entry.description}></textarea>
        </p>
        <p className="control">
        <button className="button is-danger is-pulled-right is-outlined"><i className="fa fa-times"></i>Delete Entry</button>
          <button onClick={function clickControl() {
            if (isCreatingNew) {
              createEntry(entry);
            } else {
              updateEntry(entry.id, inputFields);      
            }
          }} className={`button is-primary ${loadingClass}`}>Create Entry</button>
          &nbsp;
          <a href="/entry/new" className="button">Cancel</a>
        </p>
      </div>
    </div>
  );
};

EntryViewEdit.propTypes = {
  entry: PropTypes.object,
  isWorking: PropTypes.bool,
  updateEntry: PropTypes.func,
  createEntry: PropTypes.func,
  onTitleChange: PropTypes.func,
  onDescriptionChange: PropTypes.func,
  inputFields: PropTypes.object,
};

module.exports = EntryViewEdit;
