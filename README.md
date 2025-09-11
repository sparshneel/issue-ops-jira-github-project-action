Jira Integration GitHub Action
This GitHub Action allows you to automatically transition a Jira issue based on events in your GitHub workflow, such as a pull request being merged. It is built to streamline your development process by keeping your Jira tickets in sync with your codebase.

!

Features
Transition a Jira issue to a specified status.

Add a comment to a Jira issue.

Automatically identifies the Jira issue key from a pull request title or branch name.

Setup
1. Create a Jira API Token
To authenticate with the Jira API, you need to create an API token.

Log in to Jira.

Navigate to your Atlassian account page: https://id.atlassian.com/manage-profile/security/api-tokens.

Click "Create API token".

Give the token a label (e.g., "GitHub Actions") and click "Create".

Copy the token. This is the only time you'll be able to see it.

2. Configure GitHub Secrets
Store your Jira credentials and API token securely in your GitHub repository's secrets.

In your GitHub repository, go to Settings > Secrets and variables > Actions.

Click "New repository secret".

Create the following secrets:

JIRA_URL: Your Jira instance URL (e.g., https://your-company.atlassian.net).

JIRA_USERNAME: Your Atlassian email address.

JIRA_TOKEN: The API token you just created.

Usage
This action can be used in your workflow file (e.g., .github/workflows/your-workflow.yml). The most common use case is to transition a Jira issue when a pull request is merged.

Example Workflow
name: CI/CD

on:
  pull_request:
    types:
      - closed
    branches:
      - main

jobs:
  update-jira-issue:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - name: Update Jira Issue
        uses: your-github-username/your-repo-name@v1 # Replace with your repo details
        with:
          jira-url: ${{ secrets.JIRA_URL }}
          jira-username: ${{ secrets.JIRA_USERNAME }}
          jira-token: ${{ secrets.JIRA_TOKEN }}
          # The Jira issue key will be automatically detected from the PR title or branch name.
          # For example, a PR titled "FEAT-1234: Add new feature" will transition the issue "FEAT-1234".
          new-status: "Done" # The name of the status to transition the issue to
          comment: "This issue has been closed by pull request ${{ github.event.pull_request.number }}"

Inputs
Name

Required

Description

jira-url

Yes

The base URL of your Jira instance (e.g., https://my-company.atlassian.net).

jira-username

Yes

The email address of your Jira account.

jira-token

Yes

The API token for authentication.

new-status

No

The name of the status to transition the issue to (e.g., "In Progress", "Done").

issue-key

No

The specific Jira issue key (e.g., PROJ-123). If not provided, it is automatically parsed from the branch or PR title.

comment

No

A comment to add to the Jira issue.

Outputs
This action does not produce any specific outputs that can be used in subsequent steps of a workflow.
