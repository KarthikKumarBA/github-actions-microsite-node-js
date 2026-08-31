# GitHub Actions Micro Site CI/CD

A simple Node.js microsite demonstrating an automated GitHub Actions CI/CD pipeline with DEV, UAT and PROD deployments to GitHub Pages.

## Developer Workflow

Developers should create a feature branch from the latest `main` branch.

```bash
git checkout main
git pull origin main

git checkout -b feature/my-change
```

Make the required code changes and test locally.

```bash
npm ci
npm run lint
npm run lint:html
npm run format:check
npm run test:coverage
npm run build
```

Commit and push the changes.

```bash
git add .
git commit -m "feat: describe the change"
git push -u origin feature/my-change
```

Create a Pull Request:

```text
feature/my-change → main
```

## Pull Request Details

Complete the PR template before requesting review.

Provide:

- Summary of the change
- Testing performed
- Deployment impact
- Security impact
- Rollback plan

The PR cannot be merged until the required validations and approvals are completed.

## PR Validation

When a PR is raised against `main`, GitHub Actions automatically runs:

```text
Pull Request
     │
     ├── Lint / HTMLHint / Prettier
     ├── Unit Tests + Coverage
     ├── Build
     ├── SonarQube
     ├── Trivy
     └── CodeQL
```

If a required check fails, fix the issue and push the changes to the same feature branch.

GitHub Actions will automatically validate the new commit.

## Merge and Release

After all required checks and PR approvals pass, merge the PR into `main`.

A merge to `main` automatically starts the Release CI pipeline.

```text
Merge to main
      ↓
Build + Test
      ↓
Security Validation
      ↓
Create Version
      ↓
Create Artifact
      ↓
Publish GitHub Release
```

Example release:

```text
Version: 1.0.66
Artifact: microsite-1.0.66.zip
```

The same validated release artifact is promoted between environments.

## Deployment Flow

After Release CI completes successfully, the release is automatically deployed to DEV.

```text
Release CI
    ↓
DEV - Automatic
    ↓
UAT - Manual + Approval
    ↓
PROD - Manual + Approval
```

Environment URLs:

```text
DEV
https://karthikkumarba.github.io/github-actions-microsite-node-js/dev/

UAT
https://karthikkumarba.github.io/github-actions-microsite-node-js/uat/

PROD
https://karthikkumarba.github.io/github-actions-microsite-node-js/
```

## Deployment Validation

After deployment, the pipeline performs:

```text
Deploy
  ↓
Health Check
  ↓
Playwright Test
  ↓
Deployment Validation
```

Only successful deployments are recorded as successful deployment state.

## Production Rollback

PROD supports rollback to a version that was previously successfully deployed to PROD.

From **Actions → Deploy → Run workflow**, select:

```text
Action: rollback
Environment: prod
Version: <previous PROD version>
```

If the version is left empty, the pipeline uses the previous PROD version.

Rollback still requires PROD approval and post-deployment validation.

## Deployment Evidence

Deployment and validation evidence is available in GitHub through:

- GitHub Actions workflow runs
- Job summaries
- Test and security results
- Build artifacts
- GitHub Releases
- Environment approvals
- GitHub deployment history
- Playwright reports
- DEV/UAT/PROD URLs

## Pipeline Summary

```text
Developer
   ↓
Feature Branch
   ↓
Pull Request
   ↓
CI + Tests + Security
   ↓
Review / Approval
   ↓
Merge to main
   ↓
Release CI
   ↓
GitHub Release
   ↓
DEV
   ↓
UAT Approval
   ↓
UAT
   ↓
PROD Approval
   ↓
PROD
```

**Build once. Validate once. Promote the same release artifact across environments.**