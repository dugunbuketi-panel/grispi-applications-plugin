function tryCors() {
  fetch('https://hesabimapi.dugunbuketi.com/api/v1/applications?phone=0530', {
    method: 'GET',
    headers: {
      'mode': 'cors'
      'Authorization': window.dugunBuketiAuth
    }
  })
  .then(res => {
    console.log(res);
    return res.json();
  })
  .then(data => {
    console.log(data);
  });
}

{
  const client = GrispiClient.instance();
  let currentTicketKey = null;

  updateUI('initial render');

  function initCallback(pluginSettings) {

    updateUI(`init callback`, pluginSettings);

    // When the plugin is started, we need to call 'currentTicket()' for once in order to learn the current ticket.
    //Then we can track the current ticket via activeTicketChangedCallback function.
    client.currentTicket().then(newCurrentTicketKey => {
      console.log(`Current ticket is set as`, newCurrentTicketKey);
      currentTicketKey = newCurrentTicketKey;
      updateUI(`currentTicket response`, newCurrentTicketKey);
    });

    client.api.get(`tickets/${pluginSettings.context.ticketKey}`)
      .then(res => {
        return res.json()
      })
      .then(data => {
        updateUI('Ticket from rest', data.key)
      })
  }

  // Do something when current ticket is changed
  GrispiClient.prototype.activeTicketChanged = function activeTicketChangedCallback(newCurrentTicketKey) {
    console.log(`Previous ticket was`, currentTicketKey, `and current ticket is`, newCurrentTicketKey);
    updateUI('activeTicketChanged', `Previous ticket was`, currentTicketKey, `and current ticket is`, newCurrentTicketKey);
    currentTicketKey = newCurrentTicketKey;
  }

  function updateUI() {
    const id = Date.now().toString();
    content.innerHTML += `<section id="${id}"><code>${new Date().toLocaleTimeString()}</code></section>`;
    const container = document.getElementById(id);
    for (let arg of arguments) {
      if (typeof arg === 'string') {
        container.insertAdjacentHTML('beforeend', `<div class="message">${arg}</div>`);
      } else {
        const id2 = Date.now().toString();
        const buttonId = `${id2}Button`;
        container.insertAdjacentHTML('beforeend', `<button type="button" id="${buttonId}">Toggle</button>`);
        container.insertAdjacentHTML('beforeend', `<pre class="message" id="${id2}">${toJson(arg)}</pre>`);

        document.getElementById(buttonId).addEventListener('click', function () {
          alert(13)
        });
      }
    }
    content.innerHTML += `<hr>`;
  }

  function toJson(obj) {
    return JSON.stringify(obj, null, 2);
  }

  client.init().then(initCallback);
  client.validateImplementation();
}
