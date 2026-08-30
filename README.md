# GitHub Actions Microsite CI/CD

A simple Node.js static microsite demonstrating an enterprise-style CI/CD pipeline using GitHub Actions, reusable workflows, automated testing, SonarQube Cloud, Trivy security scanning, pull request controls, approval gates, and GitHub Pages deployment.

---

## Project Objective

The objective of this project is to demonstrate a production-style GitHub Actions CI/CD design for a simple static microsite.

The pipeline validates pull requests before they can be merged into `main` and automatically deploys approved changes to GitHub Pages after successful CI and security validation.

The application itself is intentionally simple so the focus remains on CI/CD architecture, security controls, reusable workflows, governance, and deployment.

---

## Technology Stack

### Application

- HTML
- CSS
- JavaScript
- Node.js

### CI/CD

- GitHub Actions
- Reusable GitHub Actions workflows
- GitHub Pages
- GitHub Environments

### Code Quality

- ESLint
- HTMLHint
- Prettier

### Testing

- Jest
- JavaScript unit tests
- Code coverage

### Security

- SonarQube Cloud
- Sonar Quality Gate
- Trivy filesystem vulnerability scanning

### Governance

- Pull requests
- Required status checks
- Required approvals
- CODEOWNERS
- Branch rulesets
- Protected production environment

---

## Repository Structure

```text
github-actions-microsite-node-js/
│
├── .github/
│   ├── workflows/
│   │   ├── pr.yml
│   │   ├── main.yml
│   │   ├── reusable-ci.yml
│   │   ├── reusable-security.yml
│   │   └── reusable-pages-deploy.yml
│   │
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   │
│   └── PULL_REQUEST_TEMPLATE/
│       └── pull_request_template.md
│
├── src/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── tests/
│   └── app.test.js
│
├── .gitignore
├── .htmlhintrc
├── .prettierrc
├── eslint.config.js
├── jest.config.js
├── sonar-project.properties
├── package.json
├── package-lock.json
└── README.md
```

---

# CI/CD Architecture

```text
Developer
    │
    ▼
Feature Branch
    │
    ▼
Pull Request → main
    │
    ├─────────────────────────────┐
    │                             │
    ▼                             ▼
CI Validation               Security Validation
    │                             │
    ├── npm ci                    ├── Trivy Scan
    ├── ESLint                    │
    ├── HTMLHint                  └── SonarQube Cloud
    ├── Prettier                         │
    ├── Jest                             ▼
    ├── Coverage                   Quality Gate
    └── Build                            │
    │                                    │
    └────────────────┬───────────────────┘
                     │
                     ▼
              Required Checks
                     │
                     ▼
              Reviewer Approval
                     │
                     ▼
                Merge to main
                     │
                     ▼
              Production CI/CD
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Reusable CI          Reusable Security
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
               Build Artifact
                     │
                     ▼
              github-pages
               Environment
                     │
                     ▼
              Approval Gate
                     │
                     ▼
             GitHub Pages
```

---

# Pull Request Pipeline

The pull request workflow is defined in:

```text
.github/workflows/pr.yml
```

It runs when a pull request targets the `main` branch.

Supported PR events include:

```text
opened
synchronize
reopened
ready_for_review
```

The PR pipeline performs validation only.

It does **not deploy the application**.

The PR workflow calls reusable workflows for CI and security validation.

---

# Reusable CI Workflow

The reusable CI workflow is located at:

```text
.github/workflows/reusable-ci.yml
```

It uses:

```yaml
on:
  workflow_call:
```

This allows the same CI implementation to be called by multiple workflows without duplicating pipeline logic.

The CI workflow performs:

```text
Checkout Repository
        ↓
Setup Node.js
        ↓
npm ci
        ↓
ESLint
        ↓
HTMLHint
        ↓
Prettier Check
        ↓
Jest Unit Tests
        ↓
Coverage Validation
        ↓
Build Application
        ↓
Upload Coverage Artifact
        ↓
Upload Application Artifact
```

---

# Dependency Installation

The pipeline uses:

```bash
npm ci
```

instead of:

```bash
npm install
```

`npm ci` provides clean and repeatable dependency installation using `package-lock.json`, making it suitable for CI environments.

For this reason, `package-lock.json` is committed to the repository.

---

# Code Quality Checks

## ESLint

JavaScript source code is checked using ESLint.

```bash
npm run lint
```

---

## HTMLHint

HTML files are validated using HTMLHint.

```bash
npm run lint:html
```

---

