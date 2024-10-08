/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ConfigSchema {
  /**
   * Your github access token, found here: https://github.com/settings/tokens
   */
  githubToken: string;
  /**
   * The list of query configurations which drive what prs are displayed
   */
  queries: {
    /**
     * The github search syntax query to use to retrieve the list of prs. Use `{githubUser}` as the wildcard for your github username. More information: https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests.
     */
    query: string;
    /**
     * The label to associate with this query
     */
    label: string;
    /**
     * A list of child queries nested within the same view
     */
    children?: {
      /**
       * The github search syntax query to use to retrieve the list of prs. Use `{githubUser}` as the wildcard for your github username. More information: https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests.
       */
      query: string;
      /**
       * The label to associate with this query
       */
      label: string;
    }[];
  }[];
  /**
   * A regex string that selects content in a pr title to remove. Can be useful to remove unhelpful information like a jira ticket, and cleanup the list of prs
   */
  prTitleRewriter?: string;
}
