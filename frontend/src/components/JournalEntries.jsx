import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const API_BASE = '/api';

const JournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    tenantId: '',
    entryDate: '',
    description: '',
    journalEntryLines: []
  });

  useEffect(() => {
    fetchEntries();
    fetchTenants();
    fetchAccounts();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE}/JournalEntries`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_BASE}/Tenants`);
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ChartOfAccounts`);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const openModal = (entry = null) => {
    setEditingEntry(entry);
    setFormData(entry ? {
      tenantId: entry.tenantId,
      entryDate: entry.entryDate.split('T')[0],
      description: entry.description || '',
      journalEntryLines: entry.journalEntryLines || []
    } : {
      tenantId: '',
      entryDate: '',
      description: '',
      journalEntryLines: []
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingEntry(null);
  };

  const addLine = () => {
    setFormData({
      ...formData,
      journalEntryLines: [...formData.journalEntryLines, { accountId: '', debitAmount: 0, creditAmount: 0 }]
    });
  };

  const updateLine = (index, field, value) => {
    const lines = [...formData.journalEntryLines];
    lines[index][field] = value;
    setFormData({ ...formData, journalEntryLines: lines });
  };

  const removeLine = (index) => {
    const lines = formData.journalEntryLines.filter((_, i) => i !== index);
    setFormData({ ...formData, journalEntryLines: lines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        entryDate: new Date(formData.entryDate).toISOString(),
        journalEntryLines: formData.journalEntryLines.map(line => ({
          ...line,
          debitAmount: parseFloat(line.debitAmount) || 0,
          creditAmount: parseFloat(line.creditAmount) || 0
        }))
      };
      if (editingEntry) {
        await axios.put(`${API_BASE}/JournalEntries/${editingEntry.id}`, data);
      } else {
        await axios.post(`${API_BASE}/JournalEntries`, data);
      }
      fetchEntries();
      closeModal();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`${API_BASE}/JournalEntries/${id}`);
        fetchEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  return (
    <div>
      <h2>Journal Entries</h2>
      <button onClick={() => openModal()}>Add Entry</button>
      {entries.map(entry => (
        <div key={entry.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{entry.description || 'No Description'}</h3>
          <p>Tenant: {entry.tenant?.name}</p>
          <p>Date: {new Date(entry.entryDate).toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              {entry.journalEntryLines.map(line => (
                <tr key={line.id}>
                  <td>{line.account?.accountName}</td>
                  <td>{line.debitAmount}</td>
                  <td>{line.creditAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => openModal(entry)}>Edit</button>
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ content: { width: '80%', height: '80%' } }}>
        <h3>{editingEntry ? 'Edit Entry' : 'Add Entry'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Tenant:
            <select
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              required
            >
              <option value="">Select Tenant</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </select>
          </label>
          <label>
            Entry Date:
            <input
              type="date"
              value={formData.entryDate}
              onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </label>
          <h4>Lines</h4>
          {formData.journalEntryLines.map((line, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                value={line.accountId}
                onChange={(e) => updateLine(index, 'accountId', e.target.value)}
                required
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.accountName}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Debit"
                value={line.debitAmount}
                onChange={(e) => updateLine(index, 'debitAmount', e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Credit"
                value={line.creditAmount}
                onChange={(e) => updateLine(index, 'creditAmount', e.target.value)}
              />
              <button type="button" onClick={() => removeLine(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addLine}>Add Line</button>
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default JournalEntries;