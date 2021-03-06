$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our posts
  var blogContainer = $(".blog-container");
  var postCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  // $(document).on("click", "button.edit", handlePostEdit);
  // Variable to hold our posts
  var posts;

  // The code below handles the case where we want to get blog posts for a specific author
  // Looks for a query param in the url for author_id
  var url = window.location.search;
  var userId;
  if (url.indexOf("?user_id=") !== -1) {
    auserId = url.split("=")[1];
    getPosts(userId);
  }
  // If there's no authorId we just get all posts as usual
  else {
    getPosts();
  }

  // This function grabs posts from the database and updates the view
  function getPosts(user) {
    userId = user || "";
    if (userId) {
      userId = "/?user_id=" + userId;
    }
    $.get("/api/bets" + userId, function(data) {
      console.log("Bets", data);
      bets = data;
      if (!bets || !bets.length) {
        displayEmpty(user);
      } else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/bets/" + id
    }).then(function() {
      getPosts(postCategorySelect.val());
    });
  }

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < bets.length; i++) {
      postsToAdd.push(createNewRow(bets[i]));
    }
    blogContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(bet) {
    var formattedDate = new Date(bet.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");

    var newPostCard = $("<div>");
    newPostCard.addClass(
      "card mx-5 my-5 border-0 rounded-lg text-center bg-dark"
    );
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("DELETE");
    deleteBtn.addClass("delete btn btn-danger mx-5 my-2 text-center");
    // var editBtn = $("<button>");
    // editBtn.text("EDIT");
    // editBtn.addClass("edit btn btn-light mx-5 my-2");
    var newPostTitle = $("<h2>");
    newPostTitle.addClass("newPostTitle");
    var newPostDate = $("<small>");
    var newPostAuthor = $("<h5>");
    newPostAuthor.addClass("userTagName");
    var my_obj_str = JSON.stringify(bet.User.name);

    newPostAuthor.text("BETTOR: " + my_obj_str);
    // newPostAuthor.css({
    //   float: "right",
    //   color: "blue",
    //   "margin-top": "-10px"
    // });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p id='betTag'>");
    newPostTitle.text(bet.teamName + " ");
    newPostBody.text("BET AMOUNT: $" + bet.wager);
    newPostDate.text("was placed on " + formattedDate);
    newPostTitle.append(newPostDate);
    newPostCardHeading.append(deleteBtn);
    // newPostCardHeading.append(editBtn);
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(newPostAuthor);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("bet", bet);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("bet");
    deletePost(currentPost.id);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  // function handlePostEdit() {
  //   var currentPost = $(this)
  //     .parent()
  //     .parent()
  //     .data("post");
  //   window.location.href = "/cms?bets_id=" + currentPost.id;
  // }

  // This function displays a message when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for User #" + id;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html(
      "No bets yet" +
        partial +
        ", navigate <a href='/cms" +
        query +
        "'>here</a> in order to get started."
    );
    blogContainer.append(messageH2);
  }
});
