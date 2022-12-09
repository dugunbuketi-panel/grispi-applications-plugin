const DUGUNBUKETI_APPLICATIONS_READY = 'dugunbuketi.applications.ready';

{
  const client = GrispiClient.instance();

  function initCallback(pluginSettings) {

    console.debug(`init callback`, pluginSettings);

    const phoneNumber = pluginSettings.context.requester?.phone;

    if (phoneNumber) {
      const dugunBuketiToken = pluginSettings.settings.token;
      getUsersApplications(phoneNumber, dugunBuketiToken);
    } else {
      window.dispatchEvent(new CustomEvent(DUGUNBUKETI_APPLICATIONS_READY, {detail: eventData(false, 'Kullanıcının telefonu yok', null)}));
    }
    
  }

  GrispiClient.prototype.activeTicketChanged = function activeTicketChangedCallback(newCurrentTicketKey) {
    // We don't care about the active ticket, we only care about the ticket on which this plugin is rendered.
    // So we safely ignore this callback.
  }


  client.init().then(initCallback);
  client.validateImplementation();

  function eventData(success, message, data) {
    return {success, message, data};
  }

  /**
   * phoneNumber: string => phone number in E164 format (i.e. +905051112233)
   */
  function getUsersApplications(phoneNumber, token) {
    const adaptedParam = phoneNumber.replace('+90', '');
    fetch(`https://hesabimapi.dugunbuketi.com/api/v1/applications?phone=${adaptedParam}`, {
      method: 'GET',
      headers: {
        'mode': 'cors',
        'Authorization': token ?? window.dugunBuketiAuth
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      window.dispatchEvent(new CustomEvent(DUGUNBUKETI_APPLICATIONS_READY, {detail: eventData(false, `API isteğinde hata oluştu: ${res.status} ${res.statusText}`, null)}));
      throw new Error(`Request failed with status '${res.status}':'${res.statusText}'`); 
    })
    .then(data => {
      console.log(data);
      window.dispatchEvent(new CustomEvent(DUGUNBUKETI_APPLICATIONS_READY, {detail: eventData(true, null, data)}));
    });
  }
}
