# Project Agent Guidelines

## Module Testing Standard

- Use docker-based test execution for module containers.
- For module container packages, set `scripts.test` to build and run tests in Docker using each module's `Dockerfile.test`.
- Prefer this pattern for module test commands:

```sh
docker build -f ./Dockerfile.test -t bug-module-test ../../../.. && docker run --rm --name bug-module-test-run bug-module-test npx jest --runInBand --config ./jest.config.cjs
```

## Module Container Quick Check Profile

- Purpose: run a quick agentic pre-commit check in chat before major module container changes are committed.
- Use trigger phrase in chat: Run the module container quick check before commit.

### Implementation Defaults

- Rule: keep worker restart checks aligned to real config dependencies.
- Rule: default to simple, readable implementations over maximum efficiency; only optimize for performance when there is a clear, measured requirement.
- Rule: prefer the simplest safe fix first, with minimal code changes.
- Rule: prefer no backward compatibility in new code; avoid aliases/shims/migration layers unless explicitly requested.
- Rule: never add regression tests for changes unless a task explicitly asks for them.

### API and Service Patterns

- Rule: in module containers, prefer service-layer throw-on-error and keep routes thin; let express-async-handler propagate thrown/rejected errors via middleware instead of route-level `{ error }` handling.
- Rule: in module containers, services should return raw payloads (object/array/value), not `{ data: ... }`; route handlers should wrap service results in API response envelopes.

### Worker Architecture

- Rule: in Cisco SG/CBS module migrations, keep non-SNMP workers (for example password-expiry SSH checks and DHCP-source polling) as separate workers; do not fold them into the SNMP task worker.
- Rule: across all modules, separate workers by connection method (for example SNMP, SSH, HTTP/API, RouterOS) and keep them as distinct workers.
- Rule: across all modules, separate capability-handling workers (for example DHCP/leases discovery) from core telemetry/control workers; do not fold capability workers into unrelated polling workers.

### Logging Conventions

- Rule: prefer logs without filename-style prefixes in worker and task messages (for example avoid `worker-...:` labels in log text).
- Rule: in `src/modules/*/container`, all runtime files should use the logger module, except `api/app.js` and `api/server.js`.
- Rule: use `logger.debug` for worker and worker task operational messages to reduce visual noise.
- Rule: use `logger.info` for normal service action logs.
- Rule: use `logger.warning` when actions fail but execution can continue.
- Rule: use `logger.error` for exceptions and critical failures.

### Runtime Exceptions

- Rule: never add `version:` at the top of docker-compose.yml or docker-compose.development.yml (Compose 2+ does not need it).
- Rule: keep `api/app.js` error middleware behavior as-is, including `errorLocation`, unless a task explicitly asks to change it.
- Rule: keep `api/server.js` using `console.log` for startup and uncaught exception output unless a task explicitly asks to change it.

### Validation Checklist

- Rule: keep syntax smoke tests generic by discovering service files dynamically where possible (for example `services/services.syntax.test.js`).
- Check: run an unused-file reference sweep before deleting files (for example `find` + `grep` across `.js`, `.json`, and `.md`, excluding `node_modules`).
- Check: run module container tests with Docker (`npm test` in the module container).
- Check: verify worker restart triggers match real config keys used by each worker.
- Check: verify worker/task log messages avoid filename-style prefixes.
- Check: run logger policy audit across container runtime files before major commits.
- Maintenance: add future items as new single-line bullets prefixed with `Rule:` or `Check:`.

### Logger Audit Command

Use this one-liner from the container folder to quickly find policy violations:

```sh
node -e 'const fs=require("fs"),path=require("path");const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.name==="node_modules"?[]:e.isDirectory()?walk(path.join(d,e.name)):e.isFile()&&e.name.endsWith(".js")?[path.join(d,e.name)]:[]);const root=process.cwd();const files=walk(root).map(p=>path.relative(root,p).replace(/\\\\/g,"/")).filter(f=>!f.endsWith(".test.js")&&!f.endsWith(".spec.js"));const skip=new Set(["api/app.js","api/server.js"]);for(const f of files){const t=fs.readFileSync(path.join(root,f),"utf8");if(!skip.has(f)&&/console\\.(log|error|warn|info)\\(/.test(t))console.log("console:",f);if(!skip.has(f)&&!/require\\(["\x27]@core\\/logger["\x27]\\)\\(module\\)/.test(t))console.log("missing logger:",f);if(f.startsWith("workers/")&&/logger\\.(info|warning|error)\\(/.test(t))console.log("worker non-debug:",f);if(f.startsWith("services/")&&/logger\\.debug\\(/.test(t))console.log("service debug:",f);} '
```
