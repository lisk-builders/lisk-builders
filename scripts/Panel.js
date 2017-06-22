import React from 'react';

const Panel = ({
    rank,
    delegateName,
    delegateAddress,
    proposal,
    githubUsername,
    poolPercentage,
    affiliation,
}) =>
    <div className="column col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <div className="panel">
            <div className="panel-header text-center">
                <figure className="avatar avatar-lg">
                </figure>
                <div className="panel-title mt-10">{delegateName} </div>
                <div className="panel-subtitle">{delegateAddress}</div>
            </div>
            <div className="panel-body">
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <div className="tile-title">Rank</div>
                        <div className="tile-subtitle">{rank}</div>
                    </div>
                </div>
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <div className="tile-title">Proposal</div>
                        <div className="tile-subtitle">
                            <a href={proposal}>Read</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel-footer">
                buttons or input
            </div>
        </div>
    </div>;

export default Panel;
