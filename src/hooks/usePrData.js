// Libraries
import { useState, useEffect, useRef } from 'react';
import swal from 'sweetalert';
import toMils from 'to-mils';
import settings from 'src/components/settings/settings-utils.js';

// Hooks
import useInterval from './useInterval.js';

let resetStructureResponseCount = 20;

export function usePrData(
  query,
  resetStructure
) {
  let previousResponses = useRef([]);

  let [resp, setResp] = useState({
    prData: {},
    prOrder: []
  })

  let [isRunning, setIsRunning] = useState(false);

  let apiRequest = () => {
    let username = settings.get('githubUser');
    
    if (!username || !query) return;

    let usernameQuery = query.replace('{githubUser}', username)

    setIsRunning(true);

    queryForPrData(usernameQuery).then((resp) => {
      if (resp?.data?.search?.edges == null) {
        swal({
          title: 'GitHub API request failed',
          icon: 'error',
          text: `Failed with the following response: ${JSON.stringify(resp)}`
        })
        return
      }

      let parsedData = resp.data.search.edges
        .map(({ node }) => parsePullDataFromNode(node))
        .filter(pullData => pullData != null)

      let prData = parsedData.reduce((acc, pr) => ({
        ...acc,
        [pr.id]: pr
      }), {});

      let prOrder = parsedData.map(({ id }) => id);

      previousResponses.current.push(prOrder);
      if (previousResponses.current.length >= resetStructureResponseCount) {
        let resp = mode(previousResponses.current.map((respData) => respData.join(',')))
        
        resetStructure(resp);
        previousResponses.current = [];
      }

      setResp({ prData, prOrder });

      setIsRunning(false);
    })
  }

  useEffect(() => {
    apiRequest();
    previousResponses.current = [];
  }, [query]);
  useInterval(apiRequest, toMils('1min'));

  return {
    prs: resp.prData,
    prOrder: resp.prOrder,
    isRunning: isRunning,
    rerunQuery: apiRequest
  }
}


function queryForPrData(usernameQuery) {
  return githubGraphQLRequest(`
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
    `)
}

async function githubGraphQLRequest(query) {
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


function parsePullDataFromNode(node) {
  try {
    let status = node.commits.nodes[0].commit.status

    return {
      id: node.id,

      org: node.repository.owner.login,
      repo: node.repository.name,
      pull: node.number,

      prState: node.state,
      prStatus: status != null ? status.state.toLowerCase() : 'no-status-found',
      prStatusContexts: status?.contexts ?? [],
      name: node.title,
      prUrl: node.url,
      branch: node.headRef.name,

      rawData: node
    }
  } catch {
    console.error('Unable to parse pull data', node)
  }
}

function mode(arr){
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop();
}