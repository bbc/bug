## Changelog

### version 1.2.5

- 2026-07-21: fix db updating race conditions when updating labels ([44e3915](https://github.com/bbc/bug/commit/44e39153fcc7a5c898700ff6660f2f28aa1ba39d))
- 2026-07-21: add heartbeat status check and worker task [copilot] ([fdd3aff](https://github.com/bbc/bug/commit/fdd3affa31c91593231b7c709bab3af2627e1a56))

### version 1.2.4

- 2026-06-16: fix spurious error when disabling interface ([6d5c3e3](https://github.com/bbc/bug/commit/6d5c3e371577f32b1d82c3a4ac618ef6412ce54d))

### version 1.2.3

- 2026-06-06: fix stale lldp ([ad85642](https://github.com/bbc/bug/commit/ad8564220e5fa6c3cba0ce8bf74e03b73ba933bd))

### version 1.2.2

- 2026-06-02: fix parsing of interface counters in new firmware ([4a3d14a](https://github.com/bbc/bug/commit/4a3d14ae7777f903626b90cd8ead565494b6900a))

### version 1.2.1

- 2026-06-01: refactor workers, tidy services, fix multiple bugs, improve logging ([e78e98a](https://github.com/bbc/bug/commit/e78e98a32a9d4c5db9611d3b10526c6be66a6c40))
- 2026-06-01: remove unused files ([dc2451f](https://github.com/bbc/bug/commit/dc2451f94e5b4e7281e338e37a1d937c97b56caa))

### version 1.1.12

- 2026-05-28: fix typo ([89fb6ee](https://github.com/bbc/bug/commit/89fb6ee3a246ba2125ebc019fa1bf4af3886db80))

### version 1.1.11

- 2026-05-28: add tests ([4cb69d0](https://github.com/bbc/bug/commit/4cb69d070d6c7fa6070377f3622be43362de7016))
- 2026-05-28: add test framework ([1d4c175](https://github.com/bbc/bug/commit/1d4c175b184d333bcf9305ee5ddb9f23341fc5cd))

### version 1.1.10

- 2026-02-09: fix status timeouts ([993e81c](https://github.com/bbc/bug/commit/993e81c1700903597ad6efc18ea1c9e49838bac5))

### version 1.1.6

- 2026-02-09: service/util updates ([73e1f9e](https://github.com/bbc/bug/commit/73e1f9eaa87b8b5d1bd2e6a2ea571dbe39b94644))

### version 1.1.5

- 2026-02-06: improve service logging ([c70cf23](https://github.com/bbc/bug/commit/c70cf23a3aafecfc95dadb76e8436875e1f3b757))

### version 1.1.4

- 2026-02-05: fix status check timeouts ([63cbf43](https://github.com/bbc/bug/commit/63cbf43fa2a19625d6f3d3fb986f85c39271d616))

### version 1.1.3

- 2026-02-04: set pending flag on any change to update UI ([58494b4](https://github.com/bbc/bug/commit/58494b4f1b3c1adc34fcbfef42bd0e1fe1afaa7c))
- 2026-02-04: improve logging in status handlers ([a892bdd](https://github.com/bbc/bug/commit/a892bdd76aaa3963833262aaeff8e28287194c8d))
- 2026-02-04: refactor services with try/catch/throw ([471d8ee](https://github.com/bbc/bug/commit/471d8eeb1c57a008bc74852913c992d8adb65445))
- 2026-02-04: add default status check ([67c018b](https://github.com/bbc/bug/commit/67c018be3de76a089c7c599ea87a6cb175fe7e01))
- 2026-02-04: add README ([1e9bd70](https://github.com/bbc/bug/commit/1e9bd70ffe9a6c6612c2b530745f8e43e24368ca))

### version 1.1.2

- 2026-02-04: use mongo bulkwrite to improve performance ([8e8cb29](https://github.com/bbc/bug/commit/8e8cb29ebdaf6e751e0ffff0d177c20ce5480d0c))

### version 1.1.1

- 2026-02-04: improve performance of workers ([9713866](https://github.com/bbc/bug/commit/9713866367f208470f8a41bd55e939e5a67856e9))
- 2026-02-04: improve api route error handling ([2024cfe](https://github.com/bbc/bug/commit/2024cfe1f1caf6db2a84da9a7ff153b35427e143))

### version 1.1.0

- 2025-06-28 add support for poe

### version 1.0.0

- 2023-31-01: fix vlan range + remove debug
