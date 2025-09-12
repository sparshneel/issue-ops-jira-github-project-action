import  core  from '@actions/core';

async function createIssue  (issue,jiraClient)  {
    await jiraClient.issues.createIssue({
        key: issue.key,
        project: {
            id: core.getInput('JIRA_PROJECT')
        },
        issueType: issue.type,
        summary: issue.fields.summary,
    }).then(res => {
        console.log("Issues created successfully, project: " + issue.project + ", issue type: " + issue.type + ", issue key: " + issue.key)
        return {
            message: "Issues created successfully",
            project: issue.project,
            issueType: issue.type,
            issueId: issue.key
        }
    }).catch(error => {
        console.log("Error creating the issue, project: " + issue.project + ", issue type: " + issue.type + ", issue key: " + issue.key)
        core.setFailed(JSON.stringify({
            message: "Error creating the issue",
            project: issue.project,
            issueType: issue.type,
            issueId: issue.key
        }))
    })
}

async function updateIssue (issue,jiraClient) {
    switch (issue.operation) {
        case 'ADD_PR_DETAILS':
            // add PR link to the issue
            jiraClient.issueComments.addComment({
                issueIdOrKey: issue.id,
                comment: "PR link : " + issue.fields.pr.link
            }).then(res => {
                console.log("PR link added to the issue, id: " + issue.id)
            }).catch(error => {
                console.log("Error adding PR link to the issue, id: " + issue.id)
                return {
                    message: "Error adding PR link to the issue",
                    id: issue.id,
                    error: error.message
                }
            })
            // update PR reviewers label and PR review env label
            jiraClient.issues.editIssue({
                id: issue.id,
                fields: {
                    prReviewers: issue.fields.pr.pr_reviewers,
                    prReviewEnv: issue.fields.pr.pr_env
                }
            }).then(res => {
                console.log("PR reviewers and PR review env labels updated for the issue, id: " + issue.id)
            })

            return {
                message: "Issues updated successfully",
                issueId: issue.id
            }

        case 'UPDATE_ISSUE_STATUS':
            jiraClient.issues.editIssue({
                id: issue.id,
                fields: {
                    status: issue.fields.status
                }
            }).then(res => {
                console.log("Issue status updated for the issue, id: " + issue.id)
            }).catch(error => {
                console.log("Error updating issue status for the issue, id: " + issue.id)
                return {
                    message: "Error updating issue status",
                    id: issue.id,
                    error: error.message
                }
            })

            return {
                message: "Issues updated successfully",
                issueId: issue.id
            }

        default:
            console.log("No operation specified or unknown operation")
            break;
    }
}

export {createIssue, updateIssue}