/* eslint max-len: [0] */
import React from 'react';
import DateFormat from './DateFormat';
import { Link } from 'react-router';


const EntryCard = ({ entry }) => {
  return (
    <div className="column is-third">
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <Link to={`/entry/yt/${entry.id}`} title={ entry.title }><img src={entry.thumbnailURL} alt={ entry.title } /></Link>
        </figure>
      </div>
      <div className="card-content">
        <figure data-hint="Clay Branch" className="image is-48x48 avatar hint--left hint--rounded">
          <a href="#"><img className="is-round" src="https://avatars2.githubusercontent.com/u/1420404?v=3&s=400" alt="Image" /></a>
        </figure>
        <small><i className="fa fa-eye"></i>&nbsp;23,432&nbsp;&bull;&nbsp;<DateFormat pubDate={ entry.publishedAt } /></small>
        <p className="title is-5"><Link to={`/entry/yt/${entry.id}`} title={ entry.title }>{ entry.title }</Link></p>
      </div>
    </div>
    </div>
  );
};

module.exports = EntryCard;
