import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const API_BASE = 'https://vigilant-meme-pjrvqgp96545hr79v-5297.app.github.dev/api';

Modal.setAppElement('#root');

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_BASE}/Tenants`);
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const openModal = (tenant = null) => {
    setEditingTenant(tenant);
    setFormData(tenant ? { name: tenant.name } : { name: '' });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingTenant(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTenant) {
        await axios.put(`${API_BASE}/Tenants/${editingTenant.id}`, { ...editingTenant, ...formData });
      } else {
        await axios.post(`${API_BASE}/Tenants`, formData);
      }
      fetchTenants();
      closeModal();
    } catch (error) {
      console.error('Error saving tenant:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await axios.delete(`${API_BASE}/Tenants/${id}`);
        fetchTenants();
      } catch (error) {
        console.error('Error deleting tenant:', error);
      }
    }
  };

  return (
    <div>
      <h2>Tenants</h2>
      <button onClick={() => openModal()}>Add Tenant</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map(tenant => (
            <tr key={tenant.id}>
              <td>{tenant.id}</td>
              <td>{tenant.name}</td>
              <td>{new Date(tenant.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => openModal(tenant)}>Edit</button>
                <button onClick={() => handleDelete(tenant.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h3>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Tenants;