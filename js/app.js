// Initialize GitHub and UI classes
const github = new GitHub()
const ui = new UI()

// Global variables
let currentUser = null

// Enhanced functionality with effects
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all effects
  initializeEffects()
  initializeInteractions()
  initializeCursorTrail()

  // Search form handling
  const searchForm = document.getElementById("searchForm")
  const searchInput = document.getElementById("searchUser")
  const suggestionBtns = document.querySelectorAll(".suggestion-btn")
  const backToTopBtn = document.getElementById("backToTop")

  // Handle form submission with effects
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = searchInput.value.trim()
    if (username) {
      addRippleEffect(e.target.querySelector(".btn-search"), e)
      searchUser(username)
      // Hide suggestions when form is submitted
      if (window.searchSuggestions) {
        window.searchSuggestions.hideSuggestions()
      }
    }
  })

  // Handle suggestion clicks
  suggestionBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const username = this.dataset.username
      searchInput.value = username
      addRippleEffect(this, e)
      searchUser(username)
      // Hide suggestions when suggestion button is clicked
      if (window.searchSuggestions) {
        window.searchSuggestions.hideSuggestions()
      }
    })
  })

  // Quick action handlers
  document.getElementById("viewRepos").addEventListener("click", () => {
    if (currentUser) {
      window.open(`https://github.com/${currentUser.login}?tab=repositories`, "_blank")
    }
  })

  document.getElementById("viewFollowers").addEventListener("click", () => {
    if (currentUser) {
      showFollowers(currentUser.login)
    }
  })

  document.getElementById("viewFollowing").addEventListener("click", () => {
    if (currentUser) {
      showFollowing(currentUser.login)
    }
  })

  // Back to top functionality with smooth animation
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = "flex"
      backToTopBtn.classList.add("show")
    } else {
      backToTopBtn.classList.remove("show")
      setTimeout(() => {
        if (!backToTopBtn.classList.contains("show")) {
          backToTopBtn.style.display = "none"
        }
      }, 300)
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Theme toggle functionality
  const themeToggle = document.querySelector(".theme-toggle")
  const themeIcon = document.querySelector(".theme-icon")

  themeToggle.addEventListener("click", function (e) {
    addRippleEffect(this, e)
    document.body.classList.toggle("light-theme")
    themeIcon.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙"
    localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark")
  })

  // Load saved theme
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    document.body.classList.add("light-theme")
    themeIcon.textContent = "☀️"
  }

  // Show recent searches on load
  ui.showRecentSearches()

  // Auto-focus search input
  searchInput.focus()
})

// Main search function
async function searchUser(username) {
  try {
    ui.showLoading()

    // Get user data and stats
    const userData = await github.getUser(username)
    const userStats = await github.getUserStats(username)

    if (userData.profile.message === "Not Found") {
      ui.showError("User not found. Please check the username and try again.")
      return
    }

    currentUser = userData.profile

    ui.hideLoading()
    ui.showProfile(userData.profile)
    ui.showRepos(userData.repos, userData.profile) // Pass user data to showRepos
    ui.showStats(userStats)

    // Update stats with follower count
    document.getElementById("followerCount").setAttribute("data-target", userData.profile.followers)

    // Show quick actions
    document.getElementById("quickActions").style.display = "block"

    // Add to recent searches
    ui.addToRecentSearches(userData.profile)

    // Scroll to results
    document.getElementById("results").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  } catch (error) {
    console.error("Error searching user:", error)
    ui.showError("An error occurred while searching. Please try again.")
  }
}

// Show followers modal
async function showFollowers(username) {
  try {
    const followers = await github.getFollowers(username)
    showUsersModal("Followers", followers, username)
  } catch (error) {
    console.error("Error fetching followers:", error)
    showNotification("Error loading followers")
  }
}

// Show following modal
async function showFollowing(username) {
  try {
    const following = await github.getFollowing(username)
    showUsersModal("Following", following, username)
  } catch (error) {
    console.error("Error fetching following:", error)
    showNotification("Error loading following")
  }
}

// Show users in modal
function showUsersModal(title, users, username) {
  const usersHTML = users
    .map(
      (user) => `
        <div class="user-item" onclick="searchUser('${user.login}'); closeModal();">
            <img src="${user.avatar_url}" alt="${user.login}" class="user-avatar">
            <div class="user-info">
                <h4 class="user-name">${user.login}</h4>
                <a href="${user.html_url}" target="_blank" class="user-link">View Profile</a>
            </div>
        </div>
    `,
    )
    .join("")

  document.getElementById("modalTitle").textContent = `${title} (${users.length})`
  document.getElementById("modalBody").innerHTML = `
        <div class="users-grid">
            ${usersHTML}
        </div>
        ${users.length === 30 ? `<p class="text-center text-muted mt-3">Showing first 30 ${title.toLowerCase()}</p>` : ""}
    `
  document.getElementById("modal").style.display = "flex"
}

