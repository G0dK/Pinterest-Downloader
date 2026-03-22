# Contributing to Pinterest Downloader

First off, thank you for considering contributing to Pinterest Downloader! It's people like you that make Pinterest Downloader such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) first to see if someone else has already created one. If not, go ahead and [make one](../../issues/new)!

## Fork & create a branch

If this is something you think you can fix, then [fork Pinterest Downloader](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-dark-mode
```

## Get the test suite running

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Make sure everything works as expected locally.

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

### Code Style Guidelines

- **Naming Conventions**: 
  - Variables and functions use `camelCase`.
  - Classes and React components use `PascalCase`.
  - Constants use `UPPER_SNAKE_CASE`.
- **Comments**: 
  - Use JSDoc for public methods.
  - Explain *why* something is done in complex logic blocks.
- **Styling**: We use Tailwind CSS. Please adhere to the existing utility-first styling patterns.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Pinterest Downloader's master branch:

```sh
git remote add upstream git@github.com:yourusername/pinterest-downloader.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-dark-mode
git rebase master
git push --set-upstream origin 325-add-dark-mode
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) :D

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

Thank you for contributing!
