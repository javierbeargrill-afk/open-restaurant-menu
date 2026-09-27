# GitHub workflow

This project treats `main` as the stable public version.

## Why not edit main directly?

A restaurant website may be live and accepting orders. A broken change in `main` can immediately affect customers after GitHub Pages deploys.

So meaningful changes should be tested first.

## Recommended flow

```mermaid
flowchart LR
    ISSUE["1. Issue / idea"] --> BRANCH["2. Create branch"]
    BRANCH --> CHANGE["3. Make change"]
    CHANGE --> PR["4. Open Pull Request"]
    PR --> CHECK["5. Automated checks"]
    CHECK --> REVIEW["6. Review"]
    REVIEW --> MERGE["7. Merge"]
    MERGE --> DEPLOY["8. GitHub Pages deploy"]
```

## Example

A contributor wants to add scheduled pickup times.

They create:

`feature/scheduled-pickup`

They implement it, update documentation and open a Pull Request.

GitHub Actions validates the project.

A maintainer reviews the behavior and security.

Only then is it merged into `main`.

## Production restaurants

A real restaurant should not automatically accept every upstream community change.

Recommended:

```mermaid
flowchart LR
    UP["Open Restaurant Menu release"] --> PR["Update PR in restaurant repo"]
    PR --> TEST["Test ordering"]
    TEST --> APPROVE["Owner/maintainer approval"]
    APPROVE --> PROD["Production"]
```

This gives the restaurant the benefits of community improvements without surrendering control of production.
