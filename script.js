import { Api } from './api.js'

/* ~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~ */
const View = (() => {
  const domstr = {
    contactContainer: '#summaryTable',
    inputebox: [document.getElementById("name"), document.getElementById("mobile"), document.getElementById("email")],
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  const createTmp = (arr) => {
    let tmp = '';
    arr.forEach((contact) => {
      tmp += `
      <tr>
      <td>${contact.Name}</td>
      <td>${contact.Mobile}</td>
      <td>${contact.Email}t</td>
    </tr>
      `;
    });
    return tmp;
  };

  return {
    domstr,
    render,
    createTmp,
  };
})();

/* ~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~ */
const Model = ((api, view) => {
  class Contact {
    constructor(name, mobile, email) {
      this.name = name;
      this.mobile = mobile;
      this.email = email;
    }
  }
  class State {
    #contacts = [];

    get contact() {
      return this.#contacts;
    }
    set contact(newContactlist) {
      this.#contacts = [...newContactlist];

      const contactContainer = document.querySelector(view.domstr.contactContainer);
      const tmp = view.createTmp(this.#contacts);
      view.render(contactContainer, tmp);
    }
  }

  const { getContacts, addContact } = api;

  return {
    getContacts,
    addContact,
    Contact,
    State,
  };
})(Api, View);

/* ~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~ */
const Controller = ((model, view) => {
  const state = new model.State();

    const addContact = () => {
    const inputbox = document.querySelector(view.domstr.inputebox);
    inputbox.addEventListener('submit', (event) => {
      if (event.key === 'Click' && event.target.value.trim()) {
        const newContact = new model.Contact(document.getElementById("name").value, document.getElementById("mobile").value, document.getElementById("email").value);
        model.addContact(newContact).then(contact => {
          state.contacts = [contact, ...state.contacts];
        });
        document.getElementById("name").value = '';
        document.getElementById("mobile").value = '';
        document.getElementById("email").value = '';
      }
    });
  };

  const init = () => {
    model.getContacts().then((contact) => {
      state.todolist = [...contact.reverse()];
    });
  };

  const bootstrap = () => {
    init();
    addContact();
  };

  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
