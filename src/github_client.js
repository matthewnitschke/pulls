export default async function queryGithub(ghQuery, githubToken) {

  let res = await fetch(`https://api.github.com/graphql`, {
    body: JSON.stringify({
      query: buildGraphQLQuery(ghQuery)
    }),
    headers: {
      Authorization: `bearer ${githubToken}`,
    },
    method: "POST"
  });
  
  let jsonRes = await res.json();

  if (!res.ok) {
    throw new Error(jsonRes.message);
  }

  let parsedData = jsonRes.data.search.edges
    .map(({ node }) => parsePullDataFromNode(node))
    .filter(pullData => pullData != null)

  let prData = parsedData.reduce((acc, pr) => ({
    ...acc,
    [pr.id]: pr
  }), {});

  return prData;
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
  } catch (err) {
    console.error('Unable to parse pull data', node, err)
  }
}

function buildGraphQLQuery(ghQuery) {
  return `
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
      search(query: "${ghQuery}", type: ISSUE, first: 50) {
          edges {
              node {
                  ...Base
                  ...Statuses
              }
          }
      }
  }
  `
}
