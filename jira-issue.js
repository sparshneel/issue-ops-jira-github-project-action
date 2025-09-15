import  core  from '@actions/core';

async function createIssue  (issue,jiraClient)  {
    await jiraClient.issues.createIssue({
        fields:{
            issuetype: {
                name: issue.issue_type
            },
            summary: issue.summary,
            description: issue.description,
            project: {
                key: issue.project
            }
        }

    }).then(res => {
        console.log("Issues created successfully, project: " + issue.project + ", issue type: " + issue.issue_type)
        return {
            message: "Issues created successfully",
            project: issue.project,
            issueType: issue.issue_type
        }
    }).catch(error => {
        console.log("Error creating the issue, project: " + issue.project + ", issue type: " + issue.issue_type)
        core.setFailed(JSON.stringify({
            message: "Error creating the issue",
            project: issue.project,
            issueType: issue.issue_type
        }))
    })
}

async function updateIssue (issue,jiraClient) {
    switch (issue.operation) {
        case 'ADD_PR_DETAILS':
            // add PR link to the issue
            jiraClient.issueComments.addComment({
                issueIdOrKey: issue.id,
                comment: "PR link : " + issue.pr.link
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
                    prReviewers: issue.pr.pr_reviewers,
                    prReviewEnv: issue.pr.pr_env
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
                    status: issue.status
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