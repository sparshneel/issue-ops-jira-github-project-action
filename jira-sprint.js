const core = require('@actions/core');

async function createSprint(sprint, jiraClient){
    jiraClient.sprint.createSprint(sprint).then(res => {
        console.log(res)
        return res
    }).catch(err => {
        console.log(err)
        throw err
    })
}

async function updateSprint(sprint, jiraClient) {
    switch (sprint.operation) {
        case 'START':
            jiraClient.getSprint(sprint.id).then(res => {
                jiraClient.sprint.updateSprint({
                    id: sprint.id, status: 'active'
                }).then(res => {
                    jiraClient.sprint.moveIssuesToSprintAndRank(sprint.id, sprint.issues).then(res => {
                        console.log("issues moved to sprint : " + sprint.id)
                    }).catch(err => {
                        console.log(err)
                        return {
                            message: "Sprint is started, there is an error moving issues to the sprint",
                            sprintId: sprint.id,
                            issues: sprint.issues,
                            error: err.message
                        }
                    })
                    return {
                        message: "Sprint started successfully",
                        sprintId: sprint.id,
                        issues: sprint.issues
                    }
                }).catch(err => {
                    console.log(err)
                    return {
                        message: "Error starting sprint",
                        sprintId: sprint.id,
                        error: err.message
                    }
                });
            }).catch(err => {
                console.log("Sprint not found sprint id : " + sprint.id);
                return  {
                    message: "Error starting sprint",
                    sprintId: sprint.id,
                    error: err.message
                }
            })
            break;
        case 'CLOSE':
            // Get issues(status InProgress, To-Do) for sprint to be moved to backlog
            const issues = []
            jiraClient.board.getAllSprints({
                boardId: sprint.boardId,
                state: 'active'
            }).then(res => {
               res.values.forEach(sprint => {
                   jiraClient.sprint.getIssuesForSprint({
                       sprintId: sprint.id, jql: "status IN ('In Progress', 'To Do')", validateQuery: true
                   }).then(res => {
                       res.issues.forEach(issue => {
                           issues.push(issue.id)
                       })
                   }).catch(err => {
                       console.log("Error fetching issues for the sprint : " + sprint.id)
                       core.setFailed(JSON.stringify({
                           message: "Error fetching issues for the sprint",
                           sprintId: sprint.id,
                           error: err.message
                       }))
                   })
               })
            }).catch(err => {
                console.log("Error fetching the active sprint for the board : " + sprint.boardId)
                core.setFailed(JSON.stringify({
                    message: "Error fetching the active sprint for the board",
                    boardId: sprint.boardId,
                    error: err.message
                }))
            })


            // move issues to backlog
            jiraClient.backlog.moveIssuesToBacklog({
                issues: issues,
            }).then(res => {
                console.log("issues moved to backlog for sprint : " + sprint.id)
            }).catch(err => {
                console.log("Error moving issues to backlog for sprint : " + sprint.id)
                return  {
                    message: "error moving issues to sprint, the sprint cannot be marked as closed",
                    sprintId: sprint.id,
                    openIssues: issues,
                    error: err.message
                }
            })

            // update sprint status to close
            jiraClient.sprint.updateSprint({
                id: sprint.id, status: 'closed'
            }).then(res => {
                console.log("sprint status updated to closed for sprint : " + sprint.id)
                return {
                    message: "Sprint closed successfully, the open issues have been moved to backlog",
                    sprintId: sprint.id,
                    openIssues: issues
                }
            }).catch(err => {
                console.log("Error updating sprint status to closed for sprint : " + sprint.id)
                return {
                    message: "Error updating sprint status to closed",
                    sprintId: sprint.id,
                    openIssues: issues,
                    error: err.message
                }
            })
            break;

        case 'GENERATE_ISSUE_LIST':
            const issueList = []
            jiraClient.board.getAllSprints({
                boardId: sprint.boardId,
                state: 'active'
            }).then(res => {
                res.values.forEach(sprint => {
                    jiraClient.sprint.getIssuesForSprint({
                        sprintId: sprint.id, jql: "status IN ('In Progress', 'To Do')", validateQuery: true
                    }).then(res => {
                        res.issues.forEach(issue => {
                            issueList.push(issue.id)
                        })
                    })
                })
                // generate and email the issue list
                console.log(issueList)
            }).catch(err => {
                console.log("Error generating issue list for the sprint : " + sprint.boardId)
                return {
                    message: "Error generating issue list for the active sprint, on the board",
                    sprintId: sprint.boardId,
                    error: err.message
                }
            })
            break;

        default:
            break;
    }
}

async function getSprint(sprint, jiraClient)  {
    jiraClient.sprint.getSprint(sprint).then(res => {
        console.log(res)
        return res
    }).catch(err => {
        console.log(err)
        throw err
    })
}

export {createSprint, updateSprint, getSprint}