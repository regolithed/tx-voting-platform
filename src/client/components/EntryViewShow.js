const React = require('react');
const EntryAuthor = require('./EntryAuthor');
const EntryEditControl = require('./EntryEditControl');

const EntryViewShow = ({ entry }) => {
  return (
    <div className="container">
      <div className="columns">
        <div className="column is-8">
          <div className="box">
            <div className="video-wrapper">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${entry.embedID}`} frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>
          <p className="title is-5 is-pad-15">{entry.description}</p>
        </div>
        <div className="column is-4">
          <div className="big-data">
            <p className="title is-3 entry-title">{entry.title}</p>
            <EntryAuthor />
            <hr />
            <h3 className="title is-6 heading"><i className="fa fa-bar-chart"></i>&nbsp;Stats</h3>
            <div className="columns">
              <div className="column is-half">
                <p className="number">21,233</p>
                <small>Views</small>
              </div>
              <div className="column is-half">
                <p className="number">33</p>
                <small>Likes</small>
              </div>
            </div>
            <hr />
            <div className="columns">
              <div className="column is-half">
                <h3 className="title is-6 heading"><i className="fa fa-youtube"></i>&nbsp;YouTube</h3>
                <a className="is-block" href={`https://youtu.be/${entry.embedID}`}>youtu.be/{entry.embedID}</a>
              </div>
              <div className="column is-half">
                <h3 className="title is-6 heading"><i className="fa fa-share"></i>&nbsp;Share</h3>
                <ul>
                  <li className="is-inline">
                    <a target="_new" data-hint="Share on Twitter" className="hint--top hint--rounded" href={`https://twitter.com/intent/tweet?via=texansvote&amp;text=${entry.title}&amp;url=http://texaxs.vote/entry/yt/${entry.id}`}><span className="icon"><i className="fa fa-twitter-square"></i></span></a>
                  </li>
                  <li className="is-inline">
                    <a target="_new" data-hint="Share on Facebook" className="hint--top hint--rounded" href={`https://www.facebook.com/sharer/sharer.php?u=http://texaxs.vote/entry/yt/${entry.id}`}><span className="icon"><i className="fa fa-facebook-square"></i></span></a>
                  </li>
                  <li className="is-inline">
                    <a target="_new" data-hint="Share on Reddit" className="hint--top hint--rounded" href={`https:////www.reddit.com/submit?title=${entry.title}&amp;url=http://texaxs.vote/entry/yt/${entry.id}`}><span className="icon"><i className="fa fa-reddit-square"></i></span></a>
                  </li>
                </ul>
              </div>
            </div>
            <EntryEditControl entryID={entry.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = EntryViewShow;