## Prettier

Formatting is validated using:

```bash
npm run format:check
```

Developers can automatically format files locally using:

```bash
npm run format
```

---

# Unit Testing

Jest is used for unit testing.

Run tests using:

```bash
npm test
```

Run tests with coverage using:

```bash
npm run test:coverage
```

The current project enforces minimum coverage thresholds.

Example:

```text
Statements   >= 50%
Branches     >= 50%
Functions    >= 50%
Lines        >= 50%
```

If coverage falls below the configured threshold, the pipeline fails.

---

# Local CI Validation

Before raising a pull request, developers can execute the same primary checks locally.

Install dependencies:

```bash
npm ci
```

Run the complete local CI validation:

```bash
npm run ci
```

The command executes:

```text
ESLint
    ↓
HTMLHint
    ↓
Prettier
    ↓
Jest + Coverage
    ↓
Build
```

---

# Build

The static application is built using:

```bash
npm run build
```

Generated files are written to:

```text
dist/
```

Example:

```text
dist/
├── index.html
├── style.css
└── app.js
```

The `dist/` directory is generated automatically and is therefore excluded from Git using `.gitignore`.

---

# Build Artifacts

The reusable CI workflow uploads the generated application as a GitHub Actions artifact.

Artifact name:

```text
microsite-build
```

The coverage report is also uploaded separately.

Artifact name:

```text
coverage-report
```

Artifacts provide evidence that the build completed successfully and allow later pipeline stages to consume the generated output.

---

# Security Pipeline

Security validation is implemented through:

```text
.github/workflows/reusable-security.yml
```

The reusable security workflow performs:

```text
Security Validation
        │
        ├── Trivy Security Scan
        │
        └── SonarQube Cloud
                 │
                 ├── Static Analysis
                 ├── Coverage Analysis
                 └── Quality Gate
```

---

# Trivy Security Scanning

Trivy performs filesystem and dependency vulnerability scanning.

The pipeline checks for:

```text
HIGH
CRITICAL
```

severity vulnerabilities.

The scan is configured to fail the workflow when matching vulnerabilities are detected.

This prevents known high-risk dependency vulnerabilities from silently progressing through the delivery pipeline.

---

# SonarQube Cloud

SonarQube Cloud is used for static code analysis and quality validation.

Configuration is stored in:

```text
sonar-project.properties
```

Example:

```properties
sonar.projectKey=github-actions-mircosite-node-js
sonar.organization=YOUR_SONAR_ORGANIZATION_KEY

sonar.sources=src
sonar.tests=tests

sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.sourceEncoding=UTF-8

sonar.exclusions=node_modules/**,dist/**,coverage/**
sonar.coverage.exclusions=tests/**
```

Replace:

```text
YOUR_SONAR_ORGANIZATION_KEY
```

with the actual SonarQube Cloud organization key.

---

# Sonar Quality Gate

After analysis, the pipeline checks the SonarQube Quality Gate.

The expected control is:

```text
Sonar Analysis
      ↓
Quality Gate
      │
  ┌───┴────┐
  │        │
 PASS     FAIL
  │        │
  ▼        ▼
Allow    Block
Pipeline Pipeline
```

A failed Quality Gate causes the GitHub Actions security job to fail.

When configured as a required status check, this prevents the pull request from being merged.

---

# GitHub Secret

The pipeline requires the following repository secret:

```text
SONAR_TOKEN
```

Configure it under:

```text
Repository
→ Settings
→ Secrets and variables
→ Actions
→ New repository secret
```

The SonarQube Cloud URL is:

```text
https://sonarcloud.io
```

The Sonar token must never be committed to the repository.

---

# Production Pipeline

Production CI/CD is defined in:

```text
.github/workflows/main.yml
```

The production workflow runs when changes are pushed or merged into:

```text
main
```

It can also be manually triggered using:

```yaml
workflow_dispatch:
```

This is useful for controlled manual execution and troubleshooting.

---

# Production Deployment Flow

```text
Merge PR
   ↓
main
   ↓
Production CI/CD
   │
   ├───────────────┐
   │               │
   ▼               ▼
Reusable CI    Reusable Security
   │               │
   └───────┬───────┘
           │
           ▼
      All Checks Pass
           │
           ▼
     Production Deploy
           │
           ▼
 github-pages Environment
           │
           ▼
      Approval Gate
           │
           ▼
     GitHub Pages
```

Deployment only runs when both CI and security validation succeed.

---

# GitHub Pages Deployment

