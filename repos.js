;(function () {
  // TODO: polyfill this next-level 2015 stuff
  const names = [
    'konsumer',
    'brainbang',
    'authonice'
  ]

  function getrepos (org, page) {
    page = page || 1
    return fetch(`https://api.github.com/users/${org}/repos?per_page=100&page=${page}`)
      .then(res => res.json())
  }

  function showRepo (repo) {
    const section = repo.fork ? 'contrib' : repo.owner.login
    document.querySelector(`#gh_${section} ul`).innerHTML += `
      <li>
        <a href="${repo.html_url}">${repo.name}</a> &middot
        <small>${repo.description}</small>
      </li>
    `
    document.querySelector(`#c_${section}`).innerHTML =
      Number(document.querySelector(`#c_${section}`).innerHTML) +
      1
  }

  names.forEach(org => document.querySelector(`#gh_${org}`).innerHTML = 'Loading. Please wait.')
  document.querySelector(`#gh_contrib`).innerHTML = `<span id="c_contrib">0</span> repos.<ul></ul>`

  let fetches = names.map(org => getrepos(org)).concat([], [getrepos('konsumer', 2)])

  Promise.all(fetches).then(res => {
    names.forEach(org => {
      document.querySelector(`#gh_${org}`).innerHTML = `<span id="c_${org}">0</span> repos.<ul></ul>`
    })
    const allRepos = [].concat.apply([], res)
    allRepos
      .filter(repo => !repo.fork)
      .forEach(showRepo)
    allRepos
      .filter(repo => repo.fork)
      .forEach(showRepo)
  })
})()
