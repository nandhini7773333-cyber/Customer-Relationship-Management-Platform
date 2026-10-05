```javascript
let customers = JSON.parse(localStorage.getItem("customers")) || [];

const form = document.getElementById("customerForm");
const modal = document.getElementById("modal");

function saveData() {
    localStorage.setItem("customers", JSON.stringify(customers));
}

function openForm() {
    document.getElementById("formTitle").textContent = "Add Customer";
    document.getElementById("customerId").value = "";
    form.reset();
    modal.style.display = "flex";
}

function closeForm() {
    modal.style.display = "none";
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = document.getElementById("customerId").value;

    const customerData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        status: document.getElementById("status").value,
        value: Number(document.getElementById("value").value),
        followup: document.getElementById("followup").value
    };

    if (id) {

        const index = customers.findIndex(
            customer => customer.id == id
        );

        customers[index] = {
            id: Number(id),
            ...customerData
        };

    } else {

        customers.push({
            id: Date.now(),
            ...customerData
        });

    }

    saveData();
    displayCustomers();
    closeForm();
    form.reset();
});

function displayCustomers() {

    const table = document.getElementById("customerTable");

    const search =
        document.getElementById("search").value.toLowerCase();

    const filter =
        document.getElementById("statusFilter").value;

    table.innerHTML = "";

    const filteredCustomers = customers.filter(customer => {

        const matchesSearch =
            customer.name.toLowerCase().includes(search) ||
            customer.email.toLowerCase().includes(search) ||
            customer.phone.includes(search);

        const matchesStatus =
            filter === "All" ||
            customer.status === filter;

        return matchesSearch && matchesStatus;
    });

    if (filteredCustomers.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No customers found
                </td>
            </tr>
        `;

    }

    filteredCustomers.forEach(customer => {

        const row = document.createElement("tr");

        let statusClass =
            customer.status.toLowerCase();

        row.innerHTML = `
            <td>
                <strong>${escapeHTML(customer.name)}</strong>
            </td>

            <td>${escapeHTML(customer.email)}</td>

            <td>${escapeHTML(customer.phone)}</td>

            <td>
                <span class="status ${statusClass}">
                    ${escapeHTML(customer.status)}
                </span>
            </td>

            <td>₹${customer.value.toLocaleString()}</td>

            <td>${customer.followup}</td>

            <td>
                <button class="action-btn edit"
                    onclick="editCustomer(${customer.id})">
                    ✏️
                </button>

                <button class="action-btn delete"
                    onclick="deleteCustomer(${customer.id})">
                    🗑️
                </button>
            </td>
        `;

        table.appendChild(row);
    });

    updateDashboard();
}

function editCustomer(id) {

    const customer =
        customers.find(customer => customer.id === id);

    if (!customer) return;

    document.getElementById("formTitle").textContent =
        "Edit Customer";

    document.getElementById("customerId").value =
        customer.id;

    document.getElementById("name").value =
        customer.name;

    document.getElementById("email").value =
        customer.email;

    document.getElementById("phone").value =
        customer.phone;

    document.getElementById("status").value =
        customer.status;

    document.getElementById("value").value =
        customer.value;

    document.getElementById("followup").value =
        customer.followup;

    modal.style.display = "flex";
}

function deleteCustomer(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this customer?");

    if (!confirmDelete) return;

    customers =
        customers.filter(customer => customer.id !== id);

    saveData();
    displayCustomers();
}

function updateDashboard() {

    document.getElementById("totalCustomers").textContent =
        customers.length;

    document.getElementById("activeCustomers").textContent =
        customers.filter(c => c.status === "Active").length;

    document.getElementById("leadCustomers").textContent =
        customers.filter(c => c.status === "Lead").length;

    const total =
        customers.reduce((sum, customer) =>
            sum + customer.value, 0);

    document.getElementById("totalValue").textContent =
        "₹" + total.toLocaleString();
}

function escapeHTML(value) {

    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

/* Dark Mode */

document.getElementById("darkModeBtn")
    .addEventListener("click", function() {

        document.body.classList.toggle("dark");

        this.textContent =
            document.body.classList.contains("dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
    });

/* Close modal when clicking outside */

window.addEventListener("click", function(event) {

    if (event.target === modal) {
        closeForm();
    }

});

/* Load customers */

displayCustomers();
```