Deployment logic is stored in:

```text
.github/workflows/reusable-pages-deploy.yml
```

The deployment workflow:

```text
Downloads Build Artifact
        ↓
Configures GitHub Pages
        ↓
Creates Pages Artifact
        ↓
Deploys GitHub Pages
```

The production environment is:

```text
github-pages
```

---

# Least-Privilege Permissions

The general CI pipeline uses read-only repository access where possible.

Example:

```yaml
permissions:
  contents: read
```

The GitHub Pages deployment workflow receives only the additional permissions required for deployment:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

This follows the principle of least privilege.

---

# Production Environment Controls

The deployment job uses:

```yaml
environment:
  name: github-pages
```

The `github-pages` environment can be configured with required reviewers.

Expected flow:

```text
CI Passed
   ↓
Security Passed
   ↓
Deployment Requested
   ↓
Waiting for Approval
   ↓
Required Reviewer
   ↓
Approve
   ↓
Production Deployment
```

This provides separation between automated validation and production release authorization.

---

# Branch Protection / Ruleset

The `main` branch should be protected using a GitHub branch ruleset.

Recommended controls:

```text
Require a pull request before merging

Require pull request approvals

Require review from Code Owners

Dismiss stale pull request approvals

Require status checks to pass

Require conversation resolution

Block force pushes

Restrict branch deletion
```

Direct production changes should be made through pull requests instead of direct pushes to `main`.

---

# Required Status Checks

After the workflows have executed at least once, configure their GitHub-generated checks as required status checks for `main`.

Examples include checks representing:

```text
CI Validation / Build and Test

Security Validation / Trivy Security Scan

Security Validation / SonarQube Cloud Analysis
```

The exact names should be selected from the status checks GitHub exposes after the workflows run.

A pull request should not be mergeable when required checks fail.

---

# CODEOWNERS

Repository ownership is configured through:

```text
.github/CODEOWNERS
```

Example:

```text
* @YOUR-GITHUB-USERNAME

.github/workflows/ @YOUR-GITHUB-USERNAME

sonar-project.properties @YOUR-GITHUB-USERNAME
```

When CODEOWNER review is required by branch protection, changes to sensitive pipeline files require approval from the configured owner.

---

# Pull Request Template

A standard pull request template is included under:

```text
.github/PULL_REQUEST_TEMPLATE/pull_request_template.md
```

The template captures:

```text
Change description
Change type
Validation performed
Testing evidence
Deployment impact
Security impact
Rollback plan
```

This provides consistent change documentation.

---

# Dependabot

Dependabot configuration is located at:

```text
.github/dependabot.yml
```

It monitors:

```text
npm dependencies
GitHub Actions dependencies
```

and can automatically create pull requests when dependency updates are available.

---

# Concurrency Control

Pull request pipelines use concurrency control so outdated runs can be cancelled when a developer pushes another commit to the same PR.

Conceptually:

```text
Commit 1
   ↓
Pipeline Running

Commit 2 pushed
   ↓
Cancel old pipeline
   ↓
Run latest pipeline
```

Production deployment uses a separate concurrency group to prevent overlapping production releases.

---

# Enterprise CI/CD Controls Demonstrated

This project demonstrates the following production-oriented controls:

| Control | Implementation |
|---|---|
| Pull Request Validation | GitHub Actions |
| Reusable Workflows | `workflow_call` |
| Repeatable Dependency Installation | `npm ci` |
| JavaScript Linting | ESLint |
| HTML Validation | HTMLHint |
| Formatting | Prettier |
| Unit Testing | Jest |
| Coverage Gate | Jest Coverage |
| Static Analysis | SonarQube Cloud |
| Quality Gate | Sonar Quality Gate |
| Vulnerability Scanning | Trivy |
| Build Artifact | GitHub Actions Artifacts |
| Deployment | GitHub Pages |
| Production Environment | `github-pages` |
| Production Approval | Environment Reviewer |
| Least Privilege | GitHub Actions Permissions |
| Branch Governance | GitHub Rulesets |
| Code Ownership | CODEOWNERS |
| Dependency Updates | Dependabot |
| PR Documentation | Pull Request Template |
| Concurrency | GitHub Actions Concurrency |

---

# Developer Workflow

Developers should not work directly on `main`.

Create a feature branch:

```bash
git checkout main
git pull
git checkout -b feature/my-change
```

Make the required changes.

Run validation:

```bash
npm ci
npm run ci
```

Commit:

```bash
git add .
git commit -m "feat: update microsite"
```

