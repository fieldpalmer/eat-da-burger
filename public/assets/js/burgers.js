// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(() => {
  registerPartial("burger-block", "#burgers-block-partial");
  displayPage();
  setupEventHandlers();
});

const registerPartial = (name, partialId) => {
  const source = $(partialId).text();
  Handlebars.registerPartial(name, source);
}

displayPage = () => {
  // Send the GET request.
  $.get("/api/burgers/").then(
    function(burgers) {
      renderTemplate({burgers: burgers});
    }
  );
}

const renderTemplate = (data) => {
  const source = $("#page-template").text();
  const template = Handlebars.compile(source);
  const html = template(data);
  $("#app").html(html);
}

function setupEventHandlers() {
  $(document).on("click", ".change-state", function(event) {
    var id = $(this).data("id");
    var newState = $(this).data("newstate");

    var eatMake = {
      devoured: newState
    };

    // Send the PUT request.
    $.ajax("/api/burgers/" + id, {
      type: "PUT",
      data: eatMake
    }).then(
      function() {
        console.log("changed state to", newState);
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });

  $(document).on("submit", ".create-form", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      name: $("#burgName").val().trim(),
      description: $("#burgDesc").val().trim(),
    };

    // Send the POST request.
    $.ajax("/api/burgers", {
      type: "POST",
      data: newBurger
    }).then(
      function() {
        console.log("created new burger");
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });

  $(document).on("click", ".delete-burger", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted burger", id);
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });
};
