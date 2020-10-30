[![eip1559-ui-ci Actions Status](https://github.com/abdelhamidbakhta/eip1559-ui/workflows/eip1559-ui-ci/badge.svg)](https://github.com/abdelhamidbakhta/eip1559-ui/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/abdelhamidbakhta/eip1559-ui/blob/master/LICENSE)
[![sonar-quality-gate][sonar-quality-gate]][sonar-url][![sonar-bugs][sonar-bugs]][sonar-url] [![sonar-vulnerabilities][sonar-vulnerabilities]][sonar-url]

# EIP-1559 UI

## What is it ?

This web interface comes with [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) testing features.

[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) introduces transaction pricing mechanism that includes fixed-per-block network fee that is burned and dynamically expands/contracts block sizes to deal with transient congestion.

## How to use it ?

### Install Prerequisites

- [npm](https://www.npmjs.com/) package manager

### Install the web interface

### Install from source

```shell script
npm install -g
```

### Run the web interface

```shell script
npm run serve
```

[sonar-url]: https://sonarcloud.io/dashboard?id=abdelhamidbakhta_eip1559-ui
[sonar-quality-gate]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_eip1559-ui&metric=alert_status
[sonar-coverage]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_eip1559-ui&metric=coverage
[sonar-bugs]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_eip1559-ui&metric=bugs
[sonar-vulnerabilities]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_eip1559-ui&metric=vulnerabilities

