const reset = document.querySelector('#reset')
reset.addEventListener('click', () => {
  document.querySelectorAll('.form-control')
    .forEach(function (input, i) {
      input.value = ''
    })
})