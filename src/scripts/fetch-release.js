document.addEventListener('DOMContentLoaded', () => {
  const repoOwner = 'gridstack' // Replace with the GitHub username or organization
  const repoName = 'gridstack.js' // Replace with the repository name

  // GitHub API URL for the latest release
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`

  // Fetch the latest release data from the GitHub API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`)
      }
      return response.json()
    })
    .then((data) => {
      // Update the document title to the name of the latest release
      document.title = data.name

      // Update the content of the <span> element with id "release-version"
      const releaseVersionElement = document.getElementById('release-version')
      releaseVersionElement.textContent = data.name
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error)
      const releaseVersionElement = document.getElementById('release-version')
      releaseVersionElement.textContent = 'Error loading release'
    })
})
