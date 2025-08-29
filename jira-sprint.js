
exports.createSprint = async (sprint, jiraClient) => {
  jiraClient.sprint.createSprint(sprint).then(res => {
      console.log(res)
  }).catch(err => {
        console.log(err)
  })
}

exports.updateSprint = async (sprint, jiraClient) => {
    jiraClient.sprint.updateSprint(sprint).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

exports.getSprint = async (sprint, jiraClient) => {
    jiraClient.sprint.getSprint(sprint).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}