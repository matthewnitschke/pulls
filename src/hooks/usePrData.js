// Libraries
import { useState, useEffect } from 'react';
import swal from 'sweetalert';
import toMils from 'to-mils';
import { v4 as uuid } from 'uuid';

// Hooks
import useInterval from './useInterval.js';

import settings from 'src/components/settings/settings-utils.js';

const USE_DUMMY_DATA = true;

const baseFragment = `
fragment Base on PullRequest {
    id
    state
    number
    title
    url
    headRef {
      name
    }
    repository {
      name
      owner {
        login
      }
    }

    commits(last: 1) {
        nodes {
            commit {
                status {
                    state
                }
            }
        }
    }
}
`

const statusesFragment = `
fragment Statuses on PullRequest {
    state
    commits(last: 1) {
        nodes {
            commit {
                status {
                    state
                    contexts {
                        state
                      	context
                      	targetUrl
                    }
                }
            }
        }
    }
}
`

async function githubGraphQLRequest(query) {
    if (USE_DUMMY_DATA) return dummyPrData;

    let githubAuth = settings.get('github');
    let res = await fetch(`https://api.github.com/graphql`, {
        body: JSON.stringify({
            query: query
        }),
        headers: {
            Authorization: `bearer ${githubAuth}`,
        },
        method: "POST"
    })

    return await res.json();
}


function parsePullData(node) {
    try {
        let status = node.commits.nodes[0].commit.status

        return {
            id: node.id,

            org: node.repository.owner.login,
            repo: node.repository.name,
            pull: node.number,

            prState: node.state,
            prStatus: status != null ? status.state.toLowerCase() : 'no-status-found',
            name: node.title,
            prUrl: node.url,
            branch: node.headRef.name,

            rawData: node
        }
    } catch {
        console.error('Unable to parse pull data', node)
    }
}

export function usePrData() {
    let [ resp, setResp ] = useState({
        prData: {},
        prOrder: []
    })

    let [ isRunning, setIsRunning ] = useState(false);

    let apiRequest = () => {
        let username = settings.get('githubUser');
        let query = settings.get('githubQuery');
        if (!username || !query) return;

        let usernameQuery = query.replace('{githubUser}', username)

        setIsRunning(true);
        githubGraphQLRequest(`
            ${baseFragment}
            ${statusesFragment}
            query SearchQuery {
                search(query: "${usernameQuery}", type: ISSUE, first: 50) {
                    edges {
                        node {
                            ...Base
                            ...Statuses
                        }
                    }
                }
            }
        `).then((resp) => {
            if (resp?.data?.search?.edges == null) {
                swal({
                    title: 'GitHub API request failed',
                    icon: 'error',
                    text: `Failed with the following response: ${JSON.stringify(resp)}`
                })
                return
            }

            let parsedData = resp.data.search.edges
                .map(({node}) => parsePullData(node))
                .filter(pullData => pullData != null)

                
            setResp({
                prData: parsedData.reduce((acc, pr) => ({
                    ...acc,
                    [pr.id]: pr
                }), {}),
                
                prOrder: parsedData.map(({id}) => id),
            });
            
            setIsRunning(false);
        })
    }

    useEffect(apiRequest, []);
    useInterval(apiRequest, toMils('30sec'));

    return {
        prs: resp.prData,
        prOrder: resp.prOrder,
        isRunning: isRunning,
        rerunQuery: apiRequest
    }
}

const dummyPrData = {
    data: { 
        search: {
            edges: [
                generateDummyPrData({title: 'Some PR 1'}),
                generateDummyPrData({title: 'Some PR 2'}),
                generateDummyPrData({title: 'Some PR 3'}),
                generateDummyPrData({title: 'Some PR 4'}),
                generateDummyPrData({title: 'Some PR 5'}),
            ]
        }
    }
}

function generateDummyPrData({
    id, 
    status, 
    org, 
    repo, 
    pull, 
    state, 
    title, 
    url, 
    branch
}) {
    return {
        node: {
            id: id ?? `${title}-id`,
            commits: {
                nodes: [{
                    commit: {
                        status: {
                            state: status ?? 'status'
                        }
                    }
                }]
            },
            repository: {
                name: repo ?? 'a_repo',
                owner: {
                    login: org ?? 'testOrg',
                }
            },
            number: pull ?? '1234',
            state: state ?? 'testState',
            title: title ?? 'testTitle',
            url: url ?? 'testUrl',
            headRef: {
                name: branch ?? 'testBranch'
            }
        }
    }
}