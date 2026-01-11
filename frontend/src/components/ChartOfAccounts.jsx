import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const API_BASE = '/api';

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    tenantId: '',
    accountName: '',
    accountType: '',
    accountCode: '',
    description: ''
  });

  useEffect(() => {
    fetchAccounts();
    fetchTenants();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ChartOfAccounts`);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
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

  const openModal = (account = null) => {
    setEditingAccount(account);
    setFormData(account ? {
      tenantId: account.tenantId,
      accountName: account.accountName,
      accountType: account.accountType,
      accountCode: account.accountCode || '',
      description: account.description || ''
    } : {
      tenantId: '',
      accountName: '',
      accountType: '',
      accountCode: '',
      description: ''
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingAccount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        await axios.put(`${API_BASE}/ChartOfAccounts/${editingAccount.id}`, { ...editingAccount, ...formData });
      } else {
        await axios.post(`${API_BASE}/ChartOfAccounts`, formData);
      }
      fetchAccounts();
      closeModal();
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await axios.delete(`${API_BASE}/ChartOfAccounts/${id}`);
        fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div>
      <h2>Chart of Accounts</h2>
      <button onClick={() => openModal()}>Add Account</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tenant</th>
            <th>Account Name</th>
            <th>Account Type</th>
            <th>Account Code</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.tenant?.name}</td>
              <td>{account.accountName}</td>
              <td>{account.accountType}</td>
              <td>{account.accountCode}</td>
              <td>{account.description}</td>
              <td>
                <button onClick={() => openModal(account)}>Edit</button>
                <button onClick={() => handleDelete(account.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h3>{editingAccount ? 'Edit Account' : 'Add Account'}</h3>
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
            Account Name:
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              required
            />
          </label>
          <label>
            Account Type:
            <select
              value={formData.accountType}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
              required
            >
              <option value="">Select Type</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Equity">Equity</option>
              <option value="Revenue">Revenue</option>
              <option value="Expense">Expense</option>
            </select>
          </label>
          <label>
            Account Code:
            <input
              type="text"
              value={formData.accountCode}
              onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
            />
          </label>
          <label>
            Description:
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default ChartOfAccounts;