Push:

```bash
git push -u origin feature/my-change
```

Then create:

```text
feature/my-change
        ↓
Pull Request
        ↓
main
```

The PR pipeline automatically validates the change.

---

# Merge and Deployment Process

The expected enterprise release process is:

```text
1. Developer creates feature branch

2. Developer makes changes 

3. Developer runs local validation

4. Developer pushes feature branch

5. Developer raises PR to main

6. GitHub Actions executes CI validation

7. GitHub Actions executes security validation

8. Sonar Quality Gate must pass

9. Trivy scan must pass

10. Required status checks must pass

11. Required reviewer approves PR

12. PR is merged into main

13. Production CI/CD workflow starts

14. CI executes again against main

15. Security validation executes again

16. Build artifact is prepared

17. Production deployment waits for environment approval

18. Reviewer approves production deployment

19. GitHub Pages deployment executes

20. Production URL is verified
```

---

# Failure Behaviour

The pipeline follows a fail-fast approach.

Examples:

```text
Lint Failure
      ↓
Pipeline Failed
      ↓
No Merge
```

```text
Unit Test Failure
      ↓
Pipeline Failed
      ↓
No Merge
```

```text
Sonar Quality Gate Failure
      ↓
Security Failed
      ↓
No Merge
```

```text
HIGH/CRITICAL Vulnerability
      ↓
Trivy Failed
      ↓
No Merge
```

```text
Production CI Failure
      ↓
Deployment Skipped
```

This ensures deployment occurs only after successful validation.

---

# Rollback Strategy

Because the microsite is stored in Git, production changes can be rolled back using a revert.

Example:

```bash
git revert <commit-sha>
git push origin main
```

The production workflow then rebuilds and deploys the reverted version.

For an enterprise implementation, rollback changes should normally follow the same pull request and approval controls rather than bypassing branch protection.

---

# Evidence of Successful Implementation

The following evidence should be captured for the technical test.

## Pull Request Evidence

Capture screenshots showing:

```text
PR opened against main

CI status checks

Unit tests passing

Coverage passing

Trivy scan passing

SonarQube analysis passing

Sonar Quality Gate passing

Required reviewer approval

Merge enabled only after checks pass
```

## SonarQube Evidence

Capture:

```text
SonarQube project dashboard

Quality Gate = Passed

Coverage

Bugs

Vulnerabilities

Code Smells
```

## GitHub Governance Evidence

Capture:

```text
main branch ruleset

Required pull request

Required approvals

Required status checks

CODEOWNER requirement
```

## Production Evidence

Capture:

```text
Production CI/CD workflow

CI successful

Security successful

Environment approval

GitHub Pages deployment successful

Production URL
```

---

# Expected Final Pipeline

```text
                    Developer
                        │
                        ▼
                  Feature Branch
                        │
                        ▼
                  Pull Request
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
       CI Validation        Security Validation
             │                     │
      ┌──────┼──────┐        ┌─────┴─────┐
      │      │      │        │           │
    Lint    Test   Build    Trivy       Sonar
             │                           │
          Coverage                  Quality Gate
             │                           │
             └────────────┬──────────────┘
                          │
                          ▼
                  Required Checks
                          │
                          ▼
                  CODEOWNER Review
                          │
                          ▼
                     PR Approval
                          │
                          ▼
                    Merge to main
                          │
                          ▼
                  Production CI/CD
                          │
               ┌──────────┴──────────┐
               ▼                     ▼
          Reusable CI         Reusable Security
               │                     │
               └──────────┬──────────┘
                          │
                          ▼
                     Build Artifact
                          │
                          ▼
                  Production Gate
                          │
                          ▼
                 Reviewer Approval
                          │
                          ▼
                  GitHub Pages Deploy
                          │
                          ▼
                    Production URL
```

---

# Conclusion

This project demonstrates how a simple static Node.js microsite can use enterprise-style CI/CD practices without unnecessarily complicating the application itself.

The implementation separates CI, security, and deployment responsibilities using reusable GitHub Actions workflows.

Pull requests are validated using automated quality checks, unit tests, coverage, SonarQube Cloud, and Trivy. Production deployment occurs only after successful validation and can be protected using GitHub environment approvals.

The overall design demonstrates:

- CI/CD automation
- Reusable workflows
- Shift-left testing
- Security scanning
- Quality gates
- Pull request governance
- Least-privilege permissions
- Production approval controls
- Automated GitHub Pages deployment
- Deployment traceability
