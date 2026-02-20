// Theme toggle functionality
function initTheme() {
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedPreference = localStorage.getItem('themePreference');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine initial theme
    let initialPreference = savedPreference || 'system';
    let initialTheme;
    
    if (initialPreference === 'system') {
        // Set data-theme based on current system preference
        initialTheme = systemPrefersDark ? 'dark' : 'light';
        html.setAttribute('data-theme', initialTheme);
    } else {
        initialTheme = initialPreference;
        html.setAttribute('data-theme', initialTheme);
    }
    
    // Update radio button selection
    const radio = document.querySelector(`input[name="theme"][value="${initialPreference}"]`);
    if (radio) {
        radio.checked = true;
    }
    
    // Listen for system theme changes (only if preference is system)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentPreference = localStorage.getItem('themePreference') || 'system';
        if (currentPreference === 'system') {
            // Update theme to match new system preference
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
        }
    });
}

function setThemePreference(preference) {
    const html = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Save preference
    localStorage.setItem('themePreference', preference);
    
    if (preference === 'system') {
        // Follow system preference
        const systemTheme = systemPrefersDark ? 'dark' : 'light';
        html.setAttribute('data-theme', systemTheme);
    } else {
        // Force specific theme
        html.setAttribute('data-theme', preference);
    }
}

// Dropdown functionality for header icons
function toggleDropdown(dropdownType) {
    const dropdown = document.getElementById(dropdownType + '-dropdown');
    
    // Close all other dropdowns
    closeAllDropdowns(dropdownType);
    
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function closeAllDropdowns(exceptFor = null) {
    const dropdowns = document.querySelectorAll('.header-dropdown');
    dropdowns.forEach(dropdown => {
        if (!exceptFor || !dropdown.id.startsWith(exceptFor)) {
            dropdown.classList.remove('active');
        }
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const header = document.querySelector('header');
    const headerDropdowns = document.querySelectorAll('.header-dropdown');
    
    if (header && !header.contains(event.target)) {
        closeAllDropdowns();
    }
});

// Sidebar functions
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const grid = document.querySelector(".grid-container");

    if (sidebar) {
        sidebar.classList.toggle("active");
    }
    if (grid && window.innerWidth > 600) {
        grid.classList.toggle("sidebar-collapsed");
    }
}

function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const grid = document.querySelector(".grid-container");

    if (sidebar) {
        sidebar.classList.add("active");
    }
    if (grid && window.innerWidth > 600) {
        grid.classList.remove("sidebar-collapsed");
    }
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const grid = document.querySelector(".grid-container");

    if (sidebar) {
        sidebar.classList.remove("active");
    }
    if (grid && window.innerWidth > 600) {
        grid.classList.add("sidebar-collapsed");
    }
}

// Header search (mobile expand/collapse)
function toggleSearch() {
    const input = document.getElementById("header-search");
    if (!input) return;

    if (window.innerWidth <= 600) {
        document.body.classList.toggle("search-open");
        if (document.body.classList.contains("search-open")) {
            setTimeout(() => input.focus(), 0);
        }
        return;
    }

    // Desktop: just focus input
    input.focus();
}

// Toggle submenu expand/collapse
function toggleSubmenu(element) {
    const listItem = element.closest('.sidebar-list-item');
    if (!listItem) return;
    
    const submenu = listItem.querySelector('.submenu');
    const expandIcon = element.querySelector('.expand-icon');
    
    if (!submenu || !expandIcon) return;
    
    // Check if already expanded
    const isExpanded = listItem.classList.contains('expanded');
    
    if (!isExpanded) {
        // Expanding - allow multiple submenus to be open
        listItem.classList.add('expanded');
        expandIcon.style.transform = 'rotate(90deg)';
        
        // Clear max-height to allow proper height calculation
        submenu.style.maxHeight = 'none';
        
        // Calculate scrollHeight after a frame
        requestAnimationFrame(() => {
            const height = submenu.scrollHeight;
            submenu.style.maxHeight = height + 'px';
        });
    } else {
        // Collapsing
        submenu.style.maxHeight = '0px';
        expandIcon.style.transform = 'rotate(0deg)';
        
        // Remove expanded class after animation completes
        setTimeout(() => {
            listItem.classList.remove('expanded');
            submenu.style.maxHeight = ''; // Clear inline style
        }, 300);
    }
}

