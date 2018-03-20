var minixhr = require('minixhr')

module.exports = getGithubData


/**************************************************************************
  MODULE DEFINITION
**************************************************************************/
function getGithubData (callback) {
  var url = 'https://api.github.com/repos/wizardamigos/profiles/forks'
  var results = []
  var allusers
  minixhr(makeURL(url), data => response(data, url))

  function response (json) {
    allusers = getData(url, json)
    allusers.forEach(function (nameEach) {
      var reponame = nameEach.owner.login
      var repoURL = `https://api.github.com/users/${reponame}/events/public`
      minixhr(makeURL(repoURL), data => response2(data, repoURL))
    })
  }

  function response2 (json, url) {
    var userPublishActivity = getData(url, json)
    var activities = userPublishActivity.map(x => ({
      repo: x.repo.name,
      url: x.repo.url,
      name: x.actor.login,
      time: x.created_at
    }))
    results.push(activities)
    if (allusers.length === results.length) callback(results)
    // userPublishActivity.forEach(function (activityDetail) {
    //   var repoActivity = activityDetail.repo.name
    //   var repoActiveURL = `https://github.com/${repoActivity}`
    //   minixhr(makeURL(repoActiveURL), data => response3(data, repoActiveURL))
    // })
  }

  // function response3 (json, url) {
  //   var userProjectCreateDate = getData(url, json)
  //   userProjectCreateDate.forEach(function (projectCreateDate) {
  //     var repoCreateDate = projectCreateDate.created_at
  //     results.push(repoCreateDate)
  //     if (allusers.length === results.length) callback(results)
  //   })
  // }


/**************************************************************************
  HELPERS
**************************************************************************/
function getData (url, json) {
  try {
    var data = JSON.parse(json)
    updateCache(url, data)
  } catch (e) {
    data = getResponseFromCache(url)
  }
  return data
}
function getResponseFromCache (url) {
  console.error('TOO MANY REQUESTS (fallback to cached activities)')
  return JSON.parse(window.localStorage[url])
}
function updateCache (url, data) {
  window.localStorage[url] = JSON.stringify(data)
}
  function makeURL (url) {
    // return url
    return 'https://cors-anywhere.herokuapp.com/' + url
  }
}
