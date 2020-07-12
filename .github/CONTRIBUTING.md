# Contributing to swapchain

## Git workflow

We use a 3 branch workflow.

- `master` is always in a production ready state and stores the official release history.
- `dev` serves as integration branch for all features.
- Feature branches must use `dev` as parent and should contain only a single new feature. After finishing work they get merged back into `dev`.

### Branching naming convention

All branches must be categorized and prefixed in the following way:

| branch prefix | Purpose                       |
| ------------- | ----------------------------- |
| `feature/`    | A new feature you want to add |
| `fix/`        | Bugfixes                      |
| `docs/`       | All documentation work        |
| `refactor/`   | No new features or bugs       |

You can read more over at [atlassian.com](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

## Quickstart

1.  Clone the repository

        git clone -b dev git@github.com:chronark/swapchain.git
        npm install

2.  Create a new feature branch from `dev`

        git checkout -b feature/my-new-feature

3.  Add your feature, tests and documentation.

4.  Push your branch to github.

5.  Submit a pull request into `dev`

## Programming style

We practice TDD and expect a 70% code coverage.

Please run your tests with `npm run test`.

As well as high test coverage we expect all functions and classes to be documented with [jsdoc3](https://jsdoc.app/) tags.

## Code style

We follow the [standardjs](https://standardjs.com/) style and lint our code with [eslint](https://eslint.org/).

Please use `npm run fmt` to lint your code.