// Initialize various effects
function initializeEffects() {
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  }, observerOptions)

  // Observe all animated elements
  document.querySelectorAll(".fade-in-up, .slide-in-left, .slide-in-right, .bounce-in").forEach((el) => {
    observer.observe(el)
  })
}

// Initialize interactive effects
function initializeInteractions() {
  // Magnetic hover effect
  document.querySelectorAll(".magnetic-hover").forEach((el) => {
    el.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
    })

    el.addEventListener("mouseleave", function () {
      this.style.transform = "translate(0, 0)"
    })
  })

  // Tilt effect
  document.querySelectorAll(".hover-tilt").forEach((el) => {
    el.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
    })

    el.addEventListener("mouseleave", function () {
      this.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
    })
  })
}

// Cursor trail effect
function initializeCursorTrail() {
  const trail = document.getElementById("cursorTrail")
  let mouseX = 0,
    mouseY = 0
  let trailX = 0,
    trailY = 0

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.1
    trailY += (mouseY - trailY) * 0.1

    trail.style.left = trailX + "px"
    trail.style.top = trailY + "px"

    requestAnimationFrame(animateTrail)
  }

  animateTrail()
}

// Ripple effect
function addRippleEffect(element, event) {
  const ripple = document.createElement("span")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = size + "px"
  ripple.style.left = x + "px"
  ripple.style.top = y + "px"
  ripple.classList.add("ripple")

  element.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// Utility functions
function clearResults() {
  ui.clearResults()
  document.getElementById("searchUser").focus()
  // Clear search suggestions
  if (window.searchSuggestions) {
    window.searchSuggestions.clear()
  }
}

function showAbout() {
  document.getElementById("modalTitle").textContent = "About Github Finder"
  document.getElementById("modalBody").innerHTML = `
        <div class="modal-section">
            <p>Github Finder is a modern web application that allows you to search for GitHub users and explore their profiles, repositories, and statistics.</p>
            
            <h3>Features:</h3>
            <ul class="feature-list">
                <li>🔍 Real-time search with live suggestions</li>
                <li>👤 View detailed user profiles with bio and stats</li>
                <li>📚 Browse user repositories with language stats</li>
                <li>📊 See comprehensive statistics and analytics</li>
                <li>👥 View followers and following lists</li>
                <li>📱 Responsive design for all devices</li>
                <li>🌙 Dark/Light theme support</li>
                <li>✨ Modern animations and effects</li>
                <li>💾 Recent searches history</li>
                <li>📤 Share profiles easily</li>
                <li>⌨️ Keyboard navigation support</li>
            </ul>
            
            <h3>Technologies Used:</h3>
            <ul class="feature-list">
                <li>🌐 GitHub REST API</li>
                <li>💻 Vanilla JavaScript (ES6+)</li>
                <li>🎨 CSS3 with custom properties</li>
                <li>📱 Responsive Web Design</li>
                <li>🔧 Local Storage for data persistence</li>
            </ul>
        </div>
    `
  document.getElementById("modal").style.display = "flex"
}

function showPrivacy() {
  document.getElementById("modalTitle").textContent = "Privacy Policy"
  document.getElementById("modalBody").innerHTML = `
        <div class="modal-section">
            <p>Your privacy is important to us. This application:</p>
            
            <h3>Data Collection:</h3>
            <ul class="feature-list">
                <li>🔒 Does not collect personal information</li>
                <li>🌐 Uses GitHub's public API only</li>
                <li>💾 Stores search history locally in your browser</li>
                <li>🚫 Does not track user behavior</li>
                <li>🍪 Does not use cookies for tracking</li>
                <li>📊 No analytics or third-party tracking</li>
            </ul>
            
            <h3>Data Usage:</h3>
            <ul class="feature-list">
                <li>📖 All data displayed is publicly available through GitHub's API</li>
                <li>💻 Recent searches are stored locally on your device</li>
                <li>🔄 No data is sent to external servers</li>
                <li>🗑️ You can clear your search history anytime</li>
            </ul>
            
            <h3>Security:</h3>
            <ul class="feature-list">
                <li>🔐 All API requests are made over HTTPS</li>
                <li>🛡️ No authentication tokens are stored</li>
                <li>🔒 Your GitHub credentials are never accessed</li>
            </ul>
        </div>
    `
  document.getElementById("modal").style.display = "flex"
}

function closeModal() {
  document.getElementById("modal").style.display = "none"
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal")
  if (e.target === modal) {
    closeModal()
  }
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Escape key to close modal
  if (e.key === "Escape") {
    closeModal()
  }

  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    document.getElementById("searchUser").focus()
  }
})

// Service Worker for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}

function showNotification(message) {
  const notification = document.createElement("div")
  notification.classList.add("notification")
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}
