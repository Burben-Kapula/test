import { useState, useEffect } from 'react';
import personService from './servise/persons';
import './App.css';

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

        // Check for empty fields
        if (!newName.trim() || !newNumber.trim()) {
            alert('Please enter both name and number!');
            return;
        }

        // Check for duplicate name (case-insensitive)
        const existingPerson = persons.find(
            p => p.name && newName && p.name.toLowerCase() === newName.toLowerCase()
        );
        const newPerson = { name: newName, number: newNumber };

        // If contact exists, confirm replacement
        if (existingPerson) {
            if (window.confirm(
                `${existingPerson.name} is already in the phonebook. Replace the old number with the new one?`
            )) {
                personService
                    .update(existingPerson.id || existingPerson._id, newPerson)
                    .then(updatedPerson => {
                        setPersons(persons.map(
                            p => (p.id || p._id) !== (existingPerson.id || existingPerson._id) ? p : updatedPerson
                        ));
                        setNewName('');
                        setNewNumber('');
                        setHighlightedId(updatedPerson.id || updatedPerson._id);
                        setTimeout(() => setHighlightedId(null), 1500);
                    })
                    .catch(() => {
                        alert('Error updating contact!');
                    });
            }
            // If cancelled, do nothing
            return;
        }

        // Create new contact
        personService.create(newPerson)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson));
                setNewName('');
                setNewNumber('');
                setHighlightedId(returnedPerson.id || returnedPerson._id);
                setTimeout(() => setHighlightedId(null), 1500);
            })
            .catch(() => {
                alert('Error adding contact!');
            });
    };

    const deletePerson = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            personService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(
                        person => person.id !== id && person._id !== id
                    ));
                })
                .catch(() => {
                    alert('Failed to delete contact!');
                    personService.getAll().then(data => setPersons(data));
                });
        }
    };

    const personsToShow = persons.filter(person =>
        person.name && person.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h2>Phonebook</h2>
            <div>
                Filter shown with: <input value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <h3>Add a new</h3>
            <form onSubmit={addPerson}>
                <div>
                    Name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div>
                    Number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
                </div>
                <button type="submit">Add</button>
            </form>
            <h3>Numbers</h3>
            <ul>
                {personsToShow.map(person => (
                    <li
                        key={person.id || person._id}
                        className={person.id === highlightedId ? 'highlight' : ''}
                    >
                        {person.name} — {person.number}
                        <button onClick={() => deletePerson(person.id || person._id, person.name)}>delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
