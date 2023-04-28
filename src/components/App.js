import { useEffect, useState } from 'react';
import { v4 as uuid } from "uuid";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddContact from './AddContact';
import api from '../api/contacts';
import './App.css';
import ContactList from './ContactList';
import Header from './Header';
import ContactDetail from './ContactDetail';
import EditContact from './EditContact';

function App() {
  //const LOCAL_STORAGE_KEY="contacts"
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const retriveContacts = async () => {
    const response = await api.get('/contacts');
    return response.data;
  }

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const { id} = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact;
      })
    );
  };


  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact,
    };

    const response = await api.post("/contacts", request);
    console.log(response);
    setContacts([...contacts, response.data]);
  }

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`)
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    })
    setContacts(newContactList);
  }

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    } else {
      setSearchResults(contacts);
    }
  };

  useEffect(() => {
    const getAllCOntacts = async () => {
      const allContacts = await retriveContacts();
      if (allContacts) setContacts(allContacts);
    };

    getAllCOntacts();
  }, []);

  useEffect(() => {
    //localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(contacts))
  }, [contacts]);


  return (
    <div className='ui container'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ContactList contacts={searchTerm.length < 1 ? contacts : searchResults} getContactId={removeContactHandler} term={searchTerm}
            searchKeyword={searchHandler} />} />
          <Route path='/add' element={<AddContact addContactHandler={addContactHandler} />} />
          <Route path='/edit' element={<EditContact updateContactHandler={updateContactHandler} />} />
          <Route path='/contact/:id' element={<ContactDetail />} />
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
