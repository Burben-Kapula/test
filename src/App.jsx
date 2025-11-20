import { useState, useEffect } from 'react';
import personService from './models/note';
import './App.css'; // додай для стилів

function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [highlightedId, setHighlightedId] = useState(null);

    useEffect(() => {
        personService.getAll().then(initialPersons => setPersons(initialPersons));
    }, []);


    const addPerson = (event) => {
        event.preventDefault();

        const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase());
        const newPerson = { name: newName, number: newNumber };

        if (existingPerson) {
            if (window.confirm(
                `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
            )) {
                personService
                    .update(existingPerson.id, newPerson)
                    .then(updatedPerson => {
                        setPersons(persons.map(p => p.id !== existingPerson.id ? p : updatedPerson));
                        setNewName('');
                        setNewNumber('');
                        setHighlightedId(updatedPerson.id);
                        setTimeout(() => setHighlightedId(null), 1500);
                    })

            }
            return;
        }

        personService.create(newPerson).then(returnedPerson => {
            setPersons(persons.concat(returnedPerson));
            setNewName('');
            setNewNumber('');

            // Підсвітка доданого користувача
            setHighlightedId(returnedPerson.id);
            setTimeout(() => setHighlightedId(null), 1500);
        });
    };

    const deletePerson = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            personService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id));
                });
        }
    };

    const personsToShow = persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h2>Phonebook</h2>

            <div>
                filter shown with: <input value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>

            <h3>Add a new</h3>
            <form onSubmit={addPerson}>
                <div>
                    name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div>
                    number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
                </div>
                <button type="submit">add</button>
            </form>

            <h3>Numbers</h3>
            <ul>
                {personsToShow.map(person => (
                    <li
                        key={person.id}
                        className={person.id === highlightedId ? 'highlight' : ''}
                    >
                        {person.name} — {person.number}
                        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
