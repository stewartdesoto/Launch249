$(function() {

  localStorage.clear();
  loadList();

  $("#get_todo").on("submit", function(e) {
    e.preventDefault();
    var $input = $(this).find("input"); 
    var todo = $input.val();
    var delete_tag = "<a href='#' class='delete'></a>"
    var date_tag = "<date></date>"
    var $li = "<li>" + todo + delete_tag + "</li>";
    $("#todo_list ul").append($li)
    $input.val("");

  });

  $("#todo_list").on("mouseover", "li", function() {
    $("#todo_list a").hide();
    $(this).find("a").show();
  });

  $("#todo_list").on("click", "a", function(e) {
    e.preventDefault();
    alert("deleting todo!");
    $(this).parents("li").remove();
  });

  $(window).on ("unload", function() {
    console.log("unloading");
    var list = $("#todo_list").html();
    console.dir(list);
    saveList(list);
  });

  function saveList(list) {
    //var stringified_list = JSON.stringify(list);
    //console.log(stringified_list);
    localStorage.setItem("listkey", list);
  }

  function loadList() {
    var list = localStorage.getItem("listkey");

    if ( !!list ) {
      //list = JSON.parse( stringified_list );
      $("#todo_list").html(list);
    } 

  }

});