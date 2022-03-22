const settings = require('../components/settings/settings-utils.js');

export const query = (ghQuery) => {
  let githubAuth = settings.get('github');

  let res = await fetch(`https://api.github.com/graphql`, {
    body: JSON.stringify({
      query: buildGraphQLQuery(ghQuery)
    }),
    headers: {
      Authorization: `bearer ${githubAuth}`,
    },
    method: "POST"
  })

  return await res.json();
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
