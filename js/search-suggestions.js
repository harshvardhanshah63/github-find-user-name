class SearchSuggestions {
  constructor() {
    this.searchInput = document.getElementById("searchUser")
    this.suggestionsContainer = document.getElementById("searchSuggestions")
    this.debounceTimer = null
    this.currentIndex = -1
    this.suggestions = []
    this.isVisible = false

    this.init()
  }

  init() {
    // Input event listener with debouncing
    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim()

      if (query.length < 2) {
        this.hideSuggestions()
        return
      }

      // Debounce the search
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.searchUsers(query)
      }, 300)
    })

    // Keyboard navigation
    this.searchInput.addEventListener("keydown", (e) => {
      if (!this.isVisible) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          this.navigateDown()
          break
        case "ArrowUp":
          e.preventDefault()
          this.navigateUp()
          break
        case "Enter":
          e.preventDefault()
          if (this.currentIndex >= 0 && this.suggestions[this.currentIndex]) {
            this.selectSuggestion(this.suggestions[this.currentIndex])
          }
          break
        case "Escape":
          this.hideSuggestions()
          break
      }
    })

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.searchInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
        this.hideSuggestions()
      }
    })

    // Show suggestions when input is focused and has content
    this.searchInput.addEventListener("focus", () => {
      if (this.searchInput.value.trim().length >= 2 && this.suggestions.length > 0) {
        this.showSuggestions()
      }
    })
  }

  async searchUsers(query) {
    try {
      this.showLoading()

      // Search GitHub users
      const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=8`)
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        this.suggestions = data.items
        this.displaySuggestions(data.items)
      } else {
        this.showNoResults()
      }
    } catch (error) {
      console.error("Error searching users:", error)
      this.showError()
    }
  }

  displaySuggestions(users) {
    const suggestionsHTML = users
      .map(
        (user, index) => `
      <div class="suggestion-item" data-index="${index}" onclick="searchSuggestions.selectSuggestion(${JSON.stringify(user).replace(/"/g, "&quot;")})">
        <img src="${user.avatar_url}" alt="${user.login}" class="suggestion-avatar" loading="lazy">
        <div class="suggestion-info">
          <div class="suggestion-name">${user.login}</div>
          <div class="suggestion-username">Score: ${user.score.toFixed(0)}</div>
        </div>
        <div class="suggestion-type">${user.type}</div>
      </div>
    `,
      )
      .join("")

    this.suggestionsContainer.innerHTML = suggestionsHTML
    this.showSuggestions()
    this.currentIndex = -1
  }

  showLoading() {
    this.suggestionsContainer.innerHTML = `
      <div class="loading-suggestions">
        <div class="loading-spinner"></div>
        <span>Searching users...</span>
      </div>
    `
    this.showSuggestions()
  }

  showNoResults() {
    this.suggestionsContainer.innerHTML = `
      <div class="no-suggestions">
        No users found matching your search
      </div>
    `
    this.showSuggestions()
  }

  showError() {
    this.suggestionsContainer.innerHTML = `
      <div class="no-suggestions">
        Error searching users. Please try again.
      </div>
    `
    this.showSuggestions()
  }

  showSuggestions() {
    this.suggestionsContainer.classList.add("show")
    this.isVisible = true
  }

  hideSuggestions() {
    this.suggestionsContainer.classList.remove("show")
    this.isVisible = false
    this.currentIndex = -1
    this.clearActiveStates()
  }

  navigateDown() {
    const items = this.suggestionsContainer.querySelectorAll(".suggestion-item")
    if (items.length === 0) return

    this.clearActiveStates()
    this.currentIndex = (this.currentIndex + 1) % items.length
    items[this.currentIndex].classList.add("keyboard-active")
    this.scrollToActiveItem()
  }

  navigateUp() {
    const items = this.suggestionsContainer.querySelectorAll(".suggestion-item")
    if (items.length === 0) return

    this.clearActiveStates()
    this.currentIndex = this.currentIndex <= 0 ? items.length - 1 : this.currentIndex - 1
    items[this.currentIndex].classList.add("keyboard-active")
    this.scrollToActiveItem()
  }

  clearActiveStates() {
    this.suggestionsContainer.querySelectorAll(".suggestion-item").forEach((item) => {
      item.classList.remove("keyboard-active")
    })
  }

  scrollToActiveItem() {
    const activeItem = this.suggestionsContainer.querySelector(".keyboard-active")
    if (activeItem) {
      activeItem.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      })
    }
  }

  selectSuggestion(user) {
    // Fill the search input with the selected username
    this.searchInput.value = user.login

    // Hide suggestions
    this.hideSuggestions()

    // Trigger search
    window.searchUser(user.login)

    // Add ripple effect
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
    })

    // Focus back to input for better UX
    setTimeout(() => {
      this.searchInput.blur()
    }, 100)
  }

  // Public method to clear suggestions
  clear() {
    this.hideSuggestions()
    this.suggestions = []
  }
}

// Initialize search suggestions when DOM is loaded
let searchSuggestions
document.addEventListener("DOMContentLoaded", () => {
  searchSuggestions = new SearchSuggestions()
})
