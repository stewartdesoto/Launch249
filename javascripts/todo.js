$(function() {

  var nextId;
  var $noDueDateTodos = $("<ul/>");
  var $dateTodos = $("<ul/>");
  var $monthTodos = $("<ul/>");
  var $completedTodos  = $("<ul/>");

  loadList();

$("#all_todos").on("click", function(e) {
    e.preventDefault();
    renderList();
    e.stopPropagation();
  });

  $("#no_due_date").on("click", function(e) {
    e.preventDefault();
    $("#todo_list div.no_due_dates").html($noDueDateTodos);
    $("#todo_list div.with_dates").html("");
    $("#todo_list div.month").html("");
    $("#todo_list div.completed").html("");
    e.stopPropagation();
  });

  $("#by_month").on("click", "a", function(e) {
    e.preventDefault();
    var yr = $(this).data("year");
    var mth = $(this).data("month");
    var $todos = $dateTodos.clone().children("li");
    var $month_todos = $todos.filter( function(idx, itm) {
      var year = $(itm).find("date").text().slice(0,4);
      var month = $(itm).find("date").text().slice(5,7);
      if (+year == yr && +month == mth ) {
        return true;
      } else {
        return false;
      } 
    });

    $("#todo_list div.no_due_dates").html("");
    $("#todo_list div.with_dates").html("");
    $("#todo_list div.month").html($month_todos);
    $("#todo_list div.completed").html("");

    e.stopPropagation();
  });

  $("#completed").on("click", function(e) {
    e.preventDefault();
    $("#todo_list div.no_due_dates").html("");
    $("#todo_list div.with_dates").html("");
    $("#todo_list div.month").html("");
    $("#todo_list div.completed").html($completedTodos);
    e.stopPropagation();
  });

  $("#get_todo").on("submit", function(e) {
    e.preventDefault();
    var $input = $(this).find("input"); 
    var todo = "<h3>" + $input.val() + "</h3>";
    var delete_tag = "<a href='#' class='delete'></a>"
    var date_tag = "<date></date>"
    var data_id = "data-id=" + nextId;
    var completed = " data-completed='false'";
    var $li = "<li " + data_id + completed + "> " + todo + delete_tag + date_tag + "</li>";
    nextId++;
    $noDueDateTodos.append($li);
    renderList();
    $input.val("");

  });

  $("#get_todo [type='cancel']").on("click", function(e) {
    e.preventDefault();
    localStorage.clear();
    $noDueDateTodos = $("<ul/>");
    $dateTodos = $("<ul/>");
    $completedTodos  = $("<ul/>");
    $monthTodos  = $("<ul/>");

    renderList();
  });


  $("#todo_list").on("mouseover", "li", function() {
    $("#todo_list a").hide();
    $(this).find("a").show();
  });

  $("#todo_list").on("click", "li", function() {
    $("#modal_blocking_layer").show();
    $("#modal").find("h3").text($(this).find("h3").text());
    $("#modal").find("[type='hidden']").val($(this).data("id"));
    $("#modal").show();
  });

  $("#todo_detail [type='save']").on("click", function() {
    var id = $("[type='hidden']").val();
    var date = $("[type='date']").val();
    $lis = $("#todo_list li");
    $li = $lis.filter( function(index) {
      return (+$(this).data("id") === +id);
    });
    $li.find("date").text(date);
    $li.addClass("hasdate");
    $dateTodos.append($li);
    $("#modal, #modal_blocking_layer").hide();
    sortList();
    renderList();
  });

  $("#todo_detail [type='cancel']").on("click", function() {
    $("#modal, #modal_blocking_layer").hide();
  });

  $("#todo_detail [type='completed']").on("click", function() {
    var id = $("[type='hidden']").val();
    $lis = $("#todo_list li");
    $li = $lis.filter( function(index) {
      return (+$(this).data("id") === +id);
    });
    //$li.data("completed", "true"); doesn't change DOM
    $li.attr("data-completed", true);
    $completedTodos.append($li);
    renderList();
    $("#modal, #modal_blocking_layer").hide();
  });

  $("#todo_list").on("click", "a", function(e) {
    e.preventDefault();
    $(this).parents("li").remove();
    renderList();
    e.stopPropagation();
  });

  $("#menu_icon").on("click", "a", function() {
    $("#lists, #work_area").toggleClass("expanded single");
  });

  $(window).on ("unload", function() {
    saveList();
  });

  function saveList() {
    localStorage.setItem("noDueDateTodos", $noDueDateTodos.html() );
    localStorage.setItem("dateTodos", $dateTodos.html() );
    localStorage.setItem("completedTodos", $completedTodos.html() );
    localStorage.setItem("id", nextId);
  }

  function loadList() {
    $noDueDateTodos.html(localStorage.getItem("noDueDateTodos"));
    $dateTodos.html(localStorage.getItem("dateTodos"));
    $completedTodos.html(localStorage.getItem("completedTodos"));

    nextId = +localStorage.getItem("id");
    renderList();

  }

  function sortList() {

    var listItems = $dateTodos.children("li");
    listItems.sort( function(li1, li2) {
      date1 = $(li1).find("date").text();
      date2 = $(li2).find("date").text();

      if ( date1 > date2 ) {
        return 1;
      } else if ( date1 < date2 ) {
        return -1;
      } else {
        return 0;
      }
    });
    $.each(listItems, function(idx, itm) {
      $dateTodos.append(itm);
    });
  }

  function renderList() {

    $("#todo_list div.no_due_dates").html($noDueDateTodos);
    $("#todo_list div.with_dates").html($dateTodos);
    $("#todo_list div.completed").html($completedTodos);
    var todo_count = $noDueDateTodos.children("li").length +
                     $dateTodos.children("li").length +
                     $completedTodos.children("li").length;
    $("#list_task_count").text(todo_count);
  }

});