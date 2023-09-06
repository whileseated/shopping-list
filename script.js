document.addEventListener('DOMContentLoaded', () => {
    const newItemInput = document.getElementById('newItemInput');
    const addItemButton = document.getElementById('addItemButton');
    const populateListButton = document.getElementById('populateListButton');
    const bulkAddTextArea = document.getElementById('bulkAddTextArea');
    const selectAllButton = document.getElementById('selectAllButton');
    const copyListButton = document.getElementById('copyListButton');
    const rightList = document.getElementById('rightList');
    const leftList = document.querySelector('.left-column');

    // Function to create a new list item
    function createListItem(text, checked = false) {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');
        listItem.draggable = true;
    
        listItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', text);
            e.target.classList.add('dragging');
        });
    
        listItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingEl = document.querySelector('.dragging');
            if (e.target !== draggingEl) {
                leftList.insertBefore(draggingEl, e.target.closest('.list-item') || null);
            }
        });
    
        listItem.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            updateRightList(); // Update the right list after a drag-and-drop operation
        });
    
        listItem.addEventListener('dragenter', (e) => {
            e.target.classList.add('drag-over');
        });
        
        listItem.addEventListener('dragleave', (e) => {
            e.target.classList.remove('drag-over');
        });
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.addEventListener('change', () => {
            updateRightList();
        });
    
        const span = document.createElement('span');
        span.contentEditable = true;
        span.textContent = text;
        span.addEventListener('input', () => {
            checkbox.checked = false;
        });
    
        listItem.appendChild(checkbox);
        listItem.appendChild(span);
    
        return listItem;
    }
    
    // Logic for adding single item
    function addItem() {
        const value = newItemInput.value.trim();
        if (value) {
            const isAllCaps = value === value.toUpperCase();
            leftList.appendChild(createListItem(value, isAllCaps));
            newItemInput.value = '';
            if (isAllCaps) {
                updateRightList();
            }
        }
    }

    addItemButton.addEventListener('click', addItem);

    // Function to update the right list
    function updateRightList() {
        rightList.innerHTML = '';
        const leftListItems = document.querySelectorAll('.left-column .list-item');
        leftListItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const textContent = item.querySelector('span').textContent;
            if (checkbox.checked) {
                const div = document.createElement('div');
                div.textContent = textContent;
                if (textContent === textContent.toUpperCase()) {
                    div.classList.add('all-caps');
                }
                rightList.appendChild(div);
            }
        });
    }
    
    
    // Logic for populating list with textarea content
    populateListButton.addEventListener('click', () => {
        const items = bulkAddTextArea.value.split('\n').filter(item => item.trim());
        items.forEach(item => {
            const isAllCaps = item === item.toUpperCase();
            leftList.appendChild(createListItem(item, isAllCaps));
        });
        bulkAddTextArea.value = '';
        updateRightList();
    });

    // Logic for selecting all items
    selectAllButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.left-column .list-item input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        updateRightList();
    });

    // Logic for copying right list to clipboard
    copyListButton.addEventListener('click', () => {
        let listText = '';
        rightList.childNodes.forEach(node => {
            if (node.nodeName === 'BR') {
                listText += '\n';
            } else {
                listText += node.textContent + '\n';
            }
        });
    
        navigator.clipboard.writeText(listText).then(() => {
            console.log('List copied to clipboard');
        }, () => {
            console.error('Failed to copy list to clipboard');
        });
    });
    
    // Logic for adding item with Enter key
    newItemInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    });

    // Additional feature to support drag and drop can be implemented here.
    // You might use a library or HTML5 drag and drop API to achieve this.
});
