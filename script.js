// Sidebar functions
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
        // Expanding
        closeAllSubmenus();
        listItem.classList.add('expanded');
        expandIcon.style.transform = 'rotate(90deg)';
        
        // Calculate scrollHeight after a frame
        requestAnimationFrame(() => {
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
        });
    } else {
        // Collapsing
        submenu.style.maxHeight = '0px';
        expandIcon.style.transform = 'rotate(0deg)';
        
        // Remove expanded class after animation completes
        setTimeout(() => {
            listItem.classList.remove('expanded');
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
        item.classList.remove('expanded');
    });
}

// Close submenu when clicking submenu item
function closeSubmenuAfterClick(element) {
    const submenuUl = element.closest('ul.submenu');
    if (!submenuUl) return;
    
    const listItem = submenuUl.closest('.sidebar-list-item');
    if (!listItem) return;
    
    // Close this submenu
    const expandIcon = listItem.querySelector('.expand-icon');
    submenuUl.style.maxHeight = '0px';
    if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
    
    setTimeout(() => {
        listItem.classList.remove('expanded');
    }, 300);
    
    // Close mobile sidebar after animation
    setTimeout(() => {
        if (window.innerWidth <= 600) {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                sidebar.classList.remove("active");
            }
        }
    }, 350);
}

// Tab switching function
function switchTab(tabName) {
    // Close all submenus when switching tabs (e.g. clicking Dashboard)
    closeAllSubmenus();

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

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    const searchWrap = document.querySelector('.search-wrap');
    
    if (window.innerWidth <= 600 && sidebar.classList.contains('active')) {
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
        document.querySelectorAll('.sidebar-item-header').forEach(header => {
            header.addEventListener('click', function () {
                const listItem = header.closest('.sidebar-list-item');
                const submenu = listItem.querySelector('.submenu');
                const expandIcon = header.querySelector('.expand-icon');

                if (!listItem.classList.contains('expanded') && typeof closeAllSubmenus === 'function') {
                    closeAllSubmenus();
                }

                listItem.classList.toggle('expanded');

                if (listItem.classList.contains('expanded')) {
                    if (expandIcon) expandIcon.style.transform = 'rotate(90deg)';
                    if (submenu) submenu.style.maxHeight = submenu.scrollHeight + 'px';
                } else {
                    if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
                    if (submenu) submenu.style.maxHeight = '0px';
                }
            });
        });
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
