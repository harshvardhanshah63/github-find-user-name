class GitHub {
  constructor() {
    this.client_id = "your_github_client_id"
    this.client_secret = "your_github_client_secret"
    this.repos_count = 5
    this.repos_sort = "created: asc"
  }

  async getUser(user) {
    const profileResponse = await fetch(`https://api.github.com/users/${user}`)
    const repoResponse = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}`,
    )

    const profile = await profileResponse.json()
    const repos = await repoResponse.json()

    return {
      profile,
      repos,
    }
  }

  async getUserStats(user) {
    try {
      const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`)
      const repos = await reposResponse.json()

      if (repos.message) {
        throw new Error("User not found")
      }

      let totalStars = 0
      let totalForks = 0
      const languages = {}

      repos.forEach((repo) => {
        totalStars += repo.stargazers_count
        totalForks += repo.forks_count
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1
        }
      })

      return {
        totalRepos: repos.length,
        totalStars,
        totalForks,
        languages,
        repos: repos.slice(0, 10), // Top 10 repos
      }
    } catch (error) {
      throw error
    }
  }

  async getFollowers(user, page = 1) {
    const response = await fetch(`https://api.github.com/users/${user}/followers?per_page=30&page=${page}`)
    return await response.json()
  }

  async getFollowing(user, page = 1) {
    const response = await fetch(`https://api.github.com/users/${user}/following?per_page=30&page=${page}`)
    return await response.json()
  }
}
