import core  from '@actions/core';
import  {Version3Client}  from 'jira.js'
import {createIssue, updateIssue} from './jira-issue.js'
import {createSprint, updateSprint}  from './jira-sprint.js'

const jiraClient = new Version3Client({
    host: core.getInput('JIRA_HOST'),
    authentication: {
        basic: {
            email: core.getInput('JIRA_USER_EMAIL'),
            apiToken: core.getInput('JIRA_API_TOKEN')
        }
    }
})

switch (core.getInput('JIRA_ISSUE_OPERATION')) {
    case 'CREATE_ISSUE':
        createJiraIssue();
        break;

    case 'UPDATE_ISSUE':
        updateJiraIssue();
        break;

    case 'CREATE_SPRINT':
        createJiraSprint();
        break;

    case 'UPDATE_SPRINT':
        updateJiraSprint();
        break;

    default:
        console.log('No operation specified or unknown operation')
        break;
}

async function createJiraIssue() {
    const issue = JSON.parse(core.getInput('JIRA_JSON_INPUT'))
    await createIssue(issue, jiraClient).catch(error => {
        core.setFailed(JSON.stringify({
            message: "error creating the JIRA issue",
            error_attributes: {
                project: issue.fields.project,
                issue_Type: issue.fields.issueType,
                issue_operation: issue.operation,
            },
            error_code: 10001,
            error: error.message
        }))
    })
}

async function updateJiraIssue() {
    const issue  = JSON.parse(core.getInput('JIRA_JSON_INPUT'))
    await updateIssue(issue, jiraClient).catch(error => {
        core.setFailed(JSON.stringify({
            message: "error updating the JIRA issue",
            error_attributes: {
                project: issue.fields.project,
                issue_Type: issue.fields.issueType,
                issue_operation: issue.operation,
            },
            error_code: 10002,
            error: error.message
        }))
    })
}

async function createJiraSprint() {
    const sprint = JSON.parse(core.getInput('JIRA_JSON_INPUT'))
    await createSprint(sprint, jiraClient).catch(error => {
        core.setFailed(JSON.stringify({
            message: "error creating the JIRA sprint",
            error_attributes: {
                project: sprint.fields.project
            },
            error_code: 20001,
            error: error.message
        }))
    })
}

async function updateJiraSprint() {
    const sprint = JSON.parse(core.getInput('JIRA_JSON_INPUT'))
    await updateSprint(sprint, jiraClient).catch(error => {
        core.setFailed(JSON.stringify({
            message: "error updating the JIRA sprint",
            error_attributes: {
                project: sprint.fields.project
            },
            error_code: 20002,
            error: error.message
        }))
    })
}

