class UI {
  constructor() {
    this.profile = document.getElementById("profile")
    this.loading = document.getElementById("loading")
    this.error = document.getElementById("error")
    this.quickActions = document.getElementById("quickActions")
    this.statsDashboard = document.getElementById("statsDashboard")
    this.recentSearches = document.getElementById("recentSearches")
  }

  showProfile(user) {
    this.profile.innerHTML = `
            <div class="profile-card glass-effect fade-in-up">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <img src="${user.avatar_url}" alt="${user.name || user.login}" class="avatar-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzIiByeD0iNjAiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY2Ij4KPHA+VXNlcjwvcD4KPC9zdmc+Cjwvc3ZnPg=='">
                        <div class="avatar-ring"></div>
                    </div>
                    <div class="profile-info">
                        <h2 class="profile-name">${user.name || user.login}</h2>
                        <p class="profile-username">@${user.login}</p>
                        ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ""}
                        <div class="profile-stats">
                            <div class="stat-item">
                                <span class="stat-value">${user.public_repos}</span>
                                <span class="stat-label">Repositories</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${user.followers}</span>
                                <span class="stat-label">Followers</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${user.following}</span>
                                <span class="stat-label">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-details">
                    <div class="detail-grid">
                        ${
                          user.company
                            ? `
                            <div class="detail-item">
                                <span class="detail-icon">🏢</span>
                                <span class="detail-text">${user.company}</span>
                            </div>
                        `
                            : ""
                        }
                        ${
                          user.location
                            ? `
                            <div class="detail-item">
                                <span class="detail-icon">📍</span>
                                <span class="detail-text">${user.location}</span>
                            </div>
                        `
                            : ""
                        }
                        ${
                          user.blog
                            ? `
                            <div class="detail-item">
                                <span class="detail-icon">🌐</span>
                                <a href="${user.blog.startsWith("http") ? user.blog : "https://" + user.blog}" target="_blank" class="detail-link">${user.blog}</a>
                            </div>
                        `
                            : ""
                        }
                        ${
                          user.twitter_username
                            ? `
                            <div class="detail-item">
                                <span class="detail-icon">🐦</span>
                                <a href="https://twitter.com/${user.twitter_username}" target="_blank" class="detail-link">@${user.twitter_username}</a>
                            </div>
                        `
                            : ""
                        }
                        <div class="detail-item">
                            <span class="detail-icon">📅</span>
                            <span class="detail-text">Joined ${new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div class="profile-actions">
                    <a href="${user.html_url}" target="_blank" class="btn btn-primary">
                        <span>View on GitHub</span>
                        <span class="btn-icon">🔗</span>
                    </a>
                    <button class="btn btn-outline" onclick="shareProfile('${user.login}')">
                        <span>Share Profile</span>
                        <span class="btn-icon">📤</span>
                    </button>
                </div>
            </div>
        `
  }

  showRepos(repos, user) {
    if (repos.length === 0) {
      this.profile.innerHTML += `
                <div class="repos-section slide-in-up">
                    <div class="repos-header">
                        <div class="repos-avatar">
                            <img src="${user.avatar_url}" alt="${user.name || user.login}" class="repos-avatar-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIiByeD0iMzAiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY2Ij4KPHA+VXNlcjwvcD4KPC9zdmc+Cjwvc3ZnPg=='">
                        </div>
                        <div class="repos-title-section">
                            <h3 class="section-title">No Public Repositories</h3>
                            <p class="repos-subtitle">@${user.login} doesn't have any public repositories yet.</p>
                        </div>
                    </div>
                </div>
            `
      return
    }

    const reposHTML = repos
      .map(
        (repo) => `
            <div class="repo-card hover-lift">
                <div class="repo-header">
                    <h4 class="repo-name">
                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    </h4>
                    <span class="repo-visibility ${repo.private ? "private" : "public"}">${repo.private ? "Private" : "Public"}</span>
                </div>
                ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ""}
                <div class="repo-stats">
                    ${repo.language ? `<span class="repo-language"><span class="language-dot" style="background-color: ${getLanguageColor(repo.language)}"></span>${repo.language}</span>` : ""}
                    <span class="repo-stat"><span class="stat-icon">⭐</span>${repo.stargazers_count}</span>
                    <span class="repo-stat"><span class="stat-icon">🍴</span>${repo.forks_count}</span>
                    <span class="repo-stat"><span class="stat-icon">👁️</span>${repo.watchers_count}</span>
                </div>
                <div class="repo-meta">
                    <span class="repo-updated">Updated ${timeAgo(repo.updated_at)}</span>
                    ${repo.size > 0 ? `<span class="repo-size">${formatBytes(repo.size * 1024)}</span>` : ""}
                </div>
            </div>
        `,
      )
      .join("")

    this.profile.innerHTML += `
            <div class="repos-section slide-in-up">
                <div class="repos-header">
                    <div class="repos-avatar">
                        <img src="${user.avatar_url}" alt="${user.name || user.login}" class="repos-avatar-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIiByeD0iMzAiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY2Ij4KPHA+VXNlcjwvcD4KPC9zdmc+Cjwvc3ZnPg=='">
                        <div class="repos-avatar-ring"></div>
                    </div>
                    <div class="repos-title-section">
                        <h3 class="section-title">Latest Repositories</h3>
                        <p class="repos-subtitle">Recent projects by @${user.login}</p>
                    </div>
                </div>
                <div class="repos-grid">
                    ${reposHTML}
                </div>
            </div>
        `
  }

