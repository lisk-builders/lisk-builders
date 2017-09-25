import React from 'react';
import classnames from 'classnames';
import Bar from './Bar';
import Ribbon from './Ribbon';
import { GitHub } from './Icons';
import { rankClassNames } from './utils';

const affiliationClassNames = affiliation =>
    classnames('label float-right', {
        'label-success': affiliation === 'Freelance',
        'label-warning': affiliation !== 'Freelance',
    });

const Panel = ({
    rank,
    delegateName,
    delegateAddress,
    avatar_url,
    proposal,
    pool,
    githubUsername,
    poolPercentage,
    affiliation,
    liskChat,
    required,
    featured
}) =>
    <div key={rank} className="column col-xs-12 col-sm-12 col-md-6 col-4">
        <div className="panel rel">
            { featured && <Ribbon text='featured'/> }
            <div className="panel-header text-center">
                <figure
                    className="avatar avatar-lg"
                    data-initial={delegateName.split('')[0].toUpperCase()}>
                    <img src={avatar_url} />
                </figure>
                <div className="panel-title mt-10">{delegateName} </div>
                <div className="panel-subtitle">
                    <a
                        target="_blank"
                        href={`https://explorer.lisk.io/delegate/${delegateAddress}`}>
                        {delegateAddress}
                    </a>
                </div>
            </div>
            <div className="panel-body">
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <span className="tile-title">Rank</span>
                        <label className={rankClassNames(rank)}>#{rank}</label>
                    </div>
                </div>
                <div className="divider" />
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <span className="tile-title">Affiliation</span>
                        <label className={affiliationClassNames(affiliation)}>
                            {affiliation}
                        </label>
                    </div>
                </div>
                <div className="divider" />
                <div>
                    <span className="bar-title">Reward spending:</span>
                    <Bar {...poolPercentage} />
                </div>
                <div className="divider" />
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <a
                            className="btn btn-sm btn-block"
                            target="_blank"
                            disabled={!pool}
                            href={pool}>
                            Pool
                        </a>
                    </div>
                </div>
                <div className="divider" />
                <div className="tile tile-centered">
                    <div className="tile-content">
                        <a
                            className="btn btn-sm btn-block"
                            target="_blank"
                            disabled={!proposal}
                            href={proposal}>
                            Proposal
                        </a>
                    </div>
                </div>
                <div className="divider" />
                {githubUsername &&
                    <div className="tile tile-centered">
                        <div className="tile-content">
                            <a
                                className="btn btn-sm btn-block"
                                target="_blank"
                                href={`https://github.com/${githubUsername}`}>
                                <GitHub /> {githubUsername}
                            </a>
                        </div>
                    </div>}
            </div>
            <div className="panel-footer">
                {liskChat &&
                    <a
                        className="btn btn-sm btn-block"
                        target="_blank"
                        href={`https://lisk.chat/direct/${liskChat}`}>
                        @{liskChat}
                    </a>}
            </div>
        </div>
    </div>;

export default Panel;
