const React = require('react');

const GetEntryInfo = ({ infoIsLoading, onSubmit }) => {
  let input;
  const loadingClass = infoIsLoading ? 'is-loading' : '';
  return (
    <div className="columns">
      <div className="column is-half is-offset-quarter">
        <div className="box">
          <p className="title">Submit Link</p>
          <hr />
          <br />
          <p className="subtitle">Paste in the link to your content&hellip;</p>
          <form onSubmit={e => {
            e.preventDefault();
            if (!input.value.trim()) {
              return;
            }
            onSubmit(input.value);
            input.value = '';
          }}
          >
            <p className="control">
              <input className="input is-large" placeholder="http://&hellip;" ref={node => {
                input = node;
              }}
              />
            </p>
            <p className="control">
              <button className={`button is-primary ${loadingClass}`}>Submit Link</button>
              &nbsp;
              <button className="button">Cancel</button>
            </p>
          </form>
          <br />
        </div>
      </div>
    </div>
  );
};

module.exports = GetEntryInfo;
