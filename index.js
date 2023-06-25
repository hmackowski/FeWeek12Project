//API URL
let url = "https://6354ce2cccce2f8c020dc132.mockapi.io/taskManager";

// Fetch user data and list users to the table
fetchUser().then((data) => {
  listUsers(data);
});



// Add Button event listener
document.getElementById("add-button").addEventListener("click", function () {
  // Get the user data from the form
  const user = {
    name: $("#name-text").val(),
    job: $("#job-text").val(),
    phoneNumber: $("#phone-text").val(),
  };

  // Clear the form fields
  clearInputFields();

  addNewUser(user).then(() => {
    // Refresh the user list after adding a new user
    fetchUser().then((data) => {
      listUsers(data);
    });
  });
});

// -------↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓--Save Button event listener----------↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
document.getElementById("save-button").addEventListener("click", function () {
  let userId = $("#save-button").attr("data-user-id"); // Get the user id from the data attribute
  let updatedUser = {
    name: $("#name-text").val(),
    job: $("#job-text").val(),
    phoneNumber: $("#phone-text").val(),
  };

  saveUpdatedUser(userId, updatedUser)
    .then(() => {
      // Clear the form fields
      clearInputFields();

      $("#save-button").attr("class", "btn btn-primary disabled");
      console.log("User updated successfully");
      fetchUser().then((data) => {
        // Refresh the user list after update
        listUsers(data);
        $("#save-button").attr("data-user-id", "null");
        $("#add-button").attr("class", "btn btn-success");
        $("#cancel-button").remove();
        // Show success alert
        successAlert("User Updated Successfully!");
      });
    })
    .catch((error) => {
      console.error("Failed to update user:", error);
    });
});
// ---------↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑------End Save Button event listener--------------↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// Read CRUD operation
function fetchUser() {
  // Retrieve user data from the server
  return $.ajax({
    url: "https://6354ce2cccce2f8c020dc132.mockapi.io/taskManager",
    type: "GET",
  });
}

// Read CRUD operation (fetch user by ID)
function fetchUserById(id) {
  // Retrieve user data from the server based on the provided ID
  return $.get(`${url}/${id}`);
}

// Delete CRUD operation
// Event listener for delete button
function deleteUser(userId) {
  console.log(userId);
  // Remove the user row from the table
  $(`#userRow${userId}`).remove();
  $.ajax({
    url: `${url}/${userId}`,
    type: "DELETE",
    success: function () {
      console.log("User deleted successfully.");
      successAlert("User deleted successfully!")
      // Refresh the user list after deletion
      fetchUser().then((data) => {
        listUsers(data);
      });
    },
    error: function (error) {
      console.error("Failed to delete user:", error);
    },
  });
}

// Create CRUD operation
function addNewUser(user) {
  $("#name-text").val(user.name);
  $("#job-text").val(user.job);
  $("#phone-text").val(user.phoneNumber);

  // Check if all fields are complete
  if (
    $("#name-text").val() === "" ||
    $("#job-text").val() === "" ||
    $("#phone-text").val() === ""
  ) {
    // Show an alert message indicating that all fields must be complete
    emptyFieldsAlert();
  } else {
    clearInputFields();
    successAlert(`${user.name} added successfully!`);
    // Send a POST request to create a new user on the server
    return $.ajax({
      url: url,
      type: "POST",
      data: user,
    });
  }
}

//creates a button to cancel from updating a user
function createCancelButton() {
  let cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.value = "Cancel";
  cancelButton.className = "btn btn-secondary";
  cancelButton.id = "cancel-button";
  cancelButton.textContent = "Cancel";
  document.getElementById("button-row").append(cancelButton);
}

//Disables all Delete and Update buttons
function disableButtons() {
  $(".btn-secondary").attr("disabled", true);
  $(".btn-danger").attr("disabled", true);
}

//Enables all Delete and Update buttons
function enableButtonsDeleteAndUpdate() {
  $(".btn-secondary").attr("disabled", false);
  $(".btn-danger").attr("disabled", false);
}

// Update CRUD operation
function updateUser(userId) {
  // Disable all update buttons and delete buttons
  disableButtons();

  fetchUserById(userId).then((user) => {
    // Update the form fields with the user's data
    $("#name-text").val(user.name);
    $("#job-text").val(user.job);
    $("#phone-text").val(user.phoneNumber);
    $("#save-button").attr("class", "btn btn-primary");
    $("#add-button").attr("class", "btn btn-success disabled");
    $("#save-button").attr("data-user-id", userId);

    // Create the cancel button
    createCancelButton();

    // Cancel Button event listener
    document
      .getElementById("cancel-button")
      .addEventListener("click", function () {
        // Clear the form fields
        clearInputFields();

        $("#cancel-button").remove();
        $("#add-button").attr("class", "btn btn-success");
        $("#save-button").attr("class", "btn btn-primary disabled");

        // Enable all update buttons and delete buttons
        enableButtonsDeleteAndUpdate();
      });
  });
}

// Save Updated User CRUD operation
function saveUpdatedUser(id, user) {
  // Send a PUT request to update the user on the server
  return $.ajax({
    url: `${url}/${id}`,
    type: "PUT",
    data: user,
  });
}

// Function to list users on to a Table
function listUsers(data) {
  $("#userTable tbody").empty();
  for (let user of data) {
    const row = `
        <tr class="userRow" id="${user.id}">
          <th scope="row">${user.id}</th>
          <td>${user.name}</td>
          <td>${user.job}</td>
          <td>${user.phoneNumber}</td>
          <td>
            <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            <button class="btn btn-secondary" id="update-button" onclick="updateUser(${user.id})">Update</button>
          </td>
        </tr>
      `;
    $("#userTable tbody").append(row);
  }
}

// Clear the form fields
function clearInputFields() {
  $("#name-text").val("");
  $("#job-text").val("");
  $("#phone-text").val("");
}

// Display an alert for empty fields
function emptyFieldsAlert() {
  let alertElement = `
  <div class="alert alert-danger alert-dismissible fade show col-6" id="danger-alert" role="alert">
    All fields must be complete!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;

  // Append the alert element to the alert container
  document.getElementById("alert-container").innerHTML = alertElement;

  // Fade out the alert after 2 seconds
  setTimeout(function () {
    let dangerAlert = document.getElementById("danger-alert");

    // Apply CSS transition for fade out effect
    dangerAlert.style.transition = "opacity 1s";
    dangerAlert.style.opacity = "0";

    // Remove the alert from the DOM after fade out
    setTimeout(function () {
      dangerAlert.remove();
    }, 1000);
  }, 2000);
}

// Display a success alert with custom text
function successAlert(alertText) {
  const alertElement = `
  <div class="alert alert-success alert-dismissible fade show col-6 text-center" role="alert" id="success-alert">
  ${alertText}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
`;

  // Append the alert element to the alert container
  document.getElementById("alert-container").innerHTML = alertElement;

  // Fade out the alert after 2 seconds
  setTimeout(function () {
    let successAlert = document.getElementById("success-alert");

    // Apply CSS transition for fade out effect
    successAlert.style.transition = "opacity 1s";
    successAlert.style.opacity = "0";

    // Remove the alert from the DOM after fade out
    setTimeout(function () {
      successAlert.remove();
    }, 1000);
  }, 2000);
}
