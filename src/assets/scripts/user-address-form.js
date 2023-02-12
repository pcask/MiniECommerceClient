(() => {

  // -- Form validation --
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  // -- Form validation End --


  // -- Phone number mask --

  var input = document.getElementById("inputPhoneNumber");

  var lastValue = input.value;

  window.addEventListener('keyup', e => {
    if (e.key == 'Tab' && $('#inputPhoneNumber:focus').length) {
      input.setSelectionRange(3, 3);
    }
  });

  input.addEventListener('keyup', e => {
    if (!formatCheck())
      input.value = lastValue;
  });

  input.addEventListener('keydown', e => {

    if (e.keyCode >= 112 && e.keyCode <= 123) {
      e.preventDefault();
      return;
    }

    lastValue = input.value;
    let vArray = input.value.split('');
    let cri = e.target.selectionEnd;

    if (e.key == 'Backspace' || e.key == 'Delete') {

      e.preventDefault();

      let beDeleted, newIndex;

      if (e.key == 'Backspace') {
        if (cri < 4) return;
        beDeleted = vArray[cri - 1];
        newIndex = cri - 1;
      }
      else {
        if (cri > 15 || cri < 3) return;
        beDeleted = vArray[cri];
        newIndex = cri;
      }

      if (beDeleted !== '(' && beDeleted !== ')' && beDeleted !== ' ' && beDeleted !== '_') {
        vArray.splice(newIndex, 1, '_');
        input.value = vArray.join('');
      }
      if (e.key == 'Backspace')
        e.target.setSelectionRange(newIndex, newIndex);
      else
        e.target.setSelectionRange(newIndex + 1, newIndex + 1);

    }
    else if (/\d/.test(e.key)) {

      if (e.target.selectionEnd < 3) {
        e.target.setSelectionRange(3, 3);
        cri = e.target.selectionEnd;
      }

      if (vArray[cri] == undefined)
        return;

      const aIndex = vArray.indexOf('_'); // Available index

      if (aIndex > -1 && aIndex < cri) {
        vArray.splice(aIndex, 1, e.key);
        input.value = vArray.join('');
        e.target.setSelectionRange(cri + 1, cri + 1);
      } else if (vArray[cri] !== '(' && vArray[cri] !== ')' && vArray[cri] !== ' ') {

        vArray.splice(cri, 1, e.key);
        input.value = vArray.join('');
        e.target.setSelectionRange(cri + 1, cri + 1);
      }
      else if (vArray[cri] == ' ') {
        vArray.splice(cri + 1, 1, e.key);
        input.value = vArray.join('');
        e.target.setSelectionRange(cri + 2, cri + 2);
      }
      else if (vArray[cri] == ')') {
        vArray.splice(cri + 2, 1, e.key);
        input.value = vArray.join('');
        e.target.setSelectionRange(cri + 3, cri + 3);
      }
      else if (vArray[cri] == '(' && e.key == '5') {
        e.target.setSelectionRange(cri + 2, cri + 2);
      }

    }

  });

  input.addEventListener('drop', e => {
    if (!formatCheck())
      input.value = lastValue;
  })

  input.addEventListener('paste', e => {

    var pastedData = e.clipboardData.getData('text/plain');

    if (pastedData == undefined)
      return;

    if (pastedData.length > 11)
      pastedData = pastedData.substring(0, 11);

    let pAry = pastedData.split('');
    let vAry = input.value.split('');

    var numberCheck = true;

    pAry.forEach(item => {
      if (!parseInt(item) && item !== '0') {
        numberCheck = false;
      }
    })

    if (!numberCheck) {
      e.preventDefault();
      return;
    }

    var selectionStart = e.target.selectionStart;

    if (selectionStart == 0 && pAry[0] == '0' && pAry[1] == '5') {
      e.target.setSelectionRange(3, 3);
      pAry.splice(0, 1);
      pAry.splice(0, 1);
    }
    else if ((selectionStart == 1 || selectionStart == 2) && pAry[0] == '5') {
      e.target.setSelectionRange(3, 3);
      pAry.splice(0, 1);
    }
    else if (selectionStart == 0 && pAry[0] !== '0') {
      e.preventDefault();
      return;
    }
    else if ((selectionStart == 1 || selectionStart == 2) && pAry[0] !== '5') {
      e.preventDefault();
      return;
    }

    selectionStart = e.target.selectionStart;

    const usIdx = vAry.indexOf('_');

    let availableIdx;

    if (usIdx !== -1 && usIdx < selectionStart)
      availableIdx = usIdx;
    else
      availableIdx = selectionStart;


    for (let k = 0; k < pAry.length; k++) {

      if (vAry[availableIdx] == ')')
        availableIdx += 2;
      else if (vAry[availableIdx] == ' ')
        availableIdx++;
      else if (vAry[availableIdx] == undefined)
        break;

      vAry.splice(availableIdx, 1, pAry[k]);

      availableIdx++;

    }

    input.value = vAry.join('');

  });

  function formatCheck() {
    var ary = input.value.split('');

    if (ary[0] == 0 && ary[1] == '(' && ary[2] == 5 && ary[5] == ')' && ary[6] == ' ' && ary[10] == ' ' && ary[13] == ' ' && ary.length == 16)
      return true;
    else
      return false;
  }

  // -- Phone number mask End --

})()

