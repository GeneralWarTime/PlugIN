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
    'Context': [],
    'Certifications & Clearances': []
};

let currentSearch = [];
let trainingContent = [];
let selectedCategory = null;
let currentSubcategory = null;
let currentSubSubcategory = null;

// Modal management for Industry boolean searches
let currentIndustrySubcategory = null;

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
    
    // Add Enter key support for new boolean option input
    document.getElementById('newBooleanOption').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addNewBooleanOption();
        }
    });
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
            <div class="add-item-controls">
                <button onclick="openAddTitleModal('${subcategory}')" class="add-title-btn">Add Title</button>
            </div>
            <div class="search-filter">
                <input type="text" id="titleSearch" placeholder="Search titles..." onkeyup="filterTitles('${subcategory}')">
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
    // Initialize the data structure if it doesn't exist
    if (!categoryData['Domain'][subcategory]) {
        categoryData['Domain'][subcategory] = {};
    }
    if (!categoryData['Domain'][subcategory][subSubcategory]) {
        categoryData['Domain'][subcategory][subSubcategory] = [];
    }
    
    const items = categoryData['Domain'][subcategory][subSubcategory] || [];
    
    contentElement.innerHTML = `
        <div class="category-management">
            <div class="add-item-controls">
                <button onclick="openAddDomainModal('${subcategory}', '${subSubcategory}')" class="add-title-btn">Add Boolean Search</button>
            </div>
            <div class="search-filter">
                <input type="text" id="itemSearch" placeholder="Search boolean searches..." onkeyup="filterDomainItems('${subcategory}', '${subSubcategory}')">
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
    
    return Object.keys(items).map((title, index) => `
        <div class="item-row">
            <span class="item-text">${title}</span>
            <div class="item-actions">
                <button class="boolean-options-btn" onclick="openDomainDetailsModal('${subcategory}', '${subSubcategory}', '${title}')">Boolean Options</button>
                <button class="edit-btn" onclick="editDomainTitle('${subcategory}', '${subSubcategory}', '${title}')">Edit</button>
                <button class="delete-btn" onclick="deleteDomainTitle('${subcategory}', '${subSubcategory}', '${title}')">Delete</button>
            </div>
        </div>
    `).join('');
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
    
    const filteredItems = Object.keys(items).filter(title => 
        title.toLowerCase().includes(searchTerm)
    );
    
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
            <span>${option}</span>
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

function removeBooleanOptionFromDomain(subcategory, subSubcategory, titleName, option) {
    if (confirm('Are you sure you want to remove this boolean option?')) {
        categoryData['Domain'][subcategory][subSubcategory][titleName] = categoryData['Domain'][subcategory][subSubcategory][titleName].filter(opt => opt !== option);
        saveData();
        openDomainDetailsModal(subcategory, subSubcategory, titleName);
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
            <div class="add-item-controls">
                <button onclick="openAddIndustryModal('${subcategory}')" class="add-title-btn">Add Boolean Search</button>
            </div>
            <div class="search-filter">
                <input type="text" id="itemSearch" placeholder="Search boolean searches..." onkeyup="filterIndustryItems('${subcategory}')">
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
    
    return Object.keys(items).map((title, index) => `
        <div class="item-row">
            <span class="item-text">${title}</span>
            <div class="item-actions">
                <button class="boolean-options-btn" onclick="openIndustryDetailsModal('${subcategory}', '${title}')">Boolean Options</button>
                <button class="edit-btn" onclick="editIndustryTitle('${subcategory}', '${title}')">Edit</button>
                <button class="delete-btn" onclick="deleteIndustryTitle('${subcategory}', '${title}')">Delete</button>
            </div>
        </div>
    `).join('');
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
    
    const filteredItems = Object.keys(items).filter(title => 
        title.toLowerCase().includes(searchTerm)
    );
    
    const filteredItemsObj = {};
    filteredItems.forEach(title => {
        filteredItemsObj[title] = items[title];
    });
    
    const listElement = document.getElementById('itemsList');
    listElement.innerHTML = renderIndustryItemsList(filteredItemsObj, subcategory);
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
        return '<p style="color: #7f8c8d; font-style: italic;">No titles added yet.</p>';
    }
    
    return titles.map((title, index) => `
        <div class="item-row">
            <span class="item-text">${title}</span>
            <div class="item-actions">
                <button class="boolean-options-btn" onclick="openTitleDetailsModal('${subcategory}', '${title}')">Boolean Options</button>
                <button class="edit-btn" onclick="editTitle('${subcategory}', '${title}')">Edit</button>
                <button class="delete-btn" onclick="deleteTitle('${subcategory}', '${title}')">Delete</button>
            </div>
        </div>
    `).join('');
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
    document.getElementById('booleanOptionsList').innerHTML = `
        <div class="boolean-option">
            <input type="text" placeholder="Boolean option" class="boolean-input" onkeypress="handleBooleanInputKeypress(event)">
            <button type="button" class="remove-option-btn" onclick="removeBooleanOption(this)">Remove</button>
        </div>
    `;
}

function closeModal() {
    document.getElementById('addTitleModal').style.display = 'none';
}

function addBooleanOption() {
    const container = document.getElementById('booleanOptionsList');
    const newOption = document.createElement('div');
    newOption.className = 'boolean-option';
    newOption.innerHTML = `
        <input type="text" placeholder="Boolean option" class="boolean-input" onkeypress="handleBooleanInputKeypress(event)">
        <button type="button" class="remove-option-btn" onclick="removeBooleanOption(this)">Remove</button>
    `;
    container.appendChild(newOption);
}

function handleBooleanInputKeypress(event) {
    if (event.key === 'Enter') {
        addBooleanOption();
        // Focus the newly created input
        setTimeout(() => {
            const inputs = document.querySelectorAll('.boolean-input');
            if (inputs.length > 0) {
                inputs[inputs.length - 1].focus();
            }
        }, 10);
    }
}

function removeBooleanOption(button) {
    const options = document.querySelectorAll('.boolean-option');
    if (options.length > 1) {
        button.parentElement.remove();
    }
}

function saveTitle() {
    const titleName = document.getElementById('titleName').value.trim();
    const booleanInputs = document.querySelectorAll('.boolean-input');
    const booleanOptions = Array.from(booleanInputs)
        .map(input => input.value.trim())
        .filter(option => option.length > 0);
    
    if (titleName && booleanOptions.length > 0) {
        if (currentSubSubcategory) {
            // Save to Domain
            if (!categoryData['Domain'][currentSubcategory]) {
                categoryData['Domain'][currentSubcategory] = {};
            }
            if (!categoryData['Domain'][currentSubcategory][currentSubSubcategory]) {
                categoryData['Domain'][currentSubcategory][currentSubSubcategory] = {};
            }
            categoryData['Domain'][currentSubcategory][currentSubSubcategory][titleName] = booleanOptions;
        } else if (currentIndustrySubcategory) {
            // Save to Industry
            if (!categoryData['Industry'][currentIndustrySubcategory]) {
                categoryData['Industry'][currentIndustrySubcategory] = {};
            }
            categoryData['Industry'][currentIndustrySubcategory][titleName] = booleanOptions;
        } else {
            // Save to Titles
            categoryData['Titles'][currentSubcategory][titleName] = booleanOptions;
        }
        saveData();
        closeModal();
        renderCategoryView();
        renderAll();
        currentIndustrySubcategory = null; // Reset after save
    } else {
        alert('Please enter a title name and at least one boolean option.');
    }
}

function openTitleDetailsModal(subcategory, titleName) {
    const booleanOptions = categoryData['Titles'][subcategory][titleName] || [];
    
    document.getElementById('titleDetailsHeader').textContent = 'Title Details';
    document.getElementById('selectedTitleName').textContent = titleName;
    document.getElementById('selectedTitleName').setAttribute('data-original-title', titleName);
    document.getElementById('selectedTitleName').setAttribute('data-subcategory', subcategory);
    
    const existingOptions = document.getElementById('existingBooleanOptions');
    existingOptions.innerHTML = booleanOptions.map(option => `
        <div class="boolean-option-item">
            <span>${option}</span>
            <button class="delete-btn" onclick="removeBooleanOptionFromTitle('${subcategory}', '${titleName}', '${option}')">Delete</button>
        </div>
    `).join('');
    
    document.getElementById('newBooleanOption').value = '';
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

function addNewBooleanOption() {
    const newOption = document.getElementById('newBooleanOption').value.trim();
    const titleName = document.getElementById('selectedTitleName').textContent;
    const subSubcategory = document.getElementById('selectedTitleName').getAttribute('data-sub-subcategory');
    const subcategory = document.getElementById('selectedTitleName').getAttribute('data-subcategory');
    
    if (newOption) {
        if (subSubcategory) {
            // Add to Domain
            if (!categoryData['Domain'][subcategory][subSubcategory][titleName]) {
                categoryData['Domain'][subcategory][subSubcategory][titleName] = [];
            }
            categoryData['Domain'][subcategory][subSubcategory][titleName].push(newOption);
            saveData();
            openDomainDetailsModal(subcategory, subSubcategory, titleName);
        } else if (currentIndustrySubcategory && subcategory === currentIndustrySubcategory) {
            // Add to Industry
            if (!categoryData['Industry'][subcategory][titleName]) {
                categoryData['Industry'][subcategory][titleName] = [];
            }
            categoryData['Industry'][subcategory][titleName].push(newOption);
            saveData();
            openIndustryDetailsModal(subcategory, titleName);
        } else {
            // Add to Titles
            if (!categoryData['Titles'][currentSubcategory][titleName]) {
                categoryData['Titles'][currentSubcategory][titleName] = [];
            }
            categoryData['Titles'][currentSubcategory][titleName].push(newOption);
            saveData();
            openTitleDetailsModal(currentSubcategory, titleName);
        }
    }
}

function removeBooleanOptionFromTitle(subcategory, titleName, option) {
    if (confirm('Are you sure you want to remove this boolean option?')) {
        categoryData['Titles'][subcategory][titleName] = categoryData['Titles'][subcategory][titleName].filter(opt => opt !== option);
        saveData();
        openTitleDetailsModal(subcategory, titleName);
    }
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

function removeBooleanOptionFromIndustry(subcategory, titleName, option) {
    if (confirm('Are you sure you want to remove this boolean option?')) {
        categoryData['Industry'][subcategory][titleName] = categoryData['Industry'][subcategory][titleName].filter(opt => opt !== option);
        saveData();
        openIndustryDetailsModal(subcategory, titleName);
    }
}

function makeIndustryTitleEditable(titleElement) {
    const currentTitle = titleElement.textContent;
    const originalTitle = titleElement.getAttribute('data-original-title');
    const subcategory = titleElement.getAttribute('data-subcategory');
    
    titleElement.classList.add('editing');
    titleElement.innerHTML = `<input type="text" value="${currentTitle}" onblur="saveIndustryTitleEdit(this, '${subcategory}', '${originalTitle}')" onkeypress="handleIndustryTitleEditKeypress(event, this, '${subcategory}', '${originalTitle}')">`;
    
    const input = titleElement.querySelector('input');
    input.focus();
    input.select();
}

function saveIndustryTitleEdit(inputElement, subcategory, originalTitle) {
    const newTitle = inputElement.value.trim();
    const titleElement = inputElement.parentElement;
    
    if (newTitle && newTitle !== originalTitle) {
        const booleanOptions = categoryData['Industry'][subcategory][originalTitle];
        delete categoryData['Industry'][subcategory][originalTitle];
        categoryData['Industry'][subcategory][newTitle] = booleanOptions;
        
        titleElement.textContent = newTitle;
        titleElement.setAttribute('data-original-title', newTitle);
        
        saveData();
    } else {
        titleElement.textContent = originalTitle;
    }
    
    titleElement.classList.remove('editing');
}

function handleIndustryTitleEditKeypress(event, inputElement, subcategory, originalTitle) {
    if (event.key === 'Enter') {
        inputElement.blur();
    } else if (event.key === 'Escape') {
        const titleElement = inputElement.parentElement;
        titleElement.textContent = originalTitle;
        titleElement.classList.remove('editing');
    }
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
    const titles = Object.keys(categoryData['Titles'][subcategory] || {});
    const filteredTitles = titles.filter(title => 
        title.toLowerCase().includes(searchTerm)
    );
    
    const listElement = document.getElementById('titlesList');
    listElement.innerHTML = renderTitlesList(filteredTitles, subcategory);
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



// Builder Section
function setupBuilderSection() {
    const addToSearchBtn = document.getElementById('addToSearch');
    const clearSearchBtn = document.getElementById('clearSearch');
    const copySearchBtn = document.getElementById('copySearch');
    
    addToSearchBtn.addEventListener('click', addToSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    copySearchBtn.addEventListener('click', copySearch);
}

function addToSearch() {
    const select = document.getElementById('builderCategory');
    const category = select.value;
    
    if (category) {
        let keywords = [];
        
        if (category === 'Titles') {
            // Get all titles from both Technical and Functional
            const technicalTitles = Object.keys(categoryData['Titles']['Technical'] || {});
            const functionalTitles = Object.keys(categoryData['Titles']['Functional'] || {});
            keywords = [...technicalTitles, ...functionalTitles];
        } else if (category === 'Domain') {
            // Get all items from all Domain subcategories and sub-subcategories
            Object.keys(categoryData['Domain'] || {}).forEach(subcategory => {
                Object.keys(categoryData['Domain'][subcategory] || {}).forEach(subSubcategory => {
                    keywords = [...keywords, ...(categoryData['Domain'][subcategory][subSubcategory] || [])];
                });
            });
        } else {
            keywords = categoryData[category] || [];
        }
        
        if (keywords.length > 0) {
            currentSearch.push({
                category: category,
                keywords: keywords
            });
            select.value = '';
            renderSearchBuilder();
            updateSearchString();
        }
    }
}

function clearSearch() {
    currentSearch = [];
    renderSearchBuilder();
    updateSearchString();
}

function copySearch() {
    const searchString = document.getElementById('searchString');
    searchString.select();
    document.execCommand('copy');
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
    renderSearchBuilder();
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
        trainingContent: trainingContent
    };
    localStorage.setItem('pluginData', JSON.stringify(data));
}

function loadData() {
    // Clear old cached data to remove Technology category
    localStorage.removeItem('pluginData');
    
    const savedData = localStorage.getItem('pluginData');
    if (savedData) {
        const data = JSON.parse(savedData);
        categories = data.categories || {
            primary: ['Titles', 'Domain', 'Industry'],
            secondary: ['Context', 'Certifications & Clearances']
        };
        categoryData = data.categoryData || {
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
            'Context': [],
            'Certifications & Clearances': []
        };
        trainingContent = data.trainingContent || [];
    }
} 
