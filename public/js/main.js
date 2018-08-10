$(document).ready(function(){
  $('.updateUser').on('click', updateUser)
  $('.deleteUser').on('click', deleteUser)

})

function deleteUser(){
  let confirmation = confirm("Hope you wanna Delete")

  if (confirmation){
    $.ajax({
      type: 'DELETE',
      url: '/'+ $(this).data("id")
    })
    window.location.replace('/')
  }else{
    return false;
  }
}

function updateUser(){
  let confirmation = confirm("Are you sure you want to update? ")
  if (confirmation){
    $.ajax({
      type: 'PUT',
      url: '/users/update/'+$(this).data("id")
    })
    //window.location.replace('/users/update/');
  }else{
    return false;
  }
}
