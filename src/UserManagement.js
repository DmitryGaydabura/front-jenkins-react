import React, { useEffect, useState } from 'react';
import api from './api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', age: '' });
  const [editUser, setEditUser] = useState(null); // Для хранения пользователя, которого редактируем
  const [error, setError] = useState(null); // Для сообщений об ошибках

  // Функция для получения всех пользователей
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data); // Устанавливаем полученные данные в состояние
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте снова.');
    }
  };

  // Вызов функции для получения данных при загрузке компонента
  useEffect(() => {
    fetchUsers();
  }, []);

  // Функция для добавления нового пользователя
  const handleAddUser = async () => {
    // Проверка обязательных полей
    if (!newUser.firstName.trim() || !newUser.lastName.trim() || !newUser.age) {
      setError('Имя, фамилия и возраст обязательны для добавления пользователя.');
      return;
    }

    // Преобразование возраста в число
    const userToAdd = {
      firstName: newUser.firstName.trim(),
      lastName: newUser.lastName.trim(),
      age: Number(newUser.age)  // Убедитесь, что возраст передается как число
    };

    try {
      // Отправка POST-запроса
      await api.post('/api/users', userToAdd);
      fetchUsers(); // Обновляем список пользователей
      setNewUser({ firstName: '', lastName: '', age: '' });
      setError(null);
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Не удалось добавить пользователя: ${error.response.data.message}`);
      } else {
        setError('Не удалось добавить пользователя. Пожалуйста, попробуйте снова.');
      }
    }
  };


  // Функция для подготовки формы для редактирования пользователя
  const handleEditUser = (user) => {
    setEditUser(user);
    setError(null);
  };

  // Функция для обновления пользователя
  const handleUpdateUser = async () => {
    // Проверка обязательных полей
    if (!editUser.firstName.trim() || !editUser.lastName.trim() || !editUser.age) {
      setError('Имя, фамилия и возраст обязательны для обновления пользователя.');
      return;
    }

    // Преобразование возраста в число
    const userToUpdate = { ...editUser, age: Number(editUser.age) };

    try {
      await api.put('/api/users', userToUpdate); // Обновление без добавления ID в URL
      fetchUsers(); // Обновляем список пользователей
      setEditUser(null); // Очищаем форму редактирования
      setError(null);
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Не удалось обновить пользователя: ${error.response.data.message}`);
      } else {
        setError('Не удалось обновить пользователя. Пожалуйста, попробуйте снова.');
      }
    }
  };

  // Функция для удаления пользователя
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await api.delete('/api/users', { params: { id } }); // Используем params для передачи query-параметров
      fetchUsers(); // Обновляем список после удаления
      setError(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Не удалось удалить пользователя: ${error.response.data.message}`);
      } else {
        setError('Не удалось удалить пользователя. Пожалуйста, попробуйте снова.');
      }
    }
  };

  return (
      <div>
        <h3>Управление пользователями</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Форма добавления нового пользователя */}
        <div className="input-group mb-3">
          <input
              type="text"
              className="form-control"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              placeholder="Имя"
          />
          <input
              type="text"
              className="form-control"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              placeholder="Фамилия"
          />
          <input
              type="number"
              className="form-control"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              placeholder="Возраст"
          />
          <button className="btn btn-primary" onClick={handleAddUser}>
            Добавить пользователя
          </button>
        </div>

        {/* Форма редактирования пользователя */}
        {editUser && (
            <div>
              <h4>Редактировать пользователя</h4>
              <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={editUser.firstName}
                    onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                    placeholder="Имя"
                />
                <input
                    type="text"
                    className="form-control"
                    value={editUser.lastName}
                    onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                    placeholder="Фамилия"
                />
                <input
                    type="number"
                    className="form-control"
                    value={editUser.age}
                    onChange={(e) => setEditUser({ ...editUser, age: e.target.value })}
                    placeholder="Возраст"
                />
                <button className="btn btn-success" onClick={handleUpdateUser}>
                  Обновить пользователя
                </button>
                <button className="btn btn-secondary ms-2" onClick={() => setEditUser(null)}>
                  Отмена
                </button>
              </div>
            </div>
        )}

        {/* Список пользователей */}
        <h4>Список пользователей</h4>
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Возраст</th>
            <th>Действия</th>
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
                        Редактировать
                      </button>
                      <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeleteUser(user.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Пользователи не найдены
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
};

export default UserManagement;
