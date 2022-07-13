/*-------------View-------------*/
const View = (() => {
  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  const createTmp = (arr) => {
    let tmp = "";
    arr.forEach((contact) => {
      tmp += `
          <tr>
              <td>${contact.name}</td>
              <td>${contact.mobile}</td>
              <td>${contact.email}</td>
          </tr>
           `;
    });

    return tmp;
  };

  return {
    render,
    createTmp,
  };
})();

/*-------------Model-------------*/
const Model = ((view) => {
  class Contact {
    constructor(name, mobile, email) {
      this.name = name;
      this.mobile = mobile;
      this.email = email;
    }
  }

  class State {

    contacts = [];

    getContacts() {
      return this.contacts;
    }

    setContacts(newContactList) {
      this.contacts = [...newContactList];
      const contactContainer = document.querySelector("tbody");
      const tmp = view.createTmp(this.contacts);
      view.render(contactContainer, tmp);
    }
  }

  const inputValid = (name, mobile, email) => {
    if (name && name.length <= 20) {
      if (/\d/.test(name)) { // checks for numbers in name
        return false;
      }
    } else {
      return false;
    }

    if (!mobile || !(mobile.toString().length === 10)) {
      return false;
    }

    if (!email || !(email.includes("@") || email.length < 40)) {
      return false;
    }

    return true;
  };

  const sortContacts = (arr, Ascending) => {
    console.log(arr)
    if (Ascending) { // Ascending
      arr.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } else { // Descending
      console.log("sorting desc")
      arr.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }
    return arr;
  };

  return {
    Contact,
    State,
    sortContacts,
    inputValid,
  };
})(View);

/*-------------Controllor-------------*/
const Controllor = ((model, view) => {
  const state = new model.State();
  let filteredContacts = [];
  let clicked = false;

  const init = () => {
    addContact();
    mobileSearch();
    sortContactsByName();
  };

  const addContact = () => {
    const name = document.getElementById("name");
    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");
    const submit = document.getElementById("submit");
    const error = document.getElementById("error");

    submit.addEventListener("click", () => {
      if (model.inputValid(name.value, mobile.value, email.value)) {
        error.classList.add("dn");
        const newContact = new model.Contact(
          name.value,
          mobile.value,
          email.value
        );
        console.log(newContact);
        const newArr = [...state.contacts, newContact];
        state.setContacts(newArr);
        name.value = "";
        mobile.value = "";
        email.value = "";
      } else {
        error.classList.remove("dn"); // shows error message
      }
      console.log(state.getContacts())
    });
  };

  const mobileSearch = () => {
    const search = document.getElementById("search");
    const contactContainer = document.querySelector("tbody");
    const div = document.getElementById("noResult");
    search.addEventListener("keyup", (event) => {
      console.log(state.getContacts());
      const result = state.contacts.filter((contact) => {
        return contact.mobile.toString().includes(event.target.value);
      });
      if (!result.length) { // empty search result
        div.classList.remove("dn");
        view.render(contactContainer, " "); // empty contacts summary to indicate no results found
      } else {
        console.log(result);
        filteredContacts = result;
        view.render(contactContainer, view.createTmp(result));
        div.classList.add("dn");
      }
    });
  };

  const sortContactsByName = () => {
    const names = document.getElementById("nameColumn");
    const contactContainer = document.querySelector("tbody");
    names.addEventListener("click", () => {
      clicked = !clicked;
      let sorted;
      if (!filteredContacts.length) { // empty list
        sorted = model.sortContacts(state.getContacts(), clicked);      
      } else {
        sorted = model.sortContacts(filteredContacts, clicked);
      }
      view.render(contactContainer, view.createTmp(sorted));
    });
  };

  return {
    init
  };
})(Model, View);

Controllor.init();