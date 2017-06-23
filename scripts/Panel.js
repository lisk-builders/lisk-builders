import React from 'react';
import classnames from 'classnames';
import Bar from './Bar';
import { GitHub } from './Icons'

const rankClassNames = (rank) =>
  classnames('label float-right', {
    'label-success': rank < 102,
    'label-warning': rank > 101
  });

const affiliationClassNames = (affiliation) =>
  classnames('label float-right', {
    'label-success': affiliation === "Freelance",
    'label-warning': affiliation !== "Freelance"
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
    liskChat
}) =>
    <div key={rank} className="column col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <div className="panel">
            <div className="panel-header text-center">
                <figure className="avatar avatar-lg" data-initial={delegateName.split('')[0].toUpperCase()}>
                  <img src={avatar_url} />
                </figure>
                <div className="panel-title mt-10">{delegateName} </div>
                <div className="panel-subtitle">
                  <a target="_blank" href={`https://explorer.lisk.io/address/${delegateAddress}`}>{delegateAddress}</a>
                </div>
            </div>
            <div className="panel-body">
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <span className="tile-title">Rank</span>
                        <label className={rankClassNames(rank)}>#{rank}</label>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <span className="tile-title">Affiliation</span>
                        <label className={affiliationClassNames(affiliation)}>{affiliation}</label>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tile">
                  <Bar {...poolPercentage}/>
                </div>
                <div className="divider"></div>
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <a className="btn btn-sm btn-block" target="_blank" href={proposal}>Proposal</a>
                    </div>
                </div>
                <div className="divider"></div>
                { githubUsername &&
                  <div className="tile tile-centered">
                    <div className="tile-content">
                        <a className="btn btn-sm btn-block" target="_blank" href={`https://github.com/${githubUsername}`}>
                          <GitHub /> {githubUsername}
                        </a>
                    </div>
                  </div>
                }
            </div>
            <div className="panel-footer">
              { liskChat && <a className="btn btn-sm btn-block" target="_blank"href={`https://lisk.chat/direct/${liskChat}`}>@{liskChat}</a> }
            </div>
        </div>
    </div>;

export default Panel;
