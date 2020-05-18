---
id: project_layout
title: Project Layout
sidebar_label: Project Layout
---

The basic layout for the swapchain project.

### `/build`

Scripts and tools for building, packaging and deployment.

### `/docs`

Design and user documentation hosted on netlify.

### `/pkg`

Shared code that multiple services depend upon.

### `/srv`

Contains a subdirectory for each service. Services must be independent of each other and communicated using a predefined API.

### `/test`

- Additional tests
- Fixtures
- Common test setup
- Mocks

### `/tmp`

A place for temporary files so they can be in version control.
They should get moved to their appropriate place asap.

This list is inspired by [golang's project layout](https://github.com/golang-standards/project-layout/blob/master/README.md).
