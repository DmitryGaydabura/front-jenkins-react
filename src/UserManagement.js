import React, { useEffect, useState } from 'react';
import api from './api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', age: '' });
  const [editUser, setEditUser] = useState(null);  // Для хранения пользователя, которого редактируем

  // Функция для получения всех пользователей
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/');
      setUsers(response.data);  // Устанавливаем полученные данные в состояние
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Вызов функции для получения данных при загрузке компонента
  useEffect(() => {
    fetchUsers();
  }, []);

  // Функция для добавления нового пользователя
  const handleAddUser = async () => {
    try {
      await api.post('/api/users/', newUser);
      fetchUsers(); // Обновляем список пользователей
      setNewUser({ firstName: '', lastName: '', age: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Функция для подготовки формы для редактирования пользователя
  const handleEditUser = (user) => {
    setEditUser(user);
  };

  // Функция для обновления пользователя
  const handleUpdateUser = async () => {
    try {
      await api.put(`/api/users/${editUser.id}`, editUser);
      fetchUsers(); // Обновляем список пользователей
      setEditUser(null);  // Очищаем форму редактирования
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Функция для удаления пользователя
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      fetchUsers(); // Обновляем список после удаления
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
      <div>
        <h3>Add New User</h3>
        <div className="input-group mb-3">
          <input
              type="text"
              className="form-control"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              placeholder="First Name"
          />
          <input
              type="text"
              className="form-control"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              placeholder="Last Name"
          />
          <input
              type="number"
              className="form-control"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              placeholder="Age"
          />
          <button className="btn btn-primary" onClick={handleAddUser}>
            Add User
          </button>
        </div>

        {editUser && (
            <div>
              <h3>Edit User</h3>
              <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={editUser.firstName}
                    onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                    placeholder="First Name"
                />
                <input
                    type="text"
                    className="form-control"
                    value={editUser.lastName}
                    onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                    placeholder="Last Name"
                />
                <input
                    type="number"
                    className="form-control"
                    value={editUser.age}
                    onChange={(e) => setEditUser({ ...editUser, age: e.target.value })}
                    placeholder="Age"
                />
                <button className="btn btn-success" onClick={handleUpdateUser}>
                  Update User
                </button>
                <button className="btn btn-secondary ms-2" onClick={() => setEditUser(null)}>
                  Cancel
                </button>
              </div>
            </div>
        )}

        <h3>Users List</h3>
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {users.length > 0 ? (
              users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.age}</td>
                    <td>
                      <button className="btn btn-sm btn-warning" onClick={() => handleEditUser(user)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="5" className="text-center">No users found</td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
};

export default UserManagement;
