import React from 'react';
import classnames from 'classnames';
import Bar from './Bar';

const rankClassNames = (rank) =>
  classnames('label float-right', {
    'label-success': rank < 102,
    'label-warning': rank > 101
  });

const Panel = ({
    rank,
    delegateName,
    delegateAddress,
    avatar_url,
    proposal,
    githubUsername,
    poolPercentage,
    affiliation,
}) =>
    <div className="column col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <div className="panel">
            <div className="panel-header text-center">
                <figure className="avatar avatar-lg" data-initial={delegateName.split('')[0].toUpperCase()}>
                  <img src={avatar_url} />
                </figure>
                <div className="panel-title mt-10">{delegateName} </div>
                <div className="panel-subtitle">{delegateAddress}</div>
            </div>
            <div className="panel-body">
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <span className="tile-title">Rank</span>
                        <label className={rankClassNames(rank)}>{rank}</label>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tile">
                  <Bar {...poolPercentage}/>
                </div>
                <div className="divider"></div>
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
