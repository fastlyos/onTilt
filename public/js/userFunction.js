$(document).ready(function() {

  /* global moment */

  // blogBox holds all of our posts
  var blogBox = $("#blogBox");
  var postCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/posts/" + id
    })
    .then(function() {
      alert('post deleted!');
      $(`[data-post=${id}]`).remove();
    });
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handlePostDelete() {
    var id = $(this)
      .closest('[data-post]')
      .attr("data-post");
    deletePost(id);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  function handlePostEdit() {
    var id = $(this)
      .closest('[data-post]')
      .attr("data-post");
    window.location.href = "/bid?post_id=" + id;
  }

  // This function displays a messgae when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for User #" + id;
    }
    blogBOx.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No posts yet" + partial + ", navigate <a href='/bid" + query +
    "'>here</a> in order to get started.");
    blogBox.append(messageh2);
  }

});


