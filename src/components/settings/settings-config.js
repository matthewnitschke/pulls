module.exports = [
    {
        settingsKey: 'github',
        label: 'Github Auth Key',
        hint: 'found here: "https://github.com/settings/tokens"',
        type: 'string',
        isProtected: true,
        isRequired: true,
    },
    {
        settingsKey: 'githubUser',
        label: 'Github Username',
        hint: 'Used to get a list of your pulls',
        type: 'string',
        isRequired: true,
    },
    {
        settingsKey: 'githubQueries',
        label: 'Github Search Queries',
        hint: 'Map of label to github search query for the list of prs to retrieve. Use `{githubUser}` as the wildcard for your github username',
        type: 'map',
        defaultValue: [{
            key: 'My PRs',
            value: 'is:open is:pr author:{githubUser} archived:false',
        }]
    },
    // {
    //     settingsKey: 'globalShowHotkey',
    //     label: 'Global show hotkey',
    //     hint: 'Hotkey to use to show the panel. Uses electron\'s "Accelerator" format: https://www.electronjs.org/docs/latest/api/accelerator. Enter nothing to disable global shortcut.',
    //     defaultValue: 'CommandOrControl+I'
    // },
    {
        // "^([A-z]*-\d*\s*[, ]*)+[:\- ]\s*" can be used to remove a jira ticket
        settingsKey: 'prTitleRewriter',
        label: 'PR Title Rewrite',
        type: 'string',
        hint: 'A regex string that selects content in a pr title to remove. Can be useful to remove unhelpful information like a jira ticket, and cleanup the list of prs',
        isRequired: false
    },
    {
        settingsKey: 'windowHeight',
        label: 'Window Height',
        type: 'string',
        hint: 'The height of the popover window, in pixels. Requires app restart on change',
        defaultValue: '700',
        isRequired: false
    }
    // {
    //     settingsKey: 'openAtLogin',
    //     label: 'Open at Login',
    //     hint: 'Open when logging into your computer',
    //     type: 'checkbox'
    // },
]