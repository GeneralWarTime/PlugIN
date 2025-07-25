// Data storage
let categories = {
    primary: ['Titles', 'Domain', 'Industry'],
    secondary: ['Context', 'Certifications & Clearances']
};

let categoryData = {
    'Titles': {
        'Technical': {},
        'Functional': {}
    },
    'Domain': {
        'Agile & Scrum': {},
        'AI & Machine Learning': {},
        'Architecture': {},
        'Change & Transformation': {},
        'Cyber Security': {},
        'Data & Analytics': {},
        'DevOps & Platform Engineering': {},
        'Digital': {},
        'Financial Crime': {},
        'Infrastructure & Cloud': {},
        'Payments & Banking Tech': {},
        'Product & Design': {},
        'Project Services': {},
        'Risk & Compliance': {},
        'Software Engineering': {},
        'Testing & QA': {}
    },
    'Industry': {
        'Insurance': {},
        'Bank': {},
        'Superannuation': {},
        'Financial': {}
    },
    'Context': {},
    'Certifications & Clearances': {
        'Federal Government Clearances': {},
        'Technical Certifications': {},
        'Delivery Certifications': {},
        'Product & Design Certifications': {},
        'Financial Certifications': {}
    }
};

let currentSearch = [];
let trainingContent = [];
let recentlyUsedSearches = [];
let roles = [];
let currentRole = null;
let selectedCategory = null;
let currentSubcategory = null;
let currentSubSubcategory = null;

// Modal management for Industry boolean searches
let currentIndustrySubcategory = null;

// Modal management for Context boolean searches
let currentContextSubcategory = null;

// Modal management for Certifications & Clearances boolean searches
let currentCertificationsSubcategory = null;

// DOM elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupNavigation();
    setupStorageSection();
    setupBuilderSection();
    setupTrainerSection();
    renderAll();
    updateDataStatus();
    

    


    
    // Update data status every minute
    setInterval(updateDataStatus, 60000);
});

// Navigation functionality
function setupNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Storage Section
function setupStorageSection() {
    // Event delegation for category clicks
    document.getElementById('categoryList').addEventListener('click', function(e) {
        if (e.target.classList.contains('category-item')) {
            const category = e.target.getAttribute('data-category');
            const subcategory = e.target.getAttribute('data-subcategory');
            selectCategory(category, subcategory);
        }
    });
}

function selectCategory(category, subcategory = null, subSubcategory = null) {
    selectedCategory = { category, subcategory, subSubcategory };
    currentSubcategory = subcategory;
    renderCategoryView();
}

function renderCategoryView() {
    const titleElement = document.getElementById('currentCategoryTitle');
    const contentElement = document.getElementById('categoryContent');
    
    if (!selectedCategory) {
        titleElement.textContent = 'Select a Category';
        contentElement.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">Click on a category to view and manage its items.</p>';
        return;
    }
    
    const { category, subcategory, subSubcategory } = selectedCategory;
    
    if (category === 'Titles') {
        if (subcategory) {
            // Show items within a subcategory (Technical or Functional)
            titleElement.textContent = `Titles - ${subcategory}`;
            renderTitlesSubcategory(contentElement, subcategory);
        } else {
            // Show subcategory selection
            titleElement.textContent = 'Titles - Select Type';
            renderTitlesSubcategorySelection(contentElement);
        }
    } else if (category === 'Domain') {
        if (!subcategory) {
            // Show Domain subcategory selection
            titleElement.textContent = 'Domain - Select Type';
            renderDomainSubcategorySelection(contentElement);
        } else if (subcategory && !subSubcategory) {
            // Show Technology/Framework/Action selection
            titleElement.textContent = `Domain - ${subcategory} - Select Type`;
            renderTechnologyFrameworkActionSelection(contentElement, subcategory);
        } else if (subcategory && subSubcategory) {
            // Show items within the selected Technology/Framework/Action
            titleElement.textContent = `Domain - ${subcategory} - ${subSubcategory}`;
            renderDomainSubcategoryItems(contentElement, subcategory, subSubcategory);
        }
    } else if (category === 'Industry') {
        if (!subcategory) {
            // Show Industry subcategory selection
            titleElement.textContent = 'Industry - Select Type';
            renderIndustrySubcategorySelection(contentElement);
        } else {
            // Show boolean search management for the selected Industry subcategory
            titleElement.textContent = `Industry - ${subcategory}`;
            renderIndustrySubcategoryItems(contentElement, subcategory);
        }
    } else if (category === 'Context') {
        if (!subcategory) {
            // Show Context subcategory selection
            titleElement.textContent = 'Context - Select Type';
            renderContextSubcategorySelection(contentElement);
        } else {
            // Show boolean search management for the selected Context subcategory
            titleElement.textContent = `Context - ${subcategory}`;
            renderContextSubcategoryItems(contentElement, subcategory);
        }
    } else if (category === 'Certifications & Clearances') {
        if (!subcategory) {
            // Show Certifications & Clearances subcategory selection
            titleElement.textContent = 'Certifications & Clearances - Select Type';
            renderCertificationsSubcategorySelection(contentElement);
        } else {
            // Show boolean search management for the selected Certifications & Clearances subcategory
            titleElement.textContent = `Certifications & Clearances - ${subcategory}`;
            renderCertificationsSubcategoryItems(contentElement, subcategory);
        }
    } else {
        // Show regular category items
        titleElement.textContent = category;
        renderRegularCategory(contentElement, category);
    }
}

function renderTitlesSubcategorySelection(contentElement) {
    contentElement.innerHTML = `
        <div class="subcategory-selection">
            <h4>Select Title Type:</h4>
            <div class="subcategory-buttons">
                <button class="subcategory-btn" onclick="selectCategory('Titles', 'Technical')">Technical</button>
                <button class="subcategory-btn" onclick="selectCategory('Titles', 'Functional')">Functional</button>
            </div>
        </div>
    `;
}

function renderTitlesSubcategory(contentElement, subcategory) {
    const titles = Object.keys(categoryData['Titles'][subcategory] || {});
    
    contentElement.innerHTML = `
        <div class="category-management">
            <button class="add-boolean-search-btn" onclick="openAddBooleanSearchModal('Titles', '${subcategory}')">
                ➕ Add Boolean Search
            </button>
            <div class="search-filter">
                <input type="text" id="titleSearch" placeholder="Search titles or boolean terms..." onkeyup="filterTitles('${subcategory}')">
            </div>
            <div class="items-list" id="titlesList">
                ${renderTitlesList(titles, subcategory)}
            </div>
        </div>
    `;
}

function renderDomainSubcategorySelection(contentElement) {
    contentElement.innerHTML = `
        <div class="subcategory-selection">
            <h4>Select Domain Type:</h4>
            <div class="subcategory-buttons">
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Agile & Scrum')">Agile & Scrum</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'AI & Machine Learning')">AI & Machine Learning</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Architecture')">Architecture</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Change & Transformation')">Change & Transformation</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Cyber Security')">Cyber Security</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Data & Analytics')">Data & Analytics</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'DevOps & Platform Engineering')">DevOps & Platform Engineering</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Digital')">Digital</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Financial Crime')">Financial Crime</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Infrastructure & Cloud')">Infrastructure & Cloud</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Payments & Banking Tech')">Payments & Banking Tech</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Product & Design')">Product & Design</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Project Services')">Project Services</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Risk & Compliance')">Risk & Compliance</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Software Engineering')">Software Engineering</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', 'Testing & QA')">Testing & QA</button>
            </div>
        </div>
    `;
}

function renderTechnologyFrameworkActionSelection(contentElement, subcategory) {
    contentElement.innerHTML = `
        <div class="subcategory-selection">
            <h4>Select Type:</h4>
            <div class="subcategory-buttons">
                <button class="subcategory-btn" onclick="selectCategory('Domain', '${subcategory}', 'Technology')">Technology</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', '${subcategory}', 'Framework')">Framework</button>
                <button class="subcategory-btn" onclick="selectCategory('Domain', '${subcategory}', 'Action')">Action</button>
            </div>
        </div>
    `;
}

function renderDomainSubcategoryItems(contentElement, subcategory, subSubcategory) {
    console.log('Rendering Domain subcategory items:', subcategory, subSubcategory);
    console.log('Current categoryData:', categoryData);
    
    // Initialize the data structure if it doesn't exist
    if (!categoryData['Domain'][subcategory]) {
        categoryData['Domain'][subcategory] = {};
    }
    if (!categoryData['Domain'][subcategory][subSubcategory]) {
        categoryData['Domain'][subcategory][subSubcategory] = {};
    }
    
    const items = categoryData['Domain'][subcategory][subSubcategory] || {};
    console.log('Items for this subcategory:', items);
    
    contentElement.innerHTML = `
        <div class="category-management">
            <button class="add-boolean-search-btn" onclick="openAddBooleanSearchModal('${subcategory}', '${subSubcategory}')">
                ➕ Add Boolean Search
            </button>
            <div class="search-filter">
                <input type="text" id="itemSearch" placeholder="Search titles or boolean terms..." onkeyup="filterDomainItems('${subcategory}', '${subSubcategory}')">
            </div>
            <div class="items-list" id="itemsList">
                ${renderDomainItemsList(items, subcategory, subSubcategory)}
            </div>
        </div>
    `;
}

