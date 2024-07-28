import { PullData } from "@renderer/redux/prs_slice";

export default async function queryGithub(queries: string[], token: string): Promise<{[query: string]: {[id: string]: PullData}}> {
  let res = await fetch(`https://api.github.com/graphql`, {
    body: JSON.stringify({
      query: buildGraphQLQuery(queries),
    }),
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: 'POST',
  });

  let jsonRes = await res.json();
  if (!res.ok) {
    throw new Error(jsonRes.message);
  }

  let data = Object.keys(jsonRes.data).reduce((acc, queryKey, i) => {
    let prs = jsonRes.data[queryKey].edges
      .map(({ node }) => parsePullDataFromNode(node))
      .filter((pr: PullData) => pr != null) as PullData[];


    acc[queries[i]] = prs.reduce((accIn, pr) => ({...accIn, [pr.id]: pr}), {});

    return acc
  }, {});

  return data;
}

function parsePullDataFromNode(node: any): PullData | null {
  try {
    let status = node.commits.nodes[0].commit.status;

    return {
      id: node.id,

      org: node.repository.owner.login,
      repo: node.repository.name,
      pull: node.number,

      state: node.state,
      status: status != null ? status.state.toLowerCase() : 'no-status-found',
      name: node.title,
      url: node.url,
    };
  } catch (err) {
    console.error('Unable to parse pull data', node, err);
    return null;
  }
}


function buildGraphQLQuery(queries: string[]) {
  function buildSearchRequest(query: string, index: number) {
    return `
      query_${index}: search(query: "${query}", type: ISSUE, first: 50) {
        ...SearchResults
      }
    `;
  }

  return `
    fragment SearchResults on SearchResultItemConnection {
      edges {
        node {
          ... on PullRequest {
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
        }
      }
    }

    query SearchQuery {
      ${
        queries
          .map(buildSearchRequest)
          .join('\n')
      }
    }
  `;
}
