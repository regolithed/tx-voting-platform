const React = require('react');

const EntryCard = ({ entry, onClick }) => {
  return (
    <div className="column is-third">
    <div className="card">
      <div className="card-image" onClick={onClick}>
        <figure className="image is-4by3">
          <a href="#" title={ entry.title }><img src={entry.thumbnailURL} alt={ entry.title } /></a>
        </figure>
      </div>
      <div className="card-content">
        <small>{ entry.publishedAt }</small>
        <p className="title is-5"><a href="#" onClick={onClick} title={ entry.title }>{ entry.title }</a></p>
        <div className="content">
          { entry.description }
        </div>
        <div className="media">
          <div className="media-left">
            <figure className="image is-32x32 avatar">
              <a href="#"><img className="is-round" src="http://placehold.it/64x64&text=C" alt="Image" /></a>
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-5"><a href="#">Clay Branch</a></p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

module.exports = EntryCard;
