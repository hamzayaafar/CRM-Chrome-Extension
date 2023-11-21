/**
* Creates an eventlistener for the submit button, which calls on "recordData".
* Each customer in local storage is added to the html list using addCustomerToList.
*/
function main () {
  const submitButton = document.getElementById('submit')
  submitButton.addEventListener('click', recordData)

  chrome.storage.local.get(['customers'], function (result) {
    const customers = result.customers || []
    customers.forEach((customer, index) => {
      addCustomerToList(customer.name, customer.email, index)
    })
  })
}
/**
 * Records data from the input fields.
 * If data is correct, then newCustomer function is called to store it.
 * Otherwise, an alert is shown which instructs user to fill in both fields.
 */
function recordData () {
  const name = document.getElementById('name').value
  const email = document.getElementById('email').value

  if (name && email) {
    chrome.storage.local.get(['customers'], function (result) {
      newCustomer(result, name, email)
    })
  } else {
    alert('Fill in both fields')
  }
}
/**
 * Adds customer to local storage and calls the addCustomerToList function
 * @param {Object} result - the customers already in local storage.
 * @param {string} name - New customer name.
 * @param {string} email - New customer email.
 */
function newCustomer (result, name, email) {
  const customers = result.customers || []
  customers.push({ name, email })
  chrome.storage.local.set({ customers }, function () {
    alert('Customer Saved!')
  })
  addCustomerToList(name, email, customers.length - 1)
}

/**
 * Adds customer data to HTML customerList as well as delete and edit buttons.
 * @param {string} name - New customer name.
 * @param {string} email - New customer email.
 * @param {number} index - index of customer in local storage.
 */
function addCustomerToList (name, email, index) {
  const customerList = document.getElementById('customerList')
  const entry = document.createElement('li')
  entry.setAttribute('id', 'customer-' + index)
  entry.textContent = `${name} (${email})`

  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Delete'
  deleteButton.onclick = function () { deleteCustomer(index) }

  const editButton = document.createElement('button')
  editButton.textContent = 'Edit'
  editButton.onclick = function () { editCustomer(index) }

  entry.appendChild(deleteButton)
  entry.appendChild(editButton)
  customerList.appendChild(entry)
}
/**
 * Removes customer data from HTML customerList and local storage.
 * @param {number} index - index of customer in local storage
 */
function deleteCustomer (index) {
  chrome.storage.local.get(['customers'], function (result) {
    const customers = result.customers || []

    customers.splice(index, 1)

    chrome.storage.local.set({ customers }, function () {
      alert('Customer Deleted!')
      updateCustomerListUI(customers)
    })
  })
}

/**
 * Edits customer name and email values given the index
 * calls updateCustomerListUI function to make the changes
 * @param {int} index - index of customer in local storage
 */
function editCustomer (index) {
  const newName = prompt('Enter new name:')
  const newEmail = prompt('Enter new email:')

  if (newName && newEmail) {
    chrome.storage.local.get(['customers'], function (result) {
      const customers = result.customers || []
      customers[index] = { name: newName, email: newEmail }
      chrome.storage.local.set({ customers }, function () {
        alert('Customer Edited!')
        updateCustomerListUI(customers)
      })
    })
  } else {
    alert('Both name and email must be provided for editing.')
  }
}
/**
 * Updates UI in order to reflect new order after deleting data.
 * Clears and restructures existing array.
 * @param {Object[]} customers - list of customers in local storage
 */
function updateCustomerListUI (customers) {
  const customerList = document.getElementById('customerList')
  customerList.innerHTML = ''
  customers.forEach((customer, index) => {
    addCustomerToList(customer.name, customer.email, index)
  })
}

function alert (message) {
  document.getElementById('sample').innerHTML = `${message}`
}

try {
  main()
} catch (e) {
  console.log(e)
}

