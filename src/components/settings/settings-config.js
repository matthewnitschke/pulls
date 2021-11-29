module.exports = [
    {
        settingsKey: 'github',
        label: 'Github Auth Key',
        hint: 'found here: "https://github.com/settings/tokens"',
        isProtected: true,
        isRequired: true,
    },
    {
        settingsKey: 'githubUser',
        label: 'Github Username',
        hint: 'Used to get a list of your pulls',
        isRequired: true,
    },
    {
        settingsKey: 'githubQuery',
        label: 'Github Search Query',
        hint: 'The GitHub style query to use to retrieve the list of prs. Use `{githubUser}` as the wildcard for your github username',
        defaultValue: 'is:open is:pr author:{githubUser} archived:false',
        isRequired: true
    },
    {
        // "[A-z]*-\d*\s*[:\- ]\s*" can be used to remove a jira ticket
        settingsKey: 'prTitleRewriter',
        label: 'PR Title Rewrite',
        hint: 'A regex string that selects content in a pr title to remove. Can be useful to remove unhelpful information like a jira ticket, and cleanup the list of prs',
        isRequired: false
    }
    // {
    //     settingsKey: 'openAtLogin',
    //     label: 'Open at Login',
    //     hint: 'Open when logging into your computer',
    //     type: 'checkbox'
    // },
]