// Close all submenus
function closeAllSubmenus() {
    const expandedItems = document.querySelectorAll('.sidebar-list-item.expanded');
    expandedItems.forEach(item => {
        const submenu = item.querySelector('.submenu');
        const expandIcon = item.querySelector('.expand-icon');
        
        if (submenu) submenu.style.maxHeight = '0px';
        if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
        
        // Remove expanded class after animation completes
        setTimeout(() => {
            item.classList.remove('expanded');
            if (submenu) {
                submenu.style.maxHeight = ''; // Clear inline style to allow recalculation
            }
        }, 300);
    });
}

// Close submenu when clicking submenu item
function closeSubmenuAfterClick(element) {
    // Don't close the submenu - just close the Mobile sidebar if on mobile
    // This allows users to click different submenu items without the category collapsing
    
    if (window.innerWidth <= 600) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.classList.remove("active");
        }
    }
}

// Tab switching function
function switchTab(tabName) {
    // Don't close submenus - allow them to stay expanded while navigating between items
    // Users can click on different submenu items without categories collapsing

    // Hide all tab contents
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Update sidebar active state
    const sidebarItems = document.querySelectorAll('.sidebar-list-item');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
    });

    // Map tab names to sidebar items
    const tabToSidebarMap = {
        'dashboard': 0,
        'products': 1,
        'categories': 2,
        'inventory': 3,
        'reports': 4,
        'settings': 5,
        'customers': 1 // Customers uses products sidebar item
    };

    const sidebarIndex = tabToSidebarMap[tabName];
    if (sidebarIndex !== undefined && sidebarItems[sidebarIndex]) {
        sidebarItems[sidebarIndex].classList.add('active');
    }

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 600) {
        closeSidebar();
    }
}

// Close sidebar when clicking outside (all devices)
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    const searchWrap = document.querySelector('.search-wrap');
    
    // Close sidebar on both mobile and desktop when clicking outside
    if (sidebar.classList.contains('active')) {
        if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
            closeSidebar();
        }
    }

    // Mobile: close search if tapping outside it
    if (window.innerWidth <= 600 && document.body.classList.contains("search-open") && searchWrap) {
        if (!searchWrap.contains(event.target)) {
            document.body.classList.remove("search-open");
        }
    }
});

// Initialize - ensure dashboard is shown on load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    switchTab('dashboard');
    // Initialize converted modules (merged from lib_converted)
    if (window.LibDashboardCard && window.LibDashboardCard.init) {
        window.LibDashboardCard.init();
    }
    if (window.LibSidebar && window.LibSidebar.init) {
        window.LibSidebar.init();
    }

    // Start with sidebar open on desktop, collapsed on mobile
    const grid = document.querySelector(".grid-container");
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth > 600) {
        if (grid) {
            grid.classList.remove("sidebar-collapsed");
        }
        if (sidebar) {
            sidebar.classList.add("active");
        }
    }

    // Ensure modal panel doesn't close when clicked inside
    const panel = document.querySelector('.search-modal-panel');
    if (panel) {
        panel.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    const modal = document.getElementById('search-modal');
    if (modal) {
        // clicking backdrop should close (backdrop has onclick in markup), but ensure ESC key closes modal too
    }
});

// ESC closes search
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        document.body.classList.remove("search-open");
    }
});

/* Simple search focus function with inline expand on mobile */
function focusHeaderSearch() {
    const input = document.getElementById('header-search');
    if (!input) return;

    // On mobile: toggle search-open class to expand input inline
    if (window.innerWidth <= 600) {
        document.body.classList.toggle('search-open');
        if (document.body.classList.contains('search-open')) {
            setTimeout(() => input.focus(), 0);
        }
        return;
    }

    // On desktop: just focus the input
    input.focus();
}

/* ---------------- Converted lib logic merged below ---------------- */

/* Converted from lib/models/app_tab.dart */
window.AppTab = {
    dashboard: 'dashboard',
    products: 'products',
    categories: 'categories',
    inventory: 'inventory',
    reports: 'reports',
    settings: 'settings',
    customers: 'customers'
};

/* Converted from lib/widgets/dashboard_card.dart */
window.LibDashboardCard = (function () {
    function initDashboardCards() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('hovered'));
            card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
            card.style.cursor = 'pointer';
        });
    }

    return {
        init: initDashboardCards
    };
})();

/* Converted from lib_converted/sidebar.js */
window.LibSidebar = (function () {
    function initSidebar() {
        // Event listener logic has been consolidated with inline onclick handlers
        // to avoid duplicate event triggers and state conflicts
    }

    return { init: initSidebar };
})();

/* Optional orchestrator (no-op if not needed) */
window.LibMain = (function () {
    function init() {
        if (window.LibDashboardCard && window.LibDashboardCard.init) window.LibDashboardCard.init();
        if (window.LibSidebar && window.LibSidebar.init) window.LibSidebar.init();
    }

    return { init };
})();
