// js/main.js
// JavaScript principal para funcionalidades do dashboard

class Dashboard {
    constructor() {
        this.sidebarCollapsed = false;
        this.currentDateRange = {
            start: '2025-01-23',
            end: '2025-01-24'
        };
        this.init();
    }

    init() {
        this.initializeIcons();
        this.setupEventListeners();
        this.setupMenuToggle();
        this.setupDateFilter();
        this.setupDashTabs();
        this.setupMarketingTabs();
        this.loadDashboardData();
        this.animateCards();
        this.setupMarketingAddButton();
        this.setupMarketingModals();
    }

    initializeIcons() {
        lucide.createIcons();
    }

    setupEventListeners() {
        // Navegação da sidebar
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });

        // Admin dropdown
        this.setupAdminDropdown();

        // Marketing add button
        this.setupMarketingAddButton();
    }

    setupMarketingModals() {
        // Setup promo code form
        const promoCodeForm = document.getElementById('promo-code-form');
        if (promoCodeForm) {
            promoCodeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePromoCodeSubmit(new FormData(promoCodeForm));
            });
        }

        // Setup campaign form
        const campaignForm = document.getElementById('campaign-form');
        if (campaignForm) {
            campaignForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCampaignSubmit(new FormData(campaignForm));
            });
        }
    }

    handlePromoCodeSubmit(formData) {
        // Simulate API call
        this.showNotification('Código promocional criado com sucesso!', 'success');
        document.getElementById('promo-code-form').reset();
        this.closePromoCodeModal();
    }

    handleCampaignSubmit(formData) {
        // Simulate API call
        this.showNotification('Campanha criada com sucesso!', 'success');
        document.getElementById('campaign-form').reset();
        this.closeCampaignModal();
    }

    closePromoCodeModal() {
        const modal = document.getElementById('promo-code-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }

    closeCampaignModal() {
        const modal = document.getElementById('campaign-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }

    setupAdminDropdown() {
        const dropdownBtn = document.getElementById('admin-dropdown-btn');
        const dropdown = document.getElementById('admin-dropdown');
        let isOpen = false;

        if (dropdownBtn && dropdown) {
            dropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isOpen = !isOpen;

                if (isOpen) {
                    dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
                    dropdown.classList.add('opacity-100', 'visible', 'scale-100');
                } else {
                    dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                    dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
                }
            });

            // Fechar dropdown ao clicar fora
            document.addEventListener('click', () => {
                if (isOpen) {
                    isOpen = false;
                    dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                    dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
                }
            });

            // Prevenir fechamento ao clicar no dropdown
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupMenuToggle() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuTexts = document.querySelectorAll('.menu-text');
        const logoImage = document.querySelector('.logo-image');
        const hamburgerLines = document.querySelectorAll('.hamburger-line');
        const nomeUserBtn = document.getElementById('nomeUserBtn');

        this.sidebarCollapsed = !this.sidebarCollapsed;

        if (this.sidebarCollapsed) {
            sidebar.classList.add('sidebar-collapsed');
            sidebar.classList.remove('sidebar-expanded');
            sidebar.style.width = '80px';
            sidebar.style.zIndex = '99';

            // Animate hamburger to X
            hamburgerLines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';

            // Hide text elements and logo
            menuTexts.forEach(text => {
                text.style.opacity = '0';
                text.style.pointerEvents = 'none';
            });

            // Hide logo
            if (logoImage) {
                logoImage.style.opacity = '0';
                logoImage.style.pointerEvents = 'none';
            }

            nomeUserBtn.classList.add('hidden');

        } else {
            sidebar.classList.remove('sidebar-collapsed');
            sidebar.classList.add('sidebar-expanded');
            sidebar.style.width = '230px'; // w-64 = 16rem = 256px

            // Reset hamburger
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';

            // Show logo
            if (logoImage) {
                logoImage.style.opacity = '1';
                logoImage.style.pointerEvents = 'auto';
            }

            // Show text elements
            setTimeout(() => {
                menuTexts.forEach(text => {
                    text.style.opacity = '1';
                    text.style.pointerEvents = 'auto';
                    nomeUserBtn.classList.remove('hidden');
                });
            }, 300);

        }
    }

    setupDateFilter() {
        const applyFilterBtn = document.getElementById('apply-filter');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');

        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', () => {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;

                if (startDate && endDate) {
                    if (new Date(startDate) > new Date(endDate)) {
                        this.showNotification('Data inicial não pode ser maior que a data final', 'error');
                        return;
                    }

                    this.currentDateRange = { start: startDate, end: endDate };
                    this.applyDateFilter(startDate, endDate);
                } else {
                    this.showNotification('Por favor, selecione ambas as datas', 'error');
                }
            });
        }
    }

    applyDateFilter(startDate, endDate) {
        // Show loading state
        const applyBtn = document.getElementById('apply-filter');
        const originalText = applyBtn.textContent;

        applyBtn.disabled = true;
        applyBtn.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Aplicando...</span>
            </div>
        `;

        // Simulate API call
        setTimeout(() => {
            this.loadDashboardData();
            this.showNotification(`Filtro aplicado: ${this.formatDate(startDate)} até ${this.formatDate(endDate)}`, 'success');

            // Reset button
            applyBtn.disabled = false;
            applyBtn.textContent = originalText;
        }, 1500);
    }

    async loadDashboardData() {
        try {
            // Simulate API call with current date range
            const data = await this.simulateApiCall();

            this.updateMetrics(data);
            this.animateCards();
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            this.showNotification('Erro ao carregar dados do dashboard', 'error');
        }
    }

    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    financialMetrics: {
                        lucroLiquido: 'R$ -487,59',
                        depositosTotais: 'R$ 2.299,59',
                        totalPerdas: 'R$ 509,58',
                        saquesPendentes: 'R$ 0,00'
                    },
                    userMetrics: {
                        totalUsuarios: '50',
                        usuariosAtivos: '50',
                        usuariosVip: '0',
                        usuariosDepositaram: '13'
                    },
                    performanceMetrics: {
                        taxaConversao: '22%',
                        taxaRetencao: '64.71%',
                        taxaAcerto: '52.27%'
                    }
                });
            }, 800);
        });
    }

    updateMetrics(data) {
        // This would update the metrics with real data
        // For now, we'll just trigger animations
        console.log('Updating metrics with data:', data);
    }

    animateCards() {
        const cards = document.querySelectorAll('.bg-gray-800');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }

    handleNavigation(item) {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-item').forEach(el => {
            el.classList.remove('text-blue-400', 'bg-blue-900/50', 'border-r-4', 'border-blue-400', 'font-medium', 'shadow-sm');
            el.classList.add('text-gray-300');
        });

        // Add active class to clicked item
        item.classList.remove('text-gray-300');
        item.classList.add('text-blue-400', 'bg-blue-900/50', 'border-r-4', 'border-blue-400', 'font-medium', 'shadow-sm');

        const section = item.dataset.section;
        this.showSection(section);
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Update page title
        //const pageTitle = document.getElementById('page-title');
        //const pageSubtitle = document.getElementById('page-subtitle');

        // const titles = {
        //     dashboard: { title: 'Dashboard', subtitle: 'Bem-vindo de volta! Aqui está o resumo da sua plataforma.' },
        //     usuarios: { title: 'Usuários', subtitle: 'Gerencie todos os usuários da plataforma.' },
        //     financeiro: { title: 'Financeiro', subtitle: 'Controle financeiro e transações da plataforma.' },
        //     boosters: { title: 'Boosters', subtitle: 'Gerencie os boosters e suas estatísticas.' },
        //     configuracoes: { title: 'Configurações', subtitle: 'Configure as opções da plataforma.' },
        //     suporte: { title: 'Suporte', subtitle: 'Central de atendimento e tickets de suporte.' }
        // };

        // if (titles[sectionName]) {
        //     pageTitle.textContent = titles[sectionName].title;
        //     pageSubtitle.textContent = titles[sectionName].subtitle;
        // }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;

        // Set colors based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-emerald-600', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-600', 'text-white');
                break;
            case 'info':
                notification.classList.add('bg-blue-600', 'text-white');
                break;
            default:
                notification.classList.add('bg-gray-600', 'text-white');
        }

        notification.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);
        lucide.createIcons();

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    setupDashTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn-dash');
        const tabContents = document.querySelectorAll('.tab-content-dash');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-blue-600/30', 'text-blue-400');
                    btn.classList.add('text-gray-400');
                });

                // Add active class to clicked button
                button.classList.add('active', 'bg-blue-600/30', 'text-blue-400');
                button.classList.remove('text-gray-400');

                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });

                // Show corresponding content and update title
                if (button.id === 'tab-dash-gerais') {
                    document.getElementById('content-dash-gerais').classList.remove('hidden');
                } else if (button.id === 'tab-dash-detalhes') {
                    document.getElementById('content-dash-detalhes').classList.remove('hidden');
                }
            });
        });
    }

    setupMarketingTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-blue-600/30', 'text-blue-400');
                    btn.classList.add('text-gray-400');
                });

                // Add active class to clicked button
                button.classList.add('active', 'bg-blue-600/30', 'text-blue-400');
                button.classList.remove('text-gray-400');

                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });

                // Show corresponding content and update title
                if (button.id === 'tab-codigos') {
                    document.getElementById('content-codigos').classList.remove('hidden');
                } else if (button.id === 'tab-campanhas') {
                    document.getElementById('content-campanhas').classList.remove('hidden');
                } 
            });
        });
    }

    setupMarketingAddButton() {
        const addButtonPromo = document.getElementById('add-codigo-promo-btn');
        const addButtonCamp = document.getElementById('add-campanhas-btn');

        if (addButtonPromo) {
            addButtonPromo.addEventListener('click', () => {
                const activeTab = document.querySelector('.tab-btn.active');
                if (activeTab) {
                    if (activeTab.id === 'tab-codigos') {
                        // Open promo code modal
                        const modal = document.getElementById('promo-code-modal');
                        modal.classList.remove('hidden');
                        modal.classList.add('flex');
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        }

         if (addButtonCamp) {
            addButtonCamp.addEventListener('click', () => {
                const activeTab = document.querySelector('.tab-btn.active');
                if (activeTab) {
                    if (activeTab.id === 'tab-campanhas') {
                        // Open campaign modal
                        const modal = document.getElementById('campaign-modal');
                        modal.classList.remove('hidden');
                        modal.classList.add('flex');
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        }

        
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
}

// Inicializar dashboard quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    window.dashboard = new Dashboard();
});

// Funções utilitárias globais
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

// Global functions for modal controls
function closePromoCodeModal() {
    if (window.dashboard) {
        window.dashboard.closePromoCodeModal();
    }
}

function closeCampaignModal() {
    if (window.dashboard) {
        window.dashboard.closeCampaignModal();
    }
}