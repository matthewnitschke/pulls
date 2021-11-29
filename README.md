# Pulls
A pr tracking electron menubar application

![Screen Shot 2020-04-13 at 9 26 10 AM](https://user-images.githubusercontent.com/39171685/79133271-fa70f900-7d68-11ea-8552-043a010f6526.png)
![Screen Shot 2020-04-13 at 9 26 30 AM](https://user-images.githubusercontent.com/39171685/79133274-fba22600-7d68-11ea-82e9-286b1d65ab5d.png)


## Installation

Make sure yarn is installed:
```
brew install yarn
```

Install `parcel-bundler`
```
yarn global add parcel-bundler
```

Build project
```
yarn build
```

Run app
```
yarn start
```

## Configuration

`~/.status-app-config.js`

## Usage
Hotkeys:

### Any Page

| Combo | Action |
|-------|--------|
| `Cmd+N` | Add pull |
| `escape` | hides pulls window |
| `Cmd+Shift+P` (can be run globally) | shows pulls window |

### Pr List

| Combo | Action |
|-------|--------|
| `Cmd+Click` on pr list item | Opens pr in github |
| `Cmd+l` | Focus search bar |
| `Cmd+Shift+]` | Go right a tab |
| `Cmd+Shift+[` | Go left a tab |

### Pr Detail

| Combo | Action |
|-------|--------|
| `Backspace` | Back to main page |
| `g` | Open in github |
| `t` | Open in terminal |
| `c` | Open in VS Code |
