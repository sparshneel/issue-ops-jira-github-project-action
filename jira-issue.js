const core = require('@actions/core');

exports.createIssue = async (issue,jiraClient) => {
    await jiraClient.issues.createIssue(issue).then(res => {
        console.log(res)
        return res
    }).catch(error => {
        console.log(error)
        throw error
    })
}

exports.updateIssue = async (issue,jiraClient) => {
    await jiraClient.issues.editIssue(issue).then(res => {
        console.log(res)
        return res
    }).catch(error => {
        console.log(error)
        throw error
    })
}

exports.getIssue = async (issueId,jiraClient) => {
    jiraClient.getIssue(issueId).then(res => {
        console.log(res)
        return res
    }).catch(error => {
        console.log(error)
        throw error
    })
}