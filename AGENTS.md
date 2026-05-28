# Project Agent Guidelines

## Module Testing Standard

- Use docker-based test execution for module containers.
- For module container packages, set `scripts.test` to build and run tests in Docker using each module's `Dockerfile`.
- Prefer this pattern for module test commands:

```sh
docker build -f ./Dockerfile -t bug-module-test ../../../.. && docker run --rm --name bug-module-test-run bug-module-test npx jest --runInBand --config ./jest.config.cjs
```

## Scope

- Applies project-wide to modules under `src/modules/*/container`.