function renderDomainItemsList(items, subcategory, subSubcategory) {
    if (Object.keys(items).length === 0) {
        return '<p style="color: #7f8c8d; font-style: italic;">No boolean searches added yet.</p>';
    }
    
    return Object.keys(items).map((title, index) => {
        const booleanTerms = items[title] || [];
        const termsDisplay = booleanTerms.length > 0 
            ? booleanTerms.map(term => `<span class="boolean-term-chip">"${term}"</span>`).join(' ')
            : '<span style="color: #7f8c8d; font-style: italic;">No terms</span>';
        
        return `
            <div class="item-row">
                <div class="item-content">
                    <div class="item-title">${title}</div>
                    <div class="item-terms">${termsDisplay}</div>
                </div>
                <div class="item-actions">
                    <button class="boolean-options-btn" onclick="openDomainDetailsModal('${subcategory}', '${subSubcategory}', '${title}')">Boolean Options</button>
                    <button class="edit-btn" onclick="editDomainTitle('${subcategory}', '${subSubcategory}', '${title}')">Edit</button>
                    <button class="delete-btn" onclick="deleteDomainTitle('${subcategory}', '${subSubcategory}', '${title}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function addDomainItem(subcategory, subSubcategory) {
    const input = document.getElementById('newItem');
    const item = input.value.trim();
    
    if (item) {
        // Initialize the data structure if it doesn't exist
        if (!categoryData['Domain'][subcategory]) {
            categoryData['Domain'][subcategory] = {};
        }
        if (!categoryData['Domain'][subcategory][subSubcategory]) {
            categoryData['Domain'][subcategory][subSubcategory] = [];
        }
        
        categoryData['Domain'][subcategory][subSubcategory].push(item);
        input.value = '';
        saveData();
        renderCategoryView();
    }
}

function editDomainItem(subcategory, subSubcategory, index) {
    const currentItem = categoryData['Domain'][subcategory][subSubcategory][index];
    const newItem = prompt('Edit item:', currentItem);
    
    if (newItem && newItem.trim()) {
        categoryData['Domain'][subcategory][subSubcategory][index] = newItem.trim();
        saveData();
        renderCategoryView();
    }
}

function deleteDomainItem(subcategory, subSubcategory, index) {
    if (confirm('Are you sure you want to delete this item?')) {
        categoryData['Domain'][subcategory][subSubcategory].splice(index, 1);
        saveData();
        renderCategoryView();
    }
}

function filterDomainItems(subcategory, subSubcategory) {
    const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
    const items = categoryData['Domain'][subcategory][subSubcategory] || {};
    
    const filteredItems = Object.keys(items).filter(title => {
        // Search in title
        if (title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in boolean terms
        const booleanTerms = items[title] || [];
        return booleanTerms.some(term => term.toLowerCase().includes(searchTerm));
    });
    
    const filteredItemsObj = {};
    filteredItems.forEach(title => {
        filteredItemsObj[title] = items[title];
    });
    
    const listElement = document.getElementById('itemsList');
    listElement.innerHTML = renderDomainItemsList(filteredItemsObj, subcategory, subSubcategory);
}

// Domain Modal Functions
function openAddDomainModal(subcategory, subSubcategory) {
    currentSubcategory = subcategory;
    currentSubSubcategory = subSubcategory;
    document.getElementById('addTitleModal').style.display = 'block';
    document.getElementById('titleName').value = '';
    document.getElementById('booleanOptionsList').innerHTML = `
        <div class="boolean-option">
            <input type="text" placeholder="Boolean option" class="boolean-input" onkeypress="handleBooleanInputKeypress(event)">
            <button type="button" class="remove-option-btn" onclick="removeBooleanOption(this)">Remove</button>
        </div>
    `;
}

function openDomainDetailsModal(subcategory, subSubcategory, titleName) {
    const booleanOptions = categoryData['Domain'][subcategory][subSubcategory][titleName] || [];
    
    document.getElementById('titleDetailsHeader').textContent = 'Boolean Search Details';
    document.getElementById('selectedTitleName').textContent = titleName;
    document.getElementById('selectedTitleName').setAttribute('data-original-title', titleName);
    document.getElementById('selectedTitleName').setAttribute('data-subcategory', subcategory);
    document.getElementById('selectedTitleName').setAttribute('data-sub-subcategory', subSubcategory);
    
    const existingOptions = document.getElementById('existingBooleanOptions');
    existingOptions.innerHTML = booleanOptions.map(option => `
        <div class="boolean-option-item">
            <span>"${option}"</span>
            <button class="delete-btn" onclick="removeBooleanOptionFromDomain('${subcategory}', '${subSubcategory}', '${titleName}', '${option}')">Delete</button>
        </div>
    `).join('');
    
    document.getElementById('newBooleanOption').value = '';
    document.getElementById('titleDetailsModal').style.display = 'block';
    
    // Add click event to make title editable
    const titleElement = document.getElementById('selectedTitleName');
    titleElement.onclick = function() {
        makeDomainTitleEditable(this);
    };
    
    // Add event listener for adding new boolean options
    const newOptionInput = document.getElementById('newBooleanOption');
    newOptionInput.onkeypress = function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const newOption = this.value.trim();
            if (newOption) {
                addBooleanOptionToDomain(subcategory, subSubcategory, titleName, newOption);
                this.value = '';
            }
        }
    };
}

function editDomainTitle(subcategory, subSubcategory, titleName) {
    const newTitleName = prompt('Edit boolean search name:', titleName);
    if (newTitleName && newTitleName.trim() && newTitleName !== titleName) {
        const booleanOptions = categoryData['Domain'][subcategory][subSubcategory][titleName];
        delete categoryData['Domain'][subcategory][subSubcategory][titleName];
        categoryData['Domain'][subcategory][subSubcategory][newTitleName.trim()] = booleanOptions;
        saveData();
        renderCategoryView();
    }
}

function deleteDomainTitle(subcategory, subSubcategory, titleName) {
    if (confirm('Are you sure you want to delete this boolean search?')) {
        delete categoryData['Domain'][subcategory][subSubcategory][titleName];
        saveData();
        renderCategoryView();
    }
}

// Boolean Search Modal Functions
let currentBooleanTerms = [];
let currentModalCategory = null;
let currentModalSubcategory = null;
let currentModalSubSubcategory = null;

function openAddBooleanSearchModal(category, subcategory, subSubcategory = null) {
    currentModalCategory = category;
    currentModalSubcategory = subcategory;
    currentModalSubSubcategory = subSubcategory;
    currentBooleanTerms = [];
    
    document.getElementById('addBooleanSearchModal').style.display = 'block';
    document.getElementById('booleanSearchTitle').value = '';
    document.getElementById('booleanSearchInput').value = '';
    document.getElementById('booleanTermsList').innerHTML = '';
}

function closeAddBooleanSearchModal() {
    document.getElementById('addBooleanSearchModal').style.display = 'none';
    currentBooleanTerms = [];
    currentModalCategory = null;
    currentModalSubcategory = null;
    currentModalSubSubcategory = null;
}

function handleBooleanSearchInputKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = document.getElementById('booleanSearchInput');
        const term = input.value.trim();
        
        if (term) {
            addBooleanTerm(term);
            input.value = '';
        }
    }
}

function addBooleanTerm(term) {
    if (term && !currentBooleanTerms.includes(term)) {
        currentBooleanTerms.push(term);
        renderBooleanTermsList();
    }
}

function removeBooleanTerm(term) {
    currentBooleanTerms = currentBooleanTerms.filter(t => t !== term);
    renderBooleanTermsList();
}

function renderBooleanTermsList() {
    const container = document.getElementById('booleanTermsList');
    container.innerHTML = currentBooleanTerms.map(term => `
        <div class="boolean-term-chip">
            "${term}"
            <button class="remove-term" onclick="removeBooleanTerm('${term}')">&times;</button>
        </div>
    `).join('');
}

function saveBooleanSearch() {
    const title = document.getElementById('booleanSearchTitle').value.trim();
    
    if (!title) {
        alert('Please enter a title for the boolean search.');
        return;
    }
    
    if (currentBooleanTerms.length === 0) {
        alert('Please add at least one boolean search term.');
        return;
    }
    
    // Initialize the data structure based on category
    if (currentModalCategory === 'Domain') {
        if (!categoryData['Domain'][currentModalSubcategory]) {
            categoryData['Domain'][currentModalSubcategory] = {};
        }
        if (!categoryData['Domain'][currentModalSubcategory][currentModalSubSubcategory]) {
            categoryData['Domain'][currentModalSubcategory][currentModalSubSubcategory] = {};
        }
        categoryData['Domain'][currentModalSubcategory][currentModalSubSubcategory][title] = currentBooleanTerms;
    } else if (currentModalCategory === 'Titles') {
        if (!categoryData['Titles'][currentModalSubcategory]) {
            categoryData['Titles'][currentModalSubcategory] = {};
        }
        categoryData['Titles'][currentModalSubcategory][title] = currentBooleanTerms;
    } else if (currentModalCategory === 'Industry') {
        if (!categoryData['Industry'][currentModalSubcategory]) {
            categoryData['Industry'][currentModalSubcategory] = {};
        }
        categoryData['Industry'][currentModalSubcategory][title] = currentBooleanTerms;
    } else if (currentModalCategory === 'Context') {
        if (!categoryData['Context'][currentModalSubcategory]) {
            categoryData['Context'][currentModalSubcategory] = {};
        }
        categoryData['Context'][currentModalSubcategory][title] = currentBooleanTerms;
    } else if (currentModalCategory === 'Certifications & Clearances') {
        if (!categoryData['Certifications & Clearances'][currentModalSubcategory]) {
            categoryData['Certifications & Clearances'][currentModalSubcategory] = {};
        }
        categoryData['Certifications & Clearances'][currentModalSubcategory][title] = currentBooleanTerms;
    }
    
    saveData();
    closeAddBooleanSearchModal();
    renderCategoryView();
}

function removeBooleanOptionFromDomain(subcategory, subSubcategory, titleName, option) {
    if (confirm('Are you sure you want to delete this boolean option?')) {
        const booleanOptions = categoryData['Domain'][subcategory][subSubcategory][titleName] || [];
        const updatedOptions = booleanOptions.filter(opt => opt !== option);
        categoryData['Domain'][subcategory][subSubcategory][titleName] = updatedOptions;
        saveData();
        openDomainDetailsModal(subcategory, subSubcategory, titleName);
    }
}

function addBooleanOptionToDomain(subcategory, subSubcategory, titleName, newOption) {
    if (!categoryData['Domain'][subcategory][subSubcategory][titleName]) {
        categoryData['Domain'][subcategory][subSubcategory][titleName] = [];
    }
    
    // Check if option already exists
    const existingOptions = categoryData['Domain'][subcategory][subSubcategory][titleName];
    if (!existingOptions.includes(newOption)) {
        existingOptions.push(newOption);
        saveData();
        openDomainDetailsModal(subcategory, subSubcategory, titleName);
    } else {
        alert('This boolean option already exists.');
    }
}

function makeDomainTitleEditable(titleElement) {
    const currentTitle = titleElement.textContent;
    const originalTitle = titleElement.getAttribute('data-original-title');
    const subcategory = titleElement.getAttribute('data-subcategory');
    const subSubcategory = titleElement.getAttribute('data-sub-subcategory');
    
    titleElement.classList.add('editing');
    titleElement.innerHTML = `<input type="text" value="${currentTitle}" onblur="saveDomainTitleEdit(this, '${subcategory}', '${subSubcategory}', '${originalTitle}')" onkeypress="handleDomainTitleEditKeypress(event, this, '${subcategory}', '${subSubcategory}', '${originalTitle}')">`;
    
    const input = titleElement.querySelector('input');
    input.focus();
    input.select();
}

function saveDomainTitleEdit(inputElement, subcategory, subSubcategory, originalTitle) {
    const newTitle = inputElement.value.trim();
    const titleElement = inputElement.parentElement;
    
    if (newTitle && newTitle !== originalTitle) {
        // Update the title in the data structure
        const booleanOptions = categoryData['Domain'][subcategory][subSubcategory][originalTitle];
        delete categoryData['Domain'][subcategory][subSubcategory][originalTitle];
        categoryData['Domain'][subcategory][subSubcategory][newTitle] = booleanOptions;
        
        // Update the display
        titleElement.textContent = newTitle;
        titleElement.setAttribute('data-original-title', newTitle);
        
        saveData();
    } else {
        // Revert to original title
        titleElement.textContent = originalTitle;
    }
    
    titleElement.classList.remove('editing');
}

function handleDomainTitleEditKeypress(event, inputElement, subcategory, subSubcategory, originalTitle) {
    if (event.key === 'Enter') {
        inputElement.blur();
    } else if (event.key === 'Escape') {
        const titleElement = inputElement.parentElement;
        titleElement.textContent = originalTitle;
        titleElement.classList.remove('editing');
    }
}





// Industry Functions
function renderIndustrySubcategorySelection(contentElement) {
    contentElement.innerHTML = `
        <div class="subcategory-selection">
            <h4>Select Industry Type:</h4>
            <div class="subcategory-buttons">
                <button class="subcategory-btn" onclick="selectCategory('Industry', 'Insurance')">Insurance</button>
                <button class="subcategory-btn" onclick="selectCategory('Industry', 'Bank')">Bank</button>
                <button class="subcategory-btn" onclick="selectCategory('Industry', 'Superannuation')">Superannuation</button>
                <button class="subcategory-btn" onclick="selectCategory('Industry', 'Financial')">Financial</button>
            </div>
        </div>
    `;
}

function renderIndustrySubcategoryItems(contentElement, subcategory) {
    // Initialize the data structure if it doesn't exist
    if (!categoryData['Industry'][subcategory]) {
        categoryData['Industry'][subcategory] = {};
    }
    
    const items = categoryData['Industry'][subcategory] || {};
    
    contentElement.innerHTML = `
        <div class="category-management">
            <button class="add-boolean-search-btn" onclick="openAddBooleanSearchModal('Industry', '${subcategory}')">
                ➕ Add Boolean Search
            </button>
            <div class="search-filter">
                <input type="text" id="itemSearch" placeholder="Search titles or boolean terms..." onkeyup="filterIndustryItems('${subcategory}')">
            </div>
            <div class="items-list" id="itemsList">
                ${renderIndustryItemsList(items, subcategory)}
            </div>
        </div>
    `;
}

function renderIndustryItemsList(items, subcategory) {
    if (Object.keys(items).length === 0) {
        return '<p style="color: #7f8c8d; font-style: italic;">No boolean searches added yet.</p>';
    }
    
    return Object.keys(items).map((title, index) => {
        const booleanTerms = items[title] || [];
        const termsDisplay = booleanTerms.length > 0 
            ? booleanTerms.map(term => `<span class="boolean-term-chip">"${term}"</span>`).join(' ')
            : '<span style="color: #7f8c8d; font-style: italic;">No terms</span>';
        
        return `
            <div class="item-row">
                <div class="item-content">
                    <div class="item-title">${title}</div>
                    <div class="item-terms">${termsDisplay}</div>
                </div>
                <div class="item-actions">
                    <button class="boolean-options-btn" onclick="openIndustryDetailsModal('${subcategory}', '${title}')">Boolean Options</button>
                    <button class="edit-btn" onclick="editIndustryTitle('${subcategory}', '${title}')">Edit</button>
                    <button class="delete-btn" onclick="deleteIndustryTitle('${subcategory}', '${title}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function addIndustryItem(subcategory) {
    const input = document.getElementById('newItem');
    const item = input.value.trim();
    
    if (item) {
        // Initialize the data structure if it doesn't exist
        if (!categoryData['Industry'][subcategory]) {
            categoryData['Industry'][subcategory] = {};
        }
        categoryData['Industry'][subcategory][item] = []; // Initialize with empty array for boolean options
        input.value = '';
        saveData();
        renderCategoryView();
    }
}

function editIndustryItem(subcategory, titleName) {
    const newTitleName = prompt('Edit boolean search name:', titleName);
    if (newTitleName && newTitleName.trim() && newTitleName !== titleName) {
        const booleanOptions = categoryData['Industry'][subcategory][titleName];
        delete categoryData['Industry'][subcategory][titleName];
        categoryData['Industry'][subcategory][newTitleName.trim()] = booleanOptions;
        saveData();
        renderCategoryView();
    }
}

function deleteIndustryItem(subcategory, titleName) {
    if (confirm('Are you sure you want to delete this boolean search?')) {
        delete categoryData['Industry'][subcategory][titleName];
        saveData();
        renderCategoryView();
    }
}

function filterIndustryItems(subcategory) {
    const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
    const items = categoryData['Industry'][subcategory] || {};
    
    const filteredItems = Object.keys(items).filter(title => {
        // Search in title
        if (title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in boolean terms
        const booleanTerms = items[title] || [];
        return booleanTerms.some(term => term.toLowerCase().includes(searchTerm));
    });
    
    const filteredItemsObj = {};
    filteredItems.forEach(title => {
        filteredItemsObj[title] = items[title];
    });
    
    const listElement = document.getElementById('itemsList');
    listElement.innerHTML = renderIndustryItemsList(filteredItemsObj, subcategory);
}

// Context Functions
function renderContextSubcategorySelection(contentElement) {
    contentElement.innerHTML = `
        <div class="subcategory-selection">
            <h4>Select Context Type:</h4>
            <div class="subcategory-buttons">
                <button class="subcategory-btn" onclick="selectCategory('Context', 'Methodology')">Methodology</button>
                <button class="subcategory-btn" onclick="selectCategory('Context', 'Status & Intent')">Status & Intent</button>
            </div>
        </div>
    `;
}

function renderContextSubcategoryItems(contentElement, subcategory) {
    // Initialize the data structure if it doesn't exist
    if (!categoryData['Context'][subcategory]) {
        categoryData['Context'][subcategory] = {};
    }
    
    const items = categoryData['Context'][subcategory] || {};
    
    contentElement.innerHTML = `
        <div class="category-management">
            <button class="add-boolean-search-btn" onclick="openAddBooleanSearchModal('Context', '${subcategory}')">
                ➕ Add Boolean Search
            </button>
            <div class="search-filter">
                <input type="text" id="itemSearch" placeholder="Search titles or boolean terms..." onkeyup="filterContextItems('${subcategory}')">
            </div>
            <div class="items-list" id="itemsList">
                ${renderContextItemsList(items, subcategory)}
            </div>
        </div>
    `;
}

function renderContextItemsList(items, subcategory) {
    if (Object.keys(items).length === 0) {
        return '<p style="color: #7f8c8d; font-style: italic;">No boolean searches added yet.</p>';
    }
    
    return Object.keys(items).map((title, index) => {
        const booleanTerms = items[title] || [];
        const termsDisplay = booleanTerms.length > 0 
            ? booleanTerms.map(term => `<span class="boolean-term-chip">"${term}"</span>`).join(' ')
            : '<span style="color: #7f8c8d; font-style: italic;">No terms</span>';
        
        return `
            <div class="item-row">
                <div class="item-content">
                    <div class="item-title">${title}</div>
                    <div class="item-terms">${termsDisplay}</div>
                </div>
                <div class="item-actions">
                    <button class="boolean-options-btn" onclick="openContextDetailsModal('${subcategory}', '${title}')">Boolean Options</button>
                    <button class="edit-btn" onclick="editContextTitle('${subcategory}', '${title}')">Edit</button>
                    <button class="delete-btn" onclick="deleteContextTitle('${subcategory}', '${title}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterContextItems(subcategory) {
    const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
    const items = categoryData['Context'][subcategory] || {};
    
    const filteredItems = Object.keys(items).filter(title => {
        // Search in title
        if (title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in boolean terms
        const booleanTerms = items[title] || [];
        return booleanTerms.some(term => term.toLowerCase().includes(searchTerm));
    });
    
    const filteredItemsObj = {};
    filteredItems.forEach(title => {
        filteredItemsObj[title] = items[title];
    });
    
    const listElement = document.getElementById('itemsList');
    listElement.innerHTML = renderContextItemsList(filteredItemsObj, subcategory);
}

// Certifications & Clearances Functions
function renderCertificationsSubcategorySelection(contentElement) {
    contentElement.innerHTML = `
        <div class="subcategory-selection">
            <h4>Select Certification Type:</h4>
            <div class="subcategory-buttons">
                <button class="subcategory-btn" onclick="selectCategory('Certifications & Clearances', 'Federal Government Clearances')">Federal Government Clearances</button>
                <button class="subcategory-btn" onclick="selectCategory('Certifications & Clearances', 'Technical Certifications')">Technical Certifications</button>
                <button class="subcategory-btn" onclick="selectCategory('Certifications & Clearances', 'Delivery Certifications')">Delivery Certifications</button>
                <button class="subcategory-btn" onclick="selectCategory('Certifications & Clearances', 'Product & Design Certifications')">Product & Design Certifications</button>
                <button class="subcategory-btn" onclick="selectCategory('Certifications & Clearances', 'Financial Certifications')">Financial Certifications</button>
            </div>
        </div>
    `;
}

function renderCertificationsSubcategoryItems(contentElement, subcategory) {
    // Initialize the data structure if it doesn't exist
    if (!categoryData['Certifications & Clearances'][subcategory]) {
        categoryData['Certifications & Clearances'][subcategory] = {};
    }
    
    const items = categoryData['Certifications & Clearances'][subcategory] || {};
    
    contentElement.innerHTML = `
        <div class="category-management">
            <button class="add-boolean-search-btn" onclick="openAddBooleanSearchModal('Certifications & Clearances', '${subcategory}')">
                ➕ Add Boolean Search
            </button>
            <div class="search-filter">
                <input type="text" id="itemSearch" placeholder="Search titles or boolean terms..." onkeyup="filterCertificationsItems('${subcategory}')">
            </div>
            <div class="items-list" id="itemsList">
                ${renderCertificationsItemsList(items, subcategory)}
            </div>
        </div>
    `;
}

function renderCertificationsItemsList(items, subcategory) {
    if (Object.keys(items).length === 0) {
        return '<p style="color: #7f8c8d; font-style: italic;">No boolean searches added yet.</p>';
    }
    
    return Object.keys(items).map((title, index) => {
        const booleanTerms = items[title] || [];
        const termsDisplay = booleanTerms.length > 0 
            ? booleanTerms.map(term => `<span class="boolean-term-chip">"${term}"</span>`).join(' ')
            : '<span style="color: #7f8c8d; font-style: italic;">No terms</span>';
        
        return `
            <div class="item-row">
                <div class="item-content">
                    <div class="item-title">${title}</div>
                    <div class="item-terms">${termsDisplay}</div>
                </div>
                <div class="item-actions">
                    <button class="boolean-options-btn" onclick="openCertificationsDetailsModal('${subcategory}', '${title}')">Boolean Options</button>
                    <button class="edit-btn" onclick="editCertificationsTitle('${subcategory}', '${title}')">Edit</button>
                    <button class="delete-btn" onclick="deleteCertificationsTitle('${subcategory}', '${title}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterCertificationsItems(subcategory) {
    const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
    const items = categoryData['Certifications & Clearances'][subcategory] || {};
    
    const filteredItems = Object.keys(items).filter(title => {
        // Search in title
        if (title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in boolean terms
        const booleanTerms = items[title] || [];
        return booleanTerms.some(term => term.toLowerCase().includes(searchTerm));
    });
    
    const filteredItemsObj = {};
    filteredItems.forEach(title => {
        filteredItemsObj[title] = items[title];
    });
    
    const listElement = document.getElementById('itemsList');
    listElement.innerHTML = renderCertificationsItemsList(filteredItemsObj, subcategory);
}

function renderRegularCategory(contentElement, category) {
    const items = categoryData[category] || [];
    
    contentElement.innerHTML = `
        <div class="category-management">
            <div class="add-item-controls">
                <input type="text" id="newItem" placeholder="New ${category.toLowerCase()} item">
                <button onclick="addItem('${category}')">Add Item</button>
            </div>
            <div class="search-filter">
                <input type="text" id="itemSearch" placeholder="Search items..." onkeyup="filterItems('${category}')">
            </div>
            <div class="items-list" id="itemsList">
                ${renderItemsList(items)}
            </div>
        </div>
    `;
}

function renderTitlesList(titles, subcategory) {
    if (titles.length === 0) {
        return '<p style="color: #7f8c8d; font-style: italic;">No boolean searches added yet.</p>';
    }
    
    return titles.map((title, index) => {
        const booleanTerms = categoryData['Titles'][subcategory][title] || [];
        const termsDisplay = booleanTerms.length > 0 
            ? booleanTerms.map(term => `<span class="boolean-term-chip">"${term}"</span>`).join(' ')
            : '<span style="color: #7f8c8d; font-style: italic;">No terms</span>';
        
        return `
            <div class="item-row">
                <div class="item-content">
                    <div class="item-title">${title}</div>
                    <div class="item-terms">${termsDisplay}</div>
                </div>
                <div class="item-actions">
                    <button class="boolean-options-btn" onclick="openTitleDetailsModal('${subcategory}', '${title}')">Boolean Options</button>
                    <button class="edit-btn" onclick="editTitle('${subcategory}', '${title}')">Edit</button>
                    <button class="delete-btn" onclick="deleteTitle('${subcategory}', '${title}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderItemsList(items) {
    if (items.length === 0) {
        return '<p style="color: #7f8c8d; font-style: italic;">No items added yet.</p>';
    }
    
    return items.map((item, index) => `
        <div class="item-row" data-index="${index}">
            <span class="item-text">${item}</span>
            <div class="item-actions">
                <button class="edit-btn" onclick="editItem('${selectedCategory.category}', ${index})">Edit</button>
                <button class="delete-btn" onclick="deleteItem('${selectedCategory.category}', ${index})">Delete</button>
            </div>
        </div>
    `).join('');
}



// Modal Functions
function openAddIndustryModal(subcategory) {
    currentIndustrySubcategory = subcategory;
    currentSubSubcategory = null; // Ensure not in Domain context
    document.getElementById('addTitleModal').style.display = 'block';
    document.getElementById('titleName').value = '';
    document.getElementById('booleanOptionsList').innerHTML = `
        <div class="boolean-option">
            <input type="text" placeholder="Boolean option" class="boolean-input" onkeypress="handleBooleanInputKeypress(event)">
            <button type="button" class="remove-option-btn" onclick="removeBooleanOption(this)">Remove</button>
        </div>
    `;
}




function openAddTitleModal(subcategory) {
    currentSubcategory = subcategory;
    document.getElementById('addTitleModal').style.display = 'block';
    document.getElementById('titleName').value = '';
    

}

function closeModal() {
    document.getElementById('addTitleModal').style.display = 'none';
}

function saveTitle() {
    const titleName = document.getElementById('titleName').value.trim();
    
    if (titleName) {
        if (currentSubSubcategory) {
            // Save to Domain
            if (!categoryData['Domain'][currentSubcategory]) {
                categoryData['Domain'][currentSubcategory] = {};
            }
            if (!categoryData['Domain'][currentSubcategory][currentSubSubcategory]) {
                categoryData['Domain'][currentSubcategory][currentSubSubcategory] = {};
            }
            categoryData['Domain'][currentSubcategory][currentSubSubcategory][titleName] = [];
        } else if (currentIndustrySubcategory) {
            // Save to Industry
            if (!categoryData['Industry'][currentIndustrySubcategory]) {
                categoryData['Industry'][currentIndustrySubcategory] = {};
            }
            categoryData['Industry'][currentIndustrySubcategory][titleName] = [];
        } else {
            // Save to Titles
            categoryData['Titles'][currentSubcategory][titleName] = [];
        }
        saveData();
        closeModal();
        renderCategoryView();
        renderAll();
        currentIndustrySubcategory = null; // Reset after save
    } else {
        alert('Please enter a title name.');
    }
}

function openTitleDetailsModal(subcategory, titleName) {
    document.getElementById('titleDetailsHeader').textContent = 'Title Details';
    document.getElementById('selectedTitleName').textContent = titleName;
    document.getElementById('selectedTitleName').setAttribute('data-original-title', titleName);
    document.getElementById('selectedTitleName').setAttribute('data-subcategory', subcategory);
    
    document.getElementById('titleDetailsModal').style.display = 'block';
    
    // Add click event to make title editable
    const titleElement = document.getElementById('selectedTitleName');
    titleElement.onclick = function() {
        makeTitleEditable(this);
    };
}

function closeTitleDetailsModal() {
    document.getElementById('titleDetailsModal').style.display = 'none';
}



function makeTitleEditable(titleElement) {
    const currentTitle = titleElement.textContent;
    const originalTitle = titleElement.getAttribute('data-original-title');
    const subcategory = titleElement.getAttribute('data-subcategory');
    
    titleElement.classList.add('editing');
    titleElement.innerHTML = `<input type="text" value="${currentTitle}" onblur="saveTitleEdit(this, '${subcategory}', '${originalTitle}')" onkeypress="handleTitleEditKeypress(event, this, '${subcategory}', '${originalTitle}')">`;
    
    const input = titleElement.querySelector('input');
    input.focus();
    input.select();
}

function saveTitleEdit(inputElement, subcategory, originalTitle) {
    const newTitle = inputElement.value.trim();
    const titleElement = inputElement.parentElement;
    
    if (newTitle && newTitle !== originalTitle) {
        // Update the title in the data structure
        const booleanOptions = categoryData['Titles'][subcategory][originalTitle];
        delete categoryData['Titles'][subcategory][originalTitle];
        categoryData['Titles'][subcategory][newTitle] = booleanOptions;
        
        // Update the display
        titleElement.textContent = newTitle;
        titleElement.setAttribute('data-original-title', newTitle);
        
        // Update all references in the boolean options
        const booleanOptionItems = document.querySelectorAll('.boolean-option-item .delete-btn');
        booleanOptionItems.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick) {
                btn.setAttribute('onclick', onclick.replace(originalTitle, newTitle));
            }
        });
        
        saveData();
    } else {
        // Revert to original title
        titleElement.textContent = originalTitle;
    }
    
    titleElement.classList.remove('editing');
}

function handleTitleEditKeypress(event, inputElement, subcategory, originalTitle) {
    if (event.key === 'Enter') {
        inputElement.blur();
    } else if (event.key === 'Escape') {
        const titleElement = inputElement.parentElement;
        titleElement.textContent = originalTitle;
        titleElement.classList.remove('editing');
    }
}

// Industry Modal Functions
function openIndustryDetailsModal(subcategory, titleName) {
    const booleanOptions = categoryData['Industry'][subcategory][titleName] || [];
    
    document.getElementById('titleDetailsHeader').textContent = 'Boolean Search Details';
    document.getElementById('selectedTitleName').textContent = titleName;
    document.getElementById('selectedTitleName').setAttribute('data-original-title', titleName);
    document.getElementById('selectedTitleName').setAttribute('data-subcategory', subcategory);
    document.getElementById('selectedTitleName').removeAttribute('data-sub-subcategory');
    
    const existingOptions = document.getElementById('existingBooleanOptions');
    existingOptions.innerHTML = booleanOptions.map(option => `
        <div class="boolean-option-item">
            <span>${option}</span>
            <button class="delete-btn" onclick="removeBooleanOptionFromIndustry('${subcategory}', '${titleName}', '${option}')">Delete</button>
        </div>
    `).join('');
    
    document.getElementById('newBooleanOption').value = '';
    document.getElementById('titleDetailsModal').style.display = 'block';
    
    // Add click event to make title editable
    const titleElement = document.getElementById('selectedTitleName');
    titleElement.onclick = function() {
        makeIndustryTitleEditable(this);
    };
}

function editIndustryTitle(subcategory, titleName) {
    const newTitleName = prompt('Edit boolean search name:', titleName);
    if (newTitleName && newTitleName.trim() && newTitleName !== titleName) {
        const booleanOptions = categoryData['Industry'][subcategory][titleName];
        delete categoryData['Industry'][subcategory][titleName];
        categoryData['Industry'][subcategory][newTitleName.trim()] = booleanOptions;
        saveData();
        renderCategoryView();
    }
}

function deleteIndustryTitle(subcategory, titleName) {
    if (confirm('Are you sure you want to delete this boolean search?')) {
        delete categoryData['Industry'][subcategory][titleName];
        saveData();
        renderCategoryView();
    }
}



// Context Modal Functions
function openAddContextModal(subcategory) {
    currentContextSubcategory = subcategory;
    currentSubSubcategory = null; // Ensure not in Domain context
    document.getElementById('addTitleModal').style.display = 'block';
    document.getElementById('titleName').value = '';
    document.getElementById('booleanOptionsList').innerHTML = `
        <div class="boolean-option">
            <input type="text" placeholder="Boolean option" class="boolean-input" onkeypress="handleBooleanInputKeypress(event)">
            <button type="button" class="remove-option-btn" onclick="removeBooleanOption(this)">Remove</button>
        </div>
    `;
}

function openContextDetailsModal(subcategory, titleName) {
    const booleanOptions = categoryData['Context'][subcategory][titleName] || [];
    
    document.getElementById('titleDetailsHeader').textContent = 'Context Details';
    document.getElementById('selectedTitleName').textContent = titleName;
    document.getElementById('selectedTitleName').setAttribute('data-original-title', titleName);
    document.getElementById('selectedTitleName').setAttribute('data-subcategory', subcategory);
    
    const existingOptions = document.getElementById('existingBooleanOptions');
    existingOptions.innerHTML = booleanOptions.map(option => `
        <div class="boolean-option-item">
            <span>${option}</span>
            <button class="delete-btn" onclick="removeBooleanOptionFromContext('${subcategory}', '${titleName}', '${option}')">Delete</button>
        </div>
    `).join('');
    
    document.getElementById('newBooleanOption').value = '';
    document.getElementById('titleDetailsModal').style.display = 'block';
    
    // Add click event to make title editable
    const titleElement = document.getElementById('selectedTitleName');
    titleElement.onclick = function() {
        makeContextTitleEditable(this);
    };
}

function editContextTitle(subcategory, titleName) {
    const newTitleName = prompt('Edit context name:', titleName);
    if (newTitleName && newTitleName.trim() && newTitleName !== titleName) {
        const booleanOptions = categoryData['Context'][subcategory][titleName];
        delete categoryData['Context'][subcategory][titleName];
        categoryData['Context'][subcategory][newTitleName.trim()] = booleanOptions;
        saveData();
        renderCategoryView();
    }
}

function deleteContextTitle(subcategory, titleName) {
    if (confirm('Are you sure you want to delete this context?')) {
        delete categoryData['Context'][subcategory][titleName];
        saveData();
        renderCategoryView();
    }
}



// Certifications & Clearances Modal Functions
function openAddCertificationsModal(subcategory) {
    currentCertificationsSubcategory = subcategory;
    currentSubSubcategory = null; // Ensure not in Domain context
    document.getElementById('addTitleModal').style.display = 'block';
    document.getElementById('titleName').value = '';
    document.getElementById('booleanOptionsList').innerHTML = `
        <div class="boolean-option">
            <input type="text" placeholder="Boolean option" class="boolean-input" onkeypress="handleBooleanInputKeypress(event)">
            <button type="button" class="remove-option-btn" onclick="removeBooleanOption(this)">Remove</button>
        </div>
    `;
}

function openCertificationsDetailsModal(subcategory, titleName) {
    const booleanOptions = categoryData['Certifications & Clearances'][subcategory][titleName] || [];
    
    document.getElementById('titleDetailsHeader').textContent = 'Certification Details';
    document.getElementById('selectedTitleName').textContent = titleName;
    document.getElementById('selectedTitleName').setAttribute('data-original-title', titleName);
    document.getElementById('selectedTitleName').setAttribute('data-subcategory', subcategory);
    
    const existingOptions = document.getElementById('existingBooleanOptions');
    existingOptions.innerHTML = booleanOptions.map(option => `
        <div class="boolean-option-item">
            <span>${option}</span>
            <button class="delete-btn" onclick="removeBooleanOptionFromCertifications('${subcategory}', '${titleName}', '${option}')">Delete</button>
        </div>
    `).join('');
    
    document.getElementById('newBooleanOption').value = '';
    document.getElementById('titleDetailsModal').style.display = 'block';
    
    // Add click event to make title editable
    const titleElement = document.getElementById('selectedTitleName');
    titleElement.onclick = function() {
        makeCertificationsTitleEditable(this);
    };
}

function editCertificationsTitle(subcategory, titleName) {
    const newTitleName = prompt('Edit certification name:', titleName);
    if (newTitleName && newTitleName.trim() && newTitleName !== titleName) {
        const booleanOptions = categoryData['Certifications & Clearances'][subcategory][titleName];
        delete categoryData['Certifications & Clearances'][subcategory][titleName];
        categoryData['Certifications & Clearances'][subcategory][newTitleName.trim()] = booleanOptions;
        saveData();
        renderCategoryView();
    }
}

function deleteCertificationsTitle(subcategory, titleName) {
    if (confirm('Are you sure you want to delete this certification?')) {
        delete categoryData['Certifications & Clearances'][subcategory][titleName];
        saveData();
        renderCategoryView();
    }
}



// Debug function to check current data
function debugCurrentData() {
    console.log('Current categoryData:', categoryData);
    console.log('Current Titles data:', categoryData['Titles']);
    console.log('Technical titles:', categoryData['Titles']['Technical']);
    console.log('Functional titles:', categoryData['Titles']['Functional']);
}

// Test function to add a sample boolean search
function testAddBooleanSearch() {
    console.log('Testing add boolean search...');
    
    // Simulate adding a boolean search
    const testTitle = 'Test Boolean Search';
    const testOptions = ['option1', 'option2', 'option3'];
    
    // Add to Technical titles
    categoryData['Titles']['Technical'][testTitle] = testOptions;
    
    console.log('Added test data:', categoryData['Titles']['Technical']);
    
    // Save the data
    saveData();
    
    // Re-render the view
    renderCategoryView();
    
    console.log('Test complete. Check if the item appears in the list.');
}

// Add functions
function addItem(category) {
    const input = document.getElementById('newItem');
    const item = input.value.trim();
    
    if (item) {
        // Add to regular category
        categoryData[category].push(item);
        input.value = '';
        saveData();
        renderCategoryView();
    }
}



// Edit functions
function editTitle(subcategory, titleName) {
    const newTitleName = prompt('Edit title name:', titleName);
    if (newTitleName && newTitleName.trim() && newTitleName !== titleName) {
        const booleanOptions = categoryData['Titles'][subcategory][titleName];
        delete categoryData['Titles'][subcategory][titleName];
        categoryData['Titles'][subcategory][newTitleName.trim()] = booleanOptions;
        saveData();
        renderCategoryView();
    }
}

function editItem(category, index) {
    const currentItem = categoryData[category][index];
    
    const newItem = prompt('Edit item:', currentItem);
    if (newItem && newItem.trim()) {
        categoryData[category][index] = newItem.trim();
        saveData();
        renderCategoryView();
    }
}



// Delete functions
function deleteTitle(subcategory, titleName) {
    if (confirm('Are you sure you want to delete this title?')) {
        delete categoryData['Titles'][subcategory][titleName];
        saveData();
        renderCategoryView();
    }
}

function deleteItem(category, index) {
    if (confirm('Are you sure you want to delete this item?')) {
        categoryData[category].splice(index, 1);
        saveData();
        renderCategoryView();
    }
}



// Filter functions
function filterTitles(subcategory) {
    const searchTerm = document.getElementById('titleSearch').value.toLowerCase();
    const items = categoryData['Titles'][subcategory] || {};
    
    const filteredItems = Object.keys(items).filter(title => {
        // Search in title
        if (title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in boolean terms
        const booleanTerms = items[title] || [];
        return booleanTerms.some(term => term.toLowerCase().includes(searchTerm));
    });
    
    const filteredItemsObj = {};
    filteredItems.forEach(title => {
        filteredItemsObj[title] = items[title];
    });
    
    const listElement = document.getElementById('titlesList');
    listElement.innerHTML = renderTitlesList(Object.keys(filteredItemsObj), subcategory);
}

function filterItems(category) {
    const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
    const items = categoryData[category] || [];
    
    const filteredItems = items.filter(item => 
        item.toLowerCase().includes(searchTerm)
    );
    
    const listElement = document.getElementById('itemsList');
    listElement.innerHTML = renderItemsList(filteredItems);
}



// Boolean Builder Section
function setupBuilderSection() {
    // Setup role dashboard
    const addRoleBtn = document.getElementById('addNewRoleBtn');
    const backBtn = document.getElementById('backToDashboardBtn');
    const roleSearchInput = document.getElementById('roleSearch');
    
    addRoleBtn.addEventListener('click', addNewRole);
    backBtn.addEventListener('click', backToDashboard);
    roleSearchInput.addEventListener('input', filterRoles);
    
    // Setup operator buttons
    const operatorButtons = document.querySelectorAll('.operator-btn');
    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            insertAtCursor(this.getAttribute('data-value'));
        });
    });
    
    // Setup copy and clear buttons
    const copyBtn = document.getElementById('copyBooleanString');
    const clearBtn = document.getElementById('clearBooleanString');
    
    copyBtn.addEventListener('click', copyBooleanString);
    clearBtn.addEventListener('click', clearBooleanString);
    
    // Render roles dashboard
    renderRolesDashboard();
}

// Role Management Functions
function addNewRole() {
    // Clear previous values
    document.getElementById('newRoleTitle').value = '';
    document.getElementById('newRoleId').value = '';
    document.getElementById('newRoleClient').value = '';
    
    // Show the modal
    document.getElementById('newRoleModal').style.display = 'block';
}

function closeNewRoleModal() {
    document.getElementById('newRoleModal').style.display = 'none';
}

function createNewRole() {
    const title = document.getElementById('newRoleTitle').value.trim();
    const roleId = document.getElementById('newRoleId').value.trim();
    const client = document.getElementById('newRoleClient').value;
    
    if (!title) {
        alert('Please enter a role title.');
        return;
    }
    
    // Create role name from title and ID if provided
    let roleName = title;
    if (roleId) {
        roleName = `${title} - ${roleId}`;
    }
    
    const newRole = {
        id: Date.now().toString(),
        name: roleName,
        title: title,
        roleId: roleId,
        client: client,
        booleanString: '',
        recentlyUsedSearches: [],
        selectedKeywords: [],
        createdAt: new Date().toISOString()
    };
    
    roles.push(newRole);
    saveData();
    renderRolesDashboard();
    closeNewRoleModal();
}

function createNewRoleAndGoToBuilder() {
    const title = document.getElementById('newRoleTitle').value.trim();
    const roleId = document.getElementById('newRoleId').value.trim();
    const client = document.getElementById('newRoleClient').value;
    
    if (!title) {
        alert('Please enter a role title.');
        return;
    }
    
    // Create role name from title and ID if provided
    let roleName = title;
    if (roleId) {
        roleName = `${title} - ${roleId}`;
    }
    
    const newRole = {
        id: Date.now().toString(),
        name: roleName,
        title: title,
        roleId: roleId,
        client: client,
        booleanString: '',
        recentlyUsedSearches: [],
        selectedKeywords: [],
        createdAt: new Date().toISOString()
    };
    
    roles.push(newRole);
    saveData();
    
    // Set as current role and open keyword selector
    currentRole = newRole;
    closeNewRoleModal();
    openKeywordSelector();
}

function openKeywordSelector() {
    document.getElementById('keywordSelectorModal').style.display = 'block';
    renderKeywordSelector();
}

function closeKeywordSelectorModal() {
    document.getElementById('keywordSelectorModal').style.display = 'none';
}

function renderKeywordSelector() {
    const container = document.querySelector('.keyword-categories');
    if (!container) {
        console.error('Keyword categories container not found');
        return;
    }
    
    container.innerHTML = '';
    console.log('Rendering keyword selector...');
    
    // Get all categories from the directory
    const categories = [
        { name: 'Titles', key: 'titles' },
        { name: 'Domain', key: 'domain' },
        { name: 'Industry', key: 'industry' },
        { name: 'Context', key: 'context' },
        { name: 'Certifications & Clearances', key: 'certifications' }
    ];
    
    categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'keyword-category-section';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'keyword-category-header';
        categoryHeader.innerHTML = `
            <h4>${category.name}</h4>
            <div class="category-actions">
                <button class="select-all-category-btn" onclick="selectAllCategorySearches('${category.key}')">Select All Category</button>
                <span class="expand-icon">▼</span>
            </div>
        `;
        
        const categoryContent = document.createElement('div');
        categoryContent.className = 'keyword-category-content';
        
        // Add click handler to expand/collapse
        categoryHeader.addEventListener('click', () => {
            categoryContent.classList.toggle('expanded');
            const icon = categoryHeader.querySelector('.expand-icon');
            icon.textContent = categoryContent.classList.contains('expanded') ? '▲' : '▼';
        });
        
        // Render subcategories and boolean searches
        renderCategoryBooleanSearches(categoryContent, category.key);
        
        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(categoryContent);
        container.appendChild(categorySection);
    });
    
    console.log('Keyword selector rendering complete');
}

function renderCategoryBooleanSearches(container, categoryKey) {
    // Get the current data from localStorage
    const savedData = localStorage.getItem('plugINData');
    if (!savedData) {
        console.log('No data found in localStorage');
        // Show default subcategories even if no data exists
        renderDefaultSubcategories(container, categoryKey);
        return;
    }
    
    const data = JSON.parse(savedData);
    console.log('Loaded data:', data);
    
    const categoryData = data[categoryKey];
    if (!categoryData) {
        console.log(`No data found for category: ${categoryKey}`);
        // Show default subcategories even if no data exists
        renderDefaultSubcategories(container, categoryKey);
        return;
    }
    
    console.log(`Rendering ${categoryKey} with data:`, categoryData);
    
    Object.keys(categoryData).forEach(subcategory => {
        console.log(`Processing subcategory: ${subcategory}`);
        
        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.className = 'keyword-subcategory';
        
        const subcategoryHeader = document.createElement('div');
        subcategoryHeader.className = 'keyword-subcategory-header';
        subcategoryHeader.innerHTML = `
            <h5>${subcategory}</h5>
            <button class="select-all-btn" onclick="selectAllBooleanSearches('${categoryKey}', '${subcategory}')">Select All</button>
        `;
        
        const booleanSearchList = document.createElement('div');
        booleanSearchList.className = 'keyword-list';
        
        // Get boolean searches from this subcategory
        const booleanSearches = getBooleanSearchesFromSubcategory(categoryKey, subcategory);
        console.log(`Found ${booleanSearches.length} boolean searches for ${subcategory}:`, booleanSearches);
        
        if (booleanSearches.length === 0) {
            const noSearchesMsg = document.createElement('div');
            noSearchesMsg.style.padding = '10px';
            noSearchesMsg.style.color = '#7f8c8d';
            noSearchesMsg.style.fontStyle = 'italic';
            noSearchesMsg.textContent = 'No boolean searches found in this subcategory.';
            booleanSearchList.appendChild(noSearchesMsg);
        } else {
            booleanSearches.forEach(search => {
                const searchItem = document.createElement('div');
                searchItem.className = 'keyword-checkbox-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `search-${categoryKey}-${subcategory}-${search.title}`;
                checkbox.value = search.title;
                checkbox.dataset.category = categoryKey;
                checkbox.dataset.subcategory = subcategory;
                checkbox.dataset.searchData = JSON.stringify(search);
                
                const label = document.createElement('label');
                label.htmlFor = `search-${categoryKey}-${subcategory}-${search.title}`;
                label.textContent = search.title;
                
                searchItem.appendChild(checkbox);
                searchItem.appendChild(label);
                booleanSearchList.appendChild(searchItem);
            });
        }
        
        subcategoryDiv.appendChild(subcategoryHeader);
        subcategoryDiv.appendChild(booleanSearchList);
        container.appendChild(subcategoryDiv);
    });
}

function renderDefaultSubcategories(container, categoryKey) {
    const defaultSubcategories = {
        'titles': ['Technical', 'Functional'],
        'domain': ['Agile & Scrum', 'AI & Machine Learning', 'Architecture', 'Change & Transformation', 'Cyber Security', 'Data & Analytics', 'DevOps & Platform Engineering', 'Digital', 'Financial Crime', 'Infrastructure & Cloud', 'Payments & Banking Tech', 'Product & Design', 'Project Services', 'Risk & Compliance', 'Software Engineering', 'Testing & QA'],
        'industry': ['Insurance', 'Bank', 'Superannuation', 'Financial'],
        'context': ['Context'],
        'certifications': ['Certifications & Clearances']
    };
    
    const subcategories = defaultSubcategories[categoryKey] || [];
    
    subcategories.forEach(subcategory => {
        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.className = 'keyword-subcategory';
        
        const subcategoryHeader = document.createElement('div');
        subcategoryHeader.className = 'keyword-subcategory-header';
        subcategoryHeader.innerHTML = `
            <h5>${subcategory}</h5>
            <button class="select-all-btn" onclick="selectAllBooleanSearches('${categoryKey}', '${subcategory}')">Select All</button>
        `;
        
        const booleanSearchList = document.createElement('div');
        booleanSearchList.className = 'keyword-list';
        
        // Add a message for empty subcategories
        const noSearchesMsg = document.createElement('div');
        noSearchesMsg.style.padding = '10px';
        noSearchesMsg.style.color = '#7f8c8d';
        noSearchesMsg.style.fontStyle = 'italic';
        noSearchesMsg.textContent = 'No boolean searches found in this subcategory.';
        booleanSearchList.appendChild(noSearchesMsg);
        
        subcategoryDiv.appendChild(subcategoryHeader);
        subcategoryDiv.appendChild(booleanSearchList);
        container.appendChild(subcategoryDiv);
    });
}

function getBooleanSearchesFromSubcategory(categoryKey, subcategory) {
    // Get the current data from localStorage
    const savedData = localStorage.getItem('plugINData');
    if (!savedData) return [];
    
    const data = JSON.parse(savedData);
    const categoryData = data[categoryKey];
    if (!categoryData || !categoryData[subcategory]) return [];
    
    const booleanSearches = [];
    categoryData[subcategory].forEach(item => {
        if (item.booleanOptions && item.booleanOptions.length > 0) {
            booleanSearches.push({
                title: item.title,
                booleanOptions: item.booleanOptions,
                category: categoryKey,
                subcategory: subcategory
            });
        }
    });
    
    return booleanSearches;
}

function selectAllBooleanSearches(categoryKey, subcategory) {
    const checkboxes = document.querySelectorAll(`input[data-category="${categoryKey}"][data-subcategory="${subcategory}"]`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });
}

function selectAllCategorySearches(categoryKey) {
    const checkboxes = document.querySelectorAll(`input[data-category="${categoryKey}"]`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });
}

function saveSelectedKeywords() {
    const selectedBooleanSearches = [];
    const checkboxes = document.querySelectorAll('.keyword-checkbox-item input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const searchData = JSON.parse(checkbox.dataset.searchData);
        selectedBooleanSearches.push(searchData);
    });
    
    if (currentRole) {
        currentRole.selectedBooleanSearches = selectedBooleanSearches;
        saveData();
    }
    
    closeKeywordSelectorModal();
    
    // Go to boolean builder
    document.getElementById('roleDashboard').style.display = 'none';
    document.getElementById('booleanBuilder').style.display = 'block';
    document.getElementById('currentRoleTitle').textContent = `Boolean Builder - ${currentRole.name}`;
    
    // Load role-specific data
    document.getElementById('booleanString').value = currentRole.booleanString || '';
    recentlyUsedSearches = currentRole.recentlyUsedSearches || [];
    
    // Render role-specific content
    renderKeywordsFromDirectory();
    renderRecentlyUsedSearches();
    renderSelectedBooleanSearches();
}

function renderSelectedBooleanSearches() {
    const container = document.getElementById('keywordsContainer');
    if (!currentRole || !currentRole.selectedBooleanSearches || currentRole.selectedBooleanSearches.length === 0) {
        return;
    }
    
    // Add selected boolean searches section at the top
    const selectedSection = document.createElement('div');
    selectedSection.className = 'keyword-category';
    selectedSection.innerHTML = `
        <h4>Selected Boolean Searches</h4>
        <div class="keyword-list">
            ${currentRole.selectedBooleanSearches.map(search => `
                <div class="boolean-search-group">
                    <div class="search-title">${search.title}</div>
                    <div class="search-options">
                        ${search.booleanOptions.map(option => `
                            <button class="keyword-btn" onclick="insertAtCursor('${option.replace(/'/g, "\\'")}')">${option}</button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Insert at the beginning of the container
    container.insertBefore(selectedSection, container.firstChild);
}

function renderRolesDashboard(searchTerm = '') {
    const container = document.getElementById('rolesContainer');
    container.innerHTML = '';
    
    // Filter roles based on search term
    const filteredRoles = searchTerm 
        ? roles.filter(role => 
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (role.booleanString && role.booleanString.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : roles;
    
    if (roles.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #7f8c8d; font-style: italic; grid-column: 1 / -1;">
                <p>No roles created yet.</p>
                <p>Click "Add New Role" to get started!</p>
            </div>
        `;
        return;
    }
    
    if (filteredRoles.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #7f8c8d; font-style: italic; grid-column: 1 / -1;">
                <p>No roles found matching "${searchTerm}".</p>
                <p>Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    filteredRoles.forEach(role => {
        const roleCard = document.createElement('div');
        roleCard.className = 'role-card';
        
        const lastModified = role.lastModified ? new Date(role.lastModified).toLocaleDateString() : 'Never';
        const searchCount = role.recentlyUsedSearches ? role.recentlyUsedSearches.length : 0;
        
        // Highlight search term in role name if it matches
        let displayName = role.name;
        if (searchTerm && role.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            displayName = role.name.replace(regex, '<mark>$1</mark>');
        }
        
        roleCard.innerHTML = `
            <div class="role-title">${displayName}</div>
            <div class="role-info">
                Last modified: ${lastModified}<br>
                Recent searches: ${searchCount}
            </div>
            <div class="role-actions">
                <button class="role-action-btn open-role-btn" onclick="openRole('${role.id}')">Open</button>
                <button class="role-action-btn rename-role-btn" onclick="renameRole('${role.id}')">Rename</button>
                <button class="role-action-btn delete-role-btn" onclick="deleteRole('${role.id}')">Delete</button>
            </div>
        `;
        
        container.appendChild(roleCard);
    });
}

function filterRoles() {
    const searchTerm = document.getElementById('roleSearch').value.trim();
    renderRolesDashboard(searchTerm);
}

function openRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (role) {
        currentRole = role;
        
        // Switch to boolean builder view
        document.getElementById('roleDashboard').style.display = 'none';
        document.getElementById('booleanBuilder').style.display = 'block';
        
        // Update title
        document.getElementById('currentRoleTitle').textContent = `Boolean Builder - ${role.name}`;
        
        // Load role-specific data
        document.getElementById('booleanString').value = role.booleanString || '';
        recentlyUsedSearches = role.recentlyUsedSearches || [];
        
        // Render role-specific content
        renderKeywordsFromDirectory();
        renderRecentlyUsedSearches();
        renderSelectedBooleanSearches();
    }
}

function backToDashboard() {
    // Save current role data
    if (currentRole) {
        currentRole.booleanString = document.getElementById('booleanString').value;
        currentRole.recentlyUsedSearches = recentlyUsedSearches;
        currentRole.lastModified = new Date().toISOString();
        saveData();
    }
    
    // Switch back to dashboard
    document.getElementById('roleDashboard').style.display = 'block';
    document.getElementById('booleanBuilder').style.display = 'none';
    
    // Reset current role
    currentRole = null;
    recentlyUsedSearches = [];
    
    // Re-render dashboard
    renderRolesDashboard();
}

function renameRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (role) {
        const newName = prompt('Enter new name for this role:', role.name);
        if (newName && newName.trim() && newName !== role.name) {
            role.name = newName.trim();
            role.lastModified = new Date().toISOString();
            saveData();
            renderRolesDashboard();
        }
    }
}

function deleteRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (role) {
        if (confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
            roles = roles.filter(r => r.id !== roleId);
            saveData();
            renderRolesDashboard();
        }
    }
}

// Insert text at cursor position in the boolean string textarea
function insertAtCursor(text) {
    const textarea = document.getElementById('booleanString');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    textarea.value = value.substring(0, start) + text + value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
}

// Copy the boolean string to clipboard
function copyBooleanString() {
    const textarea = document.getElementById('booleanString');
    const searchString = textarea.value.trim();
    
    if (searchString) {
        // Add to recently used searches
        addToRecentlyUsed(searchString);
        
        // Save to current role
        if (currentRole) {
            currentRole.booleanString = searchString;
            currentRole.lastModified = new Date().toISOString();
            saveData();
        }
        
        // Copy to clipboard
        textarea.select();
    document.execCommand('copy');
        
        // Show feedback
        const copyBtn = document.getElementById('copyBooleanString');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '#27ae60';
        }, 2000);
    } else {
        alert('Please enter a search string before copying.');
    }
}

// Clear the boolean string
function clearBooleanString() {
    if (confirm('Are you sure you want to clear the boolean string?')) {
        document.getElementById('booleanString').value = '';
    }
}

// Add search to recently used
function addToRecentlyUsed(searchString) {
    // Remove if already exists (to move to top)
    recentlyUsedSearches = recentlyUsedSearches.filter(item => item.search !== searchString);
    
    // Add to beginning of array
    recentlyUsedSearches.unshift({
        search: searchString,
        date: new Date().toISOString()
    });
    
    // Keep only the last 10 searches
    if (recentlyUsedSearches.length > 10) {
        recentlyUsedSearches = recentlyUsedSearches.slice(0, 10);
    }
    
    // Save to current role if in role context
    if (currentRole) {
        currentRole.recentlyUsedSearches = recentlyUsedSearches;
        currentRole.lastModified = new Date().toISOString();
    }
    
    saveData();
    renderRecentlyUsedSearches();
}

// Render recently used searches
function renderRecentlyUsedSearches() {
    const container = document.getElementById('recentlyUsedContainer');
    container.innerHTML = '';
    
    if (recentlyUsedSearches.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d; font-style: italic; text-align: center;">No recently used searches. Copy a search to see it here.</p>';
        return;
    }
    
    recentlyUsedSearches.forEach((item, index) => {
        const searchDiv = document.createElement('div');
        searchDiv.className = 'recent-search-item';
        
        const searchText = document.createElement('div');
        searchText.className = 'recent-search-text';
        searchText.textContent = item.search;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'recent-search-actions';
        
        const useBtn = document.createElement('button');
        useBtn.className = 'recent-search-btn use-search-btn';
        useBtn.textContent = 'Use';
        useBtn.onclick = () => useRecentSearch(item.search);
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'recent-search-btn copy-search-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => copyRecentSearch(item.search);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'recent-search-btn delete-search-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteRecentSearch(index);
        
        actionsDiv.appendChild(useBtn);
        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(deleteBtn);
        
        searchDiv.appendChild(searchText);
        searchDiv.appendChild(actionsDiv);
        
        container.appendChild(searchDiv);
    });
}

// Use a recent search
function useRecentSearch(searchString) {
    document.getElementById('booleanString').value = searchString;
    document.getElementById('booleanString').focus();
}

// Copy a recent search to clipboard
function copyRecentSearch(searchString) {
    // Create a temporary textarea to copy the text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = searchString;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    
    // Show feedback
    const copyBtn = event.target;
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    copyBtn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = '#f39c12';
    }, 2000);
}

// Delete a recent search
function deleteRecentSearch(index) {
    if (confirm('Are you sure you want to delete this search from recently used?')) {
        recentlyUsedSearches.splice(index, 1);
        saveData();
        renderRecentlyUsedSearches();
    }
}

// Render keywords from directory
function renderKeywordsFromDirectory() {
    const container = document.getElementById('keywordsContainer');
    container.innerHTML = '';
    
    // Render Titles
    renderKeywordCategory(container, 'Titles', 'Titles', () => {
        const keywords = [];
        Object.keys(categoryData['Titles']['Technical'] || {}).forEach(title => {
            const options = categoryData['Titles']['Technical'][title] || [];
            options.forEach(option => keywords.push(option));
        });
        Object.keys(categoryData['Titles']['Functional'] || {}).forEach(title => {
            const options = categoryData['Titles']['Functional'][title] || [];
            options.forEach(option => keywords.push(option));
        });
        return keywords;
    });
    
    // Render Domain
    renderKeywordCategory(container, 'Domain', 'Domain', () => {
        const keywords = [];
        Object.keys(categoryData['Domain'] || {}).forEach(subcategory => {
            Object.keys(categoryData['Domain'][subcategory] || {}).forEach(subSubcategory => {
                Object.keys(categoryData['Domain'][subcategory][subSubcategory] || {}).forEach(title => {
                    const options = categoryData['Domain'][subcategory][subSubcategory][title] || [];
                    options.forEach(option => keywords.push(option));
                });
            });
        });
        return keywords;
    });
    
    // Render Industry
    renderKeywordCategory(container, 'Industry', 'Industry', () => {
        const keywords = [];
        Object.keys(categoryData['Industry'] || {}).forEach(subcategory => {
            Object.keys(categoryData['Industry'][subcategory] || {}).forEach(title => {
                const options = categoryData['Industry'][subcategory][title] || [];
                options.forEach(option => keywords.push(option));
            });
        });
        return keywords;
    });
    
    // Render Context
    renderKeywordCategory(container, 'Context', 'Context', () => {
        const keywords = [];
        Object.keys(categoryData['Context'] || {}).forEach(subcategory => {
            Object.keys(categoryData['Context'][subcategory] || {}).forEach(title => {
                const options = categoryData['Context'][subcategory][title] || [];
                options.forEach(option => keywords.push(option));
            });
        });
        return keywords;
    });
    
    // Render Certifications & Clearances
    renderKeywordCategory(container, 'Certifications & Clearances', 'Certifications & Clearances', () => {
        const keywords = [];
        Object.keys(categoryData['Certifications & Clearances'] || {}).forEach(subcategory => {
            Object.keys(categoryData['Certifications & Clearances'][subcategory] || {}).forEach(title => {
                const options = categoryData['Certifications & Clearances'][subcategory][title] || [];
                options.forEach(option => keywords.push(option));
            });
        });
        return keywords;
    });
}

// Render a keyword category
function renderKeywordCategory(container, categoryName, displayName, getKeywordsFunction) {
    const keywords = getKeywordsFunction();
    
    if (keywords.length > 0) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'keyword-category';
        
        const title = document.createElement('h4');
        title.textContent = displayName;
        categoryDiv.appendChild(title);
        
        const keywordList = document.createElement('div');
        keywordList.className = 'keyword-list';
        
        // Remove duplicates and sort
        const uniqueKeywords = [...new Set(keywords)].sort();
        
        uniqueKeywords.forEach(keyword => {
            const keywordBtn = document.createElement('button');
            keywordBtn.className = 'keyword-btn';
            keywordBtn.textContent = keyword;
            keywordBtn.addEventListener('click', function() {
                // Check if keyword already has quotes
                if (keyword.startsWith('"') && keyword.endsWith('"')) {
                    insertAtCursor(keyword);
                } else {
                    insertAtCursor(`"${keyword}"`);
                }
            });
            keywordList.appendChild(keywordBtn);
        });
        
        categoryDiv.appendChild(keywordList);
        container.appendChild(categoryDiv);
    }
}

// Trainer Section
function setupTrainerSection() {
    const saveTrainingBtn = document.getElementById('saveTraining');
    saveTrainingBtn.addEventListener('click', saveTraining);
}

function saveTraining() {
    const titleInput = document.getElementById('trainingTitle');
    const contentInput = document.getElementById('trainingContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (title && content) {
        trainingContent.push({
            title: title,
            content: content,
            date: new Date().toLocaleDateString()
        });
        
        titleInput.value = '';
        contentInput.value = '';
        saveData();
        renderTrainingList();
    }
}

// Rendering functions
function renderAll() {
    renderCategoryList();
    renderCategorySelects();
    renderRolesDashboard();
    renderKeywordsFromDirectory();
    renderRecentlyUsedSearches();
    renderTrainingList();
}

function renderCategoryList() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    
    // Render Primary Categories
    const primarySection = document.createElement('div');
    primarySection.innerHTML = '<h4 style="color: #2c3e50; margin: 10px 0 5px 0; font-weight: bold;">Primary Categories</h4>';
    categoryList.appendChild(primarySection);
    
    categories.primary.forEach(category => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.setAttribute('data-category', category);
        div.innerHTML = `<span>${category}</span>`;
        categoryList.appendChild(div);
    });
    
    // Render Secondary Categories
    const secondarySection = document.createElement('div');
    secondarySection.innerHTML = '<h4 style="color: #2c3e50; margin: 15px 0 5px 0; font-weight: bold;">Secondary Categories</h4>';
    categoryList.appendChild(secondarySection);
    
    categories.secondary.forEach(category => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.setAttribute('data-category', category);
        div.innerHTML = `<span>${category}</span>`;
        categoryList.appendChild(div);
    });
}

function getCategoryItemCount(category) {
    if (category === 'Titles') {
        const technicalCount = Object.keys(categoryData['Titles']['Technical'] || {}).length;
        const functionalCount = Object.keys(categoryData['Titles']['Functional'] || {}).length;
        return technicalCount + functionalCount;
    } else if (category === 'Domain') {
        let totalCount = 0;
        Object.keys(categoryData['Domain'] || {}).forEach(subcategory => {
            Object.keys(categoryData['Domain'][subcategory] || {}).forEach(subSubcategory => {
                totalCount += Object.keys(categoryData['Domain'][subcategory][subSubcategory] || {}).length;
            });
        });
        return totalCount;
    } else if (category === 'Industry') {
        let totalCount = 0;
        Object.keys(categoryData['Industry'] || {}).forEach(subcategory => {
            totalCount += Object.keys(categoryData['Industry'][subcategory] || {}).length;
        });
        return totalCount;
    } else if (category === 'Context') {
        let totalCount = 0;
        Object.keys(categoryData['Context'] || {}).forEach(subcategory => {
            totalCount += Object.keys(categoryData['Context'][subcategory] || {}).length;
        });
        return totalCount;
    } else if (category === 'Certifications & Clearances') {
        let totalCount = 0;
        Object.keys(categoryData['Certifications & Clearances'] || {}).forEach(subcategory => {
            totalCount += Object.keys(categoryData['Certifications & Clearances'][subcategory] || {}).length;
        });
        return totalCount;
    }
    return categoryData[category] ? categoryData[category].length : 0;
}

function renderCategorySelects() {
    const select = document.getElementById('builderCategory');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">Select category</option>';
    
    // Add Primary Categories
    if (categories.primary.length > 0) {
        const primaryOptgroup = document.createElement('optgroup');
        primaryOptgroup.label = 'Primary Categories';
        categories.primary.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            primaryOptgroup.appendChild(option);
        });
        select.appendChild(primaryOptgroup);
    }
    
    // Add Secondary Categories
    if (categories.secondary.length > 0) {
        const secondaryOptgroup = document.createElement('optgroup');
        secondaryOptgroup.label = 'Secondary Categories';
        categories.secondary.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            secondaryOptgroup.appendChild(option);
        });
        select.appendChild(secondaryOptgroup);
    }
    
    select.value = currentValue;
}

function renderSearchBuilder() {
    const searchBuilder = document.getElementById('searchBuilder');
    searchBuilder.innerHTML = '';
    
    if (currentSearch.length === 0) {
        searchBuilder.innerHTML = '<p style="color: #666; font-style: italic;">No search terms added yet.</p>';
        return;
    }
    
    currentSearch.forEach((searchGroup, index) => {
        const div = document.createElement('div');
        div.style.marginBottom = '10px';
        div.style.padding = '10px';
        div.style.backgroundColor = '#f8f9fa';
        div.style.borderRadius = '4px';
        div.innerHTML = `
            <strong>${searchGroup.category}:</strong> ${searchGroup.keywords.join(' OR ')}
            <button class="delete-btn" onclick="removeFromSearch(${index})" style="float: right;">Remove</button>
        `;
        searchBuilder.appendChild(div);
    });
}

function renderTrainingList() {
    const trainingList = document.getElementById('trainingList');
    trainingList.innerHTML = '';
    
    trainingContent.forEach((training, index) => {
        const div = document.createElement('div');
        div.className = 'training-item';
        div.innerHTML = `
            <h4>${training.title}</h4>
            <p><small>${training.date}</small></p>
            <p>${training.content}</p>
            <button class="delete-btn" onclick="deleteTraining(${index})">Delete</button>
        `;
        trainingList.appendChild(div);
    });
}

function updateSearchString() {
    const searchString = document.getElementById('searchString');
    let result = '';
    
    if (currentSearch.length > 0) {
        const searchGroups = currentSearch.map(group => 
            `(${group.keywords.join(' OR ')})`
        );
        result = searchGroups.join(' AND ');
    }
    
    searchString.value = result;
}

function removeFromSearch(index) {
    currentSearch.splice(index, 1);
    renderSearchBuilder();
    updateSearchString();
}

function deleteTraining(index) {
    trainingContent.splice(index, 1);
    saveData();
    renderTrainingList();
}

// Data persistence
function saveData() {
    const data = {
        categories: categories,
        categoryData: categoryData,
        trainingContent: trainingContent,
        recentlyUsedSearches: recentlyUsedSearches,
        roles: roles,
        lastSaved: new Date().toISOString()
    };
    
    try {
    localStorage.setItem('pluginData', JSON.stringify(data));
        console.log('Data saved successfully at:', new Date().toLocaleString());
        updateDataStatus();
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Warning: Could not save data to localStorage. Your data may not be preserved.');
    }
}

function updateDataStatus() {
    const statusElement = document.getElementById('dataStatus');
    if (statusElement) {
        const savedData = localStorage.getItem('pluginData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.lastSaved) {
                    const lastSaved = new Date(data.lastSaved);
                    const now = new Date();
                    const diffMinutes = Math.floor((now - lastSaved) / (1000 * 60));
                    
                    if (diffMinutes < 1) {
                        statusElement.textContent = '✓ Saved now';
                        statusElement.style.backgroundColor = '#27ae60';
                    } else if (diffMinutes < 5) {
                        statusElement.textContent = `✓ Saved ${diffMinutes}m ago`;
                        statusElement.style.backgroundColor = '#27ae60';
                    } else if (diffMinutes < 60) {
                        statusElement.textContent = `✓ Saved ${diffMinutes}m ago`;
                        statusElement.style.backgroundColor = '#f39c12';
                    } else {
                        const diffHours = Math.floor(diffMinutes / 60);
                        statusElement.textContent = `✓ Saved ${diffHours}h ago`;
                        statusElement.style.backgroundColor = '#e74c3c';
                    }
                } else {
                    statusElement.textContent = '⚠ No save time';
                    statusElement.style.backgroundColor = '#e74c3c';
                }
            } catch (error) {
                statusElement.textContent = '⚠ Error';
                statusElement.style.backgroundColor = '#e74c3c';
            }
        } else {
            statusElement.textContent = '⚠ No data';
            statusElement.style.backgroundColor = '#e74c3c';
        }
    }
}

// Backup and restore functions
function exportData() {
    const data = {
        categories: categories,
        categoryData: categoryData,
        trainingContent: trainingContent,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `plugin-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Backup exported successfully!');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validate the imported data structure
                    if (importedData.categoryData && importedData.categories) {
                        categories = importedData.categories;
                        categoryData = importedData.categoryData;
                        trainingContent = importedData.trainingContent || [];
                        
                        saveData();
                        renderAll();
                        alert('Data imported successfully!');
                    } else {
                        alert('Invalid backup file format.');
                    }
                } catch (error) {
                    console.error('Error importing data:', error);
                    alert('Error importing backup file. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
        if (confirm('This will delete all your boolean searches, training content, and settings. Are you absolutely sure?')) {
            localStorage.removeItem('pluginData');
            initializeDefaultData();
            renderAll();
            alert('All data has been cleared.');
        }
    }
}

function forceReload() {
    console.log('Force reloading data...');
    loadData();
    renderAll();
    console.log('Reload complete. Current categoryData:', categoryData);
}

function loadData() {
    const savedData = localStorage.getItem('pluginData');
    if (savedData) {
        try {
        const data = JSON.parse(savedData);
        categories = data.categories || {
            primary: ['Titles', 'Domain', 'Industry'],
            secondary: ['Context', 'Certifications & Clearances']
        };
            
            // Load saved data but ensure proper structure
            categoryData = data.categoryData || {};
            
            // Ensure all required structures exist
            if (!categoryData['Titles']) categoryData['Titles'] = {};
            if (!categoryData['Titles']['Technical']) categoryData['Titles']['Technical'] = {};
            if (!categoryData['Titles']['Functional']) categoryData['Titles']['Functional'] = {};
            
            if (!categoryData['Domain']) categoryData['Domain'] = {};
            if (!categoryData['Industry']) categoryData['Industry'] = {};
            if (!categoryData['Context']) categoryData['Context'] = {};
            if (!categoryData['Certifications & Clearances']) categoryData['Certifications & Clearances'] = {};
            
            // Ensure all Domain subcategories exist and migrate old data structure
            const domainSubcategories = [
                'Agile & Scrum', 'AI & Machine Learning', 'Architecture', 'Change & Transformation',
                'Cyber Security', 'Data & Analytics', 'DevOps & Platform Engineering', 'Digital',
                'Financial Crime', 'Infrastructure & Cloud', 'Payments & Banking Tech', 'Product & Design',
                'Project Services', 'Risk & Compliance', 'Software Engineering', 'Testing & QA'
            ];
            domainSubcategories.forEach(sub => {
                if (!categoryData['Domain'][sub]) categoryData['Domain'][sub] = {};
                
                // Migrate old array structure to object structure
                if (Array.isArray(categoryData['Domain'][sub])) {
                    console.log('Migrating old array structure for Domain subcategory:', sub);
                    const oldArray = categoryData['Domain'][sub];
                    categoryData['Domain'][sub] = {};
                    
                    // Convert array items to object structure
                    oldArray.forEach((item, index) => {
                        if (typeof item === 'string') {
                            categoryData['Domain'][sub][`Item ${index + 1}`] = [item];
                        } else if (typeof item === 'object' && item !== null) {
                            // If it's already an object, keep it
                            Object.keys(item).forEach(key => {
                                categoryData['Domain'][sub][key] = item[key];
                            });
                        }
                    });
                }
                
                // Ensure sub-subcategories exist as objects
                const subSubcategories = ['Technology', 'Framework', 'Action'];
                subSubcategories.forEach(subSub => {
                    if (!categoryData['Domain'][sub][subSub]) {
                        categoryData['Domain'][sub][subSub] = {};
                    } else if (Array.isArray(categoryData['Domain'][sub][subSub])) {
                        // Migrate sub-subcategory from array to object
                        console.log('Migrating sub-subcategory array to object:', sub, subSub);
                        const oldArray = categoryData['Domain'][sub][subSub];
                        categoryData['Domain'][sub][subSub] = {};
                        
                        oldArray.forEach((item, index) => {
                            if (typeof item === 'string') {
                                categoryData['Domain'][sub][subSub][`Item ${index + 1}`] = [item];
                            } else if (typeof item === 'object' && item !== null) {
                                Object.keys(item).forEach(key => {
                                    categoryData['Domain'][sub][subSub][key] = item[key];
                                });
                            }
                        });
                    }
                });
            });
            
            // Ensure all Industry subcategories exist
            const industrySubcategories = ['Insurance', 'Bank', 'Superannuation', 'Financial'];
            industrySubcategories.forEach(sub => {
                if (!categoryData['Industry'][sub]) categoryData['Industry'][sub] = {};
            });
            
            // Ensure all Certifications subcategories exist
            const certSubcategories = [
                'Federal Government Clearances', 'Technical Certifications', 'Delivery Certifications',
                'Product & Design Certifications', 'Financial Certifications'
            ];
            certSubcategories.forEach(sub => {
                if (!categoryData['Certifications & Clearances'][sub]) categoryData['Certifications & Clearances'][sub] = {};
            });
            
            trainingContent = data.trainingContent || [];
            recentlyUsedSearches = data.recentlyUsedSearches || [];
            roles = data.roles || [];
            
            console.log('Data loaded successfully:', categoryData);
        } catch (error) {
            console.error('Error loading data:', error);
            // If there's an error, initialize with default data
            initializeDefaultData();
        }
    } else {
        // Initialize with default data if no saved data exists
        initializeDefaultData();
    }
}

function initializeDefaultData() {
    categories = {
        primary: ['Titles', 'Domain', 'Industry'],
        secondary: ['Context', 'Certifications & Clearances']
    };
    categoryData = {
            'Titles': { 'Technical': {}, 'Functional': {} },
            'Domain': {
                'Agile & Scrum': {},
                'AI & Machine Learning': {},
                'Architecture': {},
                'Change & Transformation': {},
                'Cyber Security': {},
                'Data & Analytics': {},
                'DevOps & Platform Engineering': {},
                'Digital': {},
                'Financial Crime': {},
                'Infrastructure & Cloud': {},
                'Payments & Banking Tech': {},
                'Product & Design': {},
                'Project Services': {},
                'Risk & Compliance': {},
                'Software Engineering': {},
                'Testing & QA': {}
            },
            'Industry': {
                'Insurance': {},
                'Bank': {},
                'Superannuation': {},
                'Financial': {}
            },
        'Context': {},
        'Certifications & Clearances': {
            'Federal Government Clearances': {},
            'Technical Certifications': {},
            'Delivery Certifications': {},
            'Product & Design Certifications': {},
            'Financial Certifications': {}
        }
    };
    trainingContent = [];
} 