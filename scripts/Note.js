import React from 'react';

const Note = () =>
    <section className="empty text-justify">
        <div className="empty-icon">
            <i className="icon icon-message" />
        </div>
        <h4 className="empty-title">Hi there fellow Liskers</h4>
        <p className="empty-subtitle">
            We are lisk.builders, a community of individual delegates who
            actively contribute to the future of Lisk,
            by developing software / hardware,creating community awareness or
            any other activities that directly improve the platform.
        </p>
        <p className="empty-subtitle">
            This list enforces no internal voting and does not require you to
            vote for all of us in order to receive rewards.
            Some of us will share a % of their delegate forging rewards and
            others will not. You can vote for one of us or all of us and every
            small vote is a vote for the future of Lisk!
        </p>
        <p className="empty-subtitle">
            To get yourself added to the list you can submit a PR to the
            following repository:{' '}
            <a href="https://github.com/5an1ty/lisk-builders">
                https://github.com/5an1ty/lisk-builders
            </a>.
        </p>
        <p className="empty-subtitle">
            This list is maintained by 5an1ty, Isabella and alepop.
        </p>
        <div className="empty-action">
            <button className="btn btn-primary">Send a message</button>
        </div>
    </section>;

export default Note;
