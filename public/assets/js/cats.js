// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  registerPartial("cat-block", "#cats-block-partial");
  displayPage();
  setupEventHandlers();
});

function registerPartial(name, partialId) {
  var source = $(partialId).text();
  Handlebars.registerPartial(name, source);
}

function displayPage() {
  // Send the GET request.
  $.get("/api/cats/").then(
    function(cats) {
      renderTemplate({cats: cats});
    }
  );
}

function renderTemplate(data) {
  var source = $("#page-template").text();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#app").html(html);
}

function setupEventHandlers() {
  $(document).on("click", ".change-sleep", function(event) {
    var id = $(this).data("id");
    var newSleep = $(this).data("newsleep");

    var newSleepState = {
      sleepy: newSleep
    };

    // Send the PUT request.
    $.ajax("/api/cats/" + id, {
      type: "PUT",
      data: newSleepState
    }).then(
      function() {
        console.log("changed sleep to", newSleep);
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });

  $(document).on("submit", ".create-form", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newCat = {
      name: $("#ca").val().trim(),
      // Get the sleepy value by finding an element with a "name" attribute equal to the string "sleepy" and is checked
      sleepy: $("[name=sleepy]:checked").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/cats", {
      type: "POST",
      data: newCat
    }).then(
      function() {
        console.log("created new cat");
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });

  $(document).on("click", ".delete-cat", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/cats/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted cat", id);
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });
};
