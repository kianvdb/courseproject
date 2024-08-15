document.addEventListener("DOMContentLoaded", function() {
    const categoryInput = document.getElementById('categoryInput');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoriesList = document.getElementById('categories');

    async function fetchCategories() {
        try {
            const response = await fetch('https://courseproject-ylzb.onrender.com/api/category/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categories = await response.json();
            categoriesList.innerHTML = categories.map(cat =>
                `<li data-id="${cat._id}">
                    <span class="categoryName">${cat.categoryName}</span>
                    <input type="text" class="editCategoryInput" value="${cat.categoryName}" style="display: none;">
                    <div>
                    <button class="saveBtn" onclick="saveCategory('${cat._id}')" style="display: none;">Bewaren</button>
                    <button class="editBtn" onclick="startEditing('${cat._id}')">Bewerken</button>
                    <button class="deleteBtn" onclick="deleteCategory('${cat._id}')">Verwijderen</button>
                    <div>
                </li>`
            ).join('');
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    async function addCategory() {
        const categoryName = categoryInput.value.trim();
        if (!categoryName) return;

        try {
            const response = await fetch('https://courseproject-ylzb.onrender.com/api/category/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryName })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            categoryInput.value = '';
            fetchCategories(); 
        } catch (error) {
            console.error('Error adding category:', error);
        }
    }

    window.startEditing = function(id) {
        const categoryListItem = document.querySelector(`li[data-id="${id}"]`);
        categoryListItem.querySelector('.editCategoryInput').style.display = 'inline-block';
        categoryListItem.querySelector('.categoryName').style.display = 'none';
        categoryListItem.querySelector('.editBtn').style.display = 'none';
        categoryListItem.querySelector('.saveBtn').style.display = 'inline-block';
        categoryListItem.querySelector('.editCategoryInput').focus(); 
    };

    // category update
    window.saveCategory = async function(id) {
        const categoryListItem = document.querySelector(`li[data-id="${id}"]`);
        const newCategoryName = categoryListItem.querySelector('.editCategoryInput').value.trim();

        if (!newCategoryName) return;

        try {
            const response = await fetch(`https://courseproject-ylzb.onrender.com/api/category/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryName: newCategoryName })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }

        categoryListItem.querySelector('.editCategoryInput').style.display = 'none';
        categoryListItem.querySelector('.categoryName').style.display = 'inline-block';
        categoryListItem.querySelector('.editBtn').style.display = 'inline-block';
        categoryListItem.querySelector('.saveBtn').style.display = 'none'; 
    };

    window.deleteCategory = async function(id) {
        if (!confirm('Ben je zeker dat je deze categorie wil verwijderen?')) return;

        try {
            const response = await fetch(`https://courseproject-ylzb.onrender.com/api/category/categories/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchCategories(); 
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    addCategoryBtn.addEventListener('click', addCategory);

    fetchCategories();
});