  showStats(stats) {
    // Update counter elements
    document.getElementById("repoCount").setAttribute("data-target", stats.totalRepos)
    document.getElementById("starCount").setAttribute("data-target", stats.totalStars)
    document.getElementById("forkCount").setAttribute("data-target", stats.totalForks)

    // Animate counters
    this.animateCounters()

    // Show stats dashboard
    this.statsDashboard.style.display = "block"

    // Add language chart if there are languages
    if (Object.keys(stats.languages).length > 0) {
      this.showLanguageChart(stats.languages)
    }
  }

  showLanguageChart(languages) {
    const sortedLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const total = Object.values(languages).reduce((sum, count) => sum + count, 0)

    const chartHTML = sortedLanguages
      .map(([language, count]) => {
        const percentage = ((count / total) * 100).toFixed(1)
        return `
                <div class="language-item">
                    <div class="language-info">
                        <span class="language-dot" style="background-color: ${getLanguageColor(language)}"></span>
                        <span class="language-name">${language}</span>
                        <span class="language-percentage">${percentage}%</span>
                    </div>
                    <div class="language-bar">
                        <div class="language-progress" style="width: ${percentage}%; background-color: ${getLanguageColor(language)}"></div>
                    </div>
                </div>
            `
      })
      .join("")

    this.profile.innerHTML += `
            <div class="languages-section slide-in-up">
                <h3 class="section-title">Top Languages</h3>
                <div class="languages-chart">
                    ${chartHTML}
                </div>
            </div>
        `
  }

  animateCounters() {
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target"))
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0

      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        counter.textContent = Math.floor(current).toLocaleString()
      }, 16)
    })
  }

  showLoading() {
    this.loading.style.display = "block"
    this.error.style.display = "none"
    this.profile.innerHTML = ""
    this.quickActions.style.display = "none"
    this.statsDashboard.style.display = "none"
  }

  hideLoading() {
    this.loading.style.display = "none"
  }

  showError(message = "User not found") {
    this.error.style.display = "block"
    this.error.querySelector("p").textContent = message
    this.hideLoading()
    this.quickActions.style.display = "none"
    this.statsDashboard.style.display = "none"
  }

  clearResults() {
    this.error.style.display = "none"
    this.profile.innerHTML = ""
    this.quickActions.style.display = "none"
    this.statsDashboard.style.display = "none"
  }

  showRecentSearches() {
    const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]")
    if (searches.length === 0) return

    const searchesHTML = searches
      .map(
        (search) => `
            <button class="recent-item" onclick="searchUser('${search.username}')">
                <img src="${search.avatar}" alt="${search.username}" class="recent-avatar" onerror="this.style.display='none'">
                <span class="recent-username">${search.username}</span>
                <span class="recent-date">${timeAgo(search.date)}</span>
            </button>
        `,
      )
      .join("")

    document.getElementById("recentList").innerHTML = searchesHTML
    this.recentSearches.style.display = "block"
  }

  addToRecentSearches(user) {
    let searches = JSON.parse(localStorage.getItem("recentSearches") || "[]")

    // Remove if already exists
    searches = searches.filter((search) => search.username !== user.login)

    // Add to beginning
    searches.unshift({
      username: user.login,
      avatar: user.avatar_url,
      date: new Date().toISOString(),
    })

    // Keep only last 10
    searches = searches.slice(0, 10)

    localStorage.setItem("recentSearches", JSON.stringify(searches))
    this.showRecentSearches()
  }
}

// Utility functions
function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Vue: "#2c3e50",
    React: "#61DAFB",
    Angular: "#DD0031",
    "Node.js": "#339933",
  }
  return colors[language] || "#586069"
}

function timeAgo(date) {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now - past) / 1000)

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
    }
  }
  return "just now"
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function shareProfile(username) {
  if (navigator.share) {
    navigator.share({
      title: `${username} - GitHub Profile`,
      text: `Check out ${username}'s GitHub profile`,
      url: `https://github.com/${username}`,
    })
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(`https://github.com/${username}`).then(() => {
      showNotification("Profile link copied to clipboard!")
    })
  }
}

function showNotification(message) {
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